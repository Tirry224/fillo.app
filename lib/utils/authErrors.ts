/** Traduit les messages d'erreur bruts de Supabase Auth en texte compréhensible pour l'utilisateur. */
export function formatAuthError(message: string): string {
  if (message.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (
    message.includes("User already registered") ||
    message.includes("user_already_exists") ||
    message.includes("email_exists")
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
