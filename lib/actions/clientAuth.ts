"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
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

type AuthResult = { error: string | null };

/**
 * Crée le compte Fillo d'un client (email + mot de passe, même mécanisme
 * natif que les boutiques — l'auth téléphone Supabase exigerait un provider
 * SMS payant) puis rattache sa fiche `clients` existante (et toute autre
 * fiche partageant le même numéro chez d'autres boutiques) via
 * `link_client_identity`.
 */
async function signUpClient(
  supabase: SupabaseClient<Database>,
  email: string,
  password: string,
  phone: string,
): Promise<AuthResult> {
  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

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

  return { error: linkError?.message ?? null };
}

/**
 * Connecte un client existant avec téléphone + mot de passe. L'email réel
 * associé au compte n'est jamais transmis au navigateur : il est résolu ici,
 * côté serveur, via `resolve_client_login_email`, puis utilisé directement
 * pour `signInWithPassword`.
 */
async function signInClientByPhone(
  supabase: SupabaseClient<Database>,
  phone: string,
  password: string,
): Promise<AuthResult> {
  const ip = await getClientIp();
  if (await isClientLoginRateLimited(ip)) {
    return { error: "Trop de tentatives. Merci de réessayer plus tard." };
  }

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

  return { error: null };
}

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

  const supabase = await createClient();
  return signUpClient(supabase, email, password, phone);
}

export async function loginClientAction(
  _prevState: ClientAuthActionState,
  formData: FormData,
): Promise<ClientAuthActionState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!phone || !password) {
    return { error: "Merci de remplir tous les champs." };
  }

  const supabase = await createClient();
  const result = await signInClientByPhone(supabase, phone, password);
  if (result.error) {
    return result;
  }

  redirect("/mes-conversations");
}

/** Déconnecte le client courant et le renvoie vers la page de connexion client. */
export async function logoutClientAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/mes-conversations/connexion");
}

/**
 * true si un compte Fillo existe déjà pour ce numéro : utilisé par la popup
 * "Commencer une conversation" pour savoir si elle doit proposer de créer un
 * compte ou de se connecter.
 */
export async function checkClientAccountExistsAction(phone: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("resolve_client_login_email", {
    p_phone: normalizePhone(phone),
  });
  return Boolean(data);
}

export type StartConversationState = { error: string | null };

/**
 * Termine le parcours "Commencer une conversation" depuis le formulaire
 * public : authentifie le client (création de compte ou connexion selon
 * `mode`), rattache sa fiche `clients` (déjà créée par `submit_public_request`
 * avant l'ouverture de cette popup) à son compte, puis crée - ou réutilise -
 * la conversation avec cette boutique et y poste le texte de sa demande
 * comme premier message.
 */
export async function startConversationAction(
  _prevState: StartConversationState,
  formData: FormData,
): Promise<StartConversationState> {
  const clientId = String(formData.get("clientId") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const requestText = String(formData.get("requestText") ?? "").trim();
  const mode = String(formData.get("mode") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!clientId || !phone || !requestText || !password) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (mode !== "create" && mode !== "login") {
    return { error: "Requête invalide." };
  }

  const supabase = await createClient();

  const authResult =
    mode === "create"
      ? await signUpClient(supabase, String(formData.get("email") ?? "").trim(), password, phone)
      : await signInClientByPhone(supabase, phone, password);

  if (authResult.error) {
    return authResult;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Utilisateur non authentifié." };
  }

  const { data: clientRow, error: clientRowError } = await supabase
    .from("clients")
    .select("shop_id")
    .eq("id", clientId)
    .single();

  if (clientRowError || !clientRow) {
    return { error: "Impossible de retrouver votre fiche." };
  }

  let conversationId: string | null = null;
  const insertConv = await supabase
    .from("conversations")
    .insert({ shop_id: clientRow.shop_id, client_id: clientId })
    .select("id")
    .single();

  if (insertConv.error) {
    if (insertConv.error.code !== "23505") {
      return { error: "Impossible de démarrer la conversation." };
    }
    const existing = await supabase
      .from("conversations")
      .select("id")
      .eq("shop_id", clientRow.shop_id)
      .eq("client_id", clientId)
      .single();
    conversationId = existing.data?.id ?? null;
  } else {
    conversationId = insertConv.data.id;
  }

  if (!conversationId) {
    return { error: "Impossible de démarrer la conversation." };
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_role: "client",
    sender_user_id: user.id,
    body: requestText,
  });

  redirect(`/mes-conversations/${conversationId}`);
}
