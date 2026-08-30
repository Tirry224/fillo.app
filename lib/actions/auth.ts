"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSlug } from "@/lib/utils/slug";
import { isSafeRedirectPath } from "@/lib/utils/redirect";
import { formatAuthError } from "@/lib/utils/authErrors";
import { getRequestOrigin } from "@/lib/utils/origin";

export type AuthActionState = {
  error: string | null;
  info?: string | null;
};

/**
 * Lit le champ caché "next" d'un formulaire d'auth et ne le garde que s'il
 * pointe vers une page interne (voir `isSafeRedirectPath`), pour empêcher
 * qu'un lien piégé redirige l'utilisateur vers un site externe après
 * connexion/inscription (open redirect). Par défaut, direction "/dashboard".
 */
function safeNext(nextValue: FormDataEntryValue | null): string {
  const value = typeof nextValue === "string" ? nextValue : "";
  return isSafeRedirectPath(value) ? value : "/dashboard";
}

/**
 * Crée un compte commerçant : inscription Supabase Auth puis création de la
 * boutique (RPC `register_shop`, qui génère aussi le slug de l'URL
 * publique). Si la confirmation d'email est activée côté Supabase,
 * `data.session` est absent juste après `signUp` : on arrête alors ici avec
 * un message d'attente, et la boutique sera créée à la première visite
 * authentifiée (voir `ensureShopExists` dans `lib/data.ts`) plutôt qu'ici.
 */
export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const shopName = String(formData.get("shopName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !shopName || !password) {
    return { error: "Merci de remplir tous les champs." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { shop_name: shopName } },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  if (!data.user) {
    return { error: "Impossible de créer le compte utilisateur." };
  }

  if (!data.session) {
    return {
      error: null,
      info: "Vérifiez votre boîte email pour confirmer votre compte, puis connectez-vous.",
    };
  }

  const { error: rpcError } = await supabase.rpc("register_shop", {
    shop_name: shopName,
    shop_slug: createSlug(shopName),
  });

  if (rpcError) {
    return { error: rpcError.message };
  }

  redirect(next);
}

/** Connecte un commerçant existant par email/mot de passe et le redirige vers `next` (ou "/dashboard"). */
export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Merci de remplir tous les champs." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  redirect(next);
}

/** Déconnecte l'utilisateur courant et le renvoie vers la page de connexion. */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Change le mot de passe depuis les réglages, en exigeant l'ancien mot de
 * passe (`signInWithPassword` sert ici uniquement à le vérifier, pas à créer
 * une nouvelle session) : ça empêche quelqu'un qui trouverait un appareil
 * déjà connecté de changer le mot de passe sans le connaître.
 */
export async function updatePasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!currentPassword) {
    return { error: "Merci de saisir votre mot de passe actuel." };
  }
  if (!newPassword || newPassword.length < 6) {
    return { error: "Le nouveau mot de passe doit contenir au moins 6 caractères." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Utilisateur non authentifié." };
  }

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (reauthError) {
    return { error: "Mot de passe actuel incorrect." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  return { error: null, info: "Mot de passe mis à jour avec succès." };
}

const RESET_REQUEST_INFO =
  "Si un compte existe avec cette adresse email, un lien de réinitialisation vient de vous être envoyé.";

/**
 * Envoie un email de réinitialisation de mot de passe. Renvoie toujours le
 * même message de succès générique que l'email existe ou non (pour ne pas
 * révéler quelles adresses ont un compte), sauf en cas de dépassement du
 * quota d'envoi Supabase, seul cas où l'on informe l'utilisateur du problème
 * réel sans rien divulguer sur l'existence du compte.
 */
export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Merci de saisir votre adresse email." };
  }

  const supabase = await createClient();
  const origin = await getRequestOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reinitialiser-mot-de-passe`,
  });

  // On ne révèle jamais si l'email existe ou non (sécurité), sauf pour un
  // dépassement de quota d'envoi, utile à signaler sans rien divulguer.
  if (error?.message.includes("rate limit")) {
    return { error: formatAuthError(error.message) };
  }

  return { error: null, info: RESET_REQUEST_INFO };
}

/**
 * Définit le nouveau mot de passe après un clic sur le lien reçu par email.
 * `supabase.auth.getUser()` ne renvoie un utilisateur que si le lien de
 * réinitialisation a bien établi une session temporaire ; sans utilisateur,
 * le lien est expiré ou invalide. Déconnecte ensuite l'utilisateur pour
 * qu'il se reconnecte avec son nouveau mot de passe.
 */
export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!newPassword || newPassword.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error:
        "Ce lien de réinitialisation n'est plus valide. Merci d'en demander un nouveau.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  await supabase.auth.signOut();
  redirect("/login?reset=success");
}
