"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/utils/phone";
import { formatAuthError } from "@/lib/utils/authErrors";
import { isClientLoginRateLimited } from "@/lib/rateLimit";

export type ClientAuthActionState = {
  error: string | null;
};

async function getClientIp(): Promise<string> {
  const forwardedFor = (await headers()).get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

/**
 * Crée le compte Fillo d'un client (email + mot de passe, même mécanisme
 * natif que les boutiques — l'auth téléphone Supabase exigerait un provider
 * SMS payant). Le téléphone est déjà connu (fiche `clients` créée via le
 * formulaire public) : une fois le compte créé, `link_client_identity`
 * rattache cette fiche - et toute autre fiche existante avec le même
 * numéro chez d'autres boutiques - au nouveau compte.
 */
export async function createClientAccountAction(
  _prevState: ClientAuthActionState,
  formData: FormData,
): Promise<ClientAuthActionState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!phone || !email || !password) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: formatAuthError(error.message) };
  }
  if (!data.session) {
    return {
      error:
        "Vérifiez votre boîte email pour confirmer votre compte, puis reconnectez-vous avec votre numéro de téléphone.",
    };
  }

  const { error: linkError } = await supabase.rpc("link_client_identity", {
    p_phone: phone,
  });

  if (linkError) {
    return { error: linkError.message };
  }

  return { error: null };
}

/**
 * Connecte un client existant avec téléphone + mot de passe. L'email réel
 * associé au compte n'est jamais transmis au navigateur : il est résolu ici,
 * côté serveur, via `resolve_client_login_email`, puis utilisé directement
 * pour `signInWithPassword`.
 */
export async function loginClientAction(
  _prevState: ClientAuthActionState,
  formData: FormData,
): Promise<ClientAuthActionState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!phone || !password) {
    return { error: "Merci de remplir tous les champs." };
  }

  const ip = await getClientIp();
  if (await isClientLoginRateLimited(ip)) {
    return { error: "Trop de tentatives. Merci de réessayer plus tard." };
  }

  const supabase = await createClient();
  const { data: email, error: resolveError } = await supabase.rpc(
    "resolve_client_login_email",
    { p_phone: normalizePhone(phone) },
  );

  if (resolveError || !email) {
    return { error: "Numéro de téléphone ou mot de passe incorrect." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Numéro de téléphone ou mot de passe incorrect." };
  }

  redirect("/mes-conversations");
}

/** Déconnecte le client courant et le renvoie vers la page de connexion client. */
export async function logoutClientAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/mes-conversations/connexion");
}
