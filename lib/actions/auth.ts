"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSlug } from "@/lib/utils/slug";

export type AuthActionState = {
  error: string | null;
  info?: string | null;
};

function formatAuthError(message: string): string {
  if (message.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (
    message.includes("User already registered") ||
    message.includes("user_already_exists")
  ) {
    return "Un compte existe déjà avec cette adresse email.";
  }
  if (
    message.includes("Invalid login credentials") ||
    message.includes("invalid_credentials")
  ) {
    return "Adresse email ou mot de passe incorrect.";
  }
  if (message.includes("rate limit")) {
    return "Trop de tentatives. Veuillez patienter quelques minutes.";
  }
  if (message.includes("Email not confirmed")) {
    return "Merci de confirmer votre adresse email avant de vous connecter (voir l'email envoyé lors de l'inscription).";
  }
  return message;
}

function safeNext(nextValue: FormDataEntryValue | null): string {
  const value = typeof nextValue === "string" ? nextValue : "";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/dashboard";
  }
  return value;
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
