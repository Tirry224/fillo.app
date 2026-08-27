/**
 * Vérifie qu'un chemin de redirection reste interne à l'application, pour
 * éviter qu'un paramètre "next" contrôlé par l'utilisateur ne serve à
 * rediriger vers un site externe (open redirect).
 */
export function isSafeRedirectPath(value: string): boolean {
  return (
    value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
  );
}
