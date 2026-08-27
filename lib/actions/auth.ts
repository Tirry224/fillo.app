"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createSlug } from "@/lib/utils/slug";
import { isSafeRedirectPath } from "@/lib/utils/redirect";
import { formatAuthError } from "@/lib/utils/authErrors";

export type AuthActionState = {
  error: string | null;
  info?: string | null;
};

function safeNext(nextValue: FormDataEntryValue | null): string {
  const value = typeof nextValue === "string" ? nextValue : "";
  return isSafeRedirectPath(value) ? value : "/dashboard";
}

/**
 * Origine de la requête en cours (protocole + domaine), déduite des en-têtes
 * plutôt que d'une valeur soumise par le client : nécessaire pour construire
 * un lien de réinitialisation de mot de passe valide, quel que soit
 * l'environnement (développement local, production).
 */
async function getRequestOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

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

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

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
