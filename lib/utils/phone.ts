/** Ne garde que les chiffres d'un numéro de téléphone saisi librement. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}
