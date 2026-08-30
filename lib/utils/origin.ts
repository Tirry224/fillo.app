import { headers } from "next/headers";

/**
 * Origine de la requête en cours (protocole + domaine), déduite des en-têtes
 * plutôt que d'une variable d'environnement à maintenir à jour : elle reste
 * donc correcte quel que soit l'environnement (développement local,
 * prévisualisation Vercel, production) sans configuration supplémentaire.
 */
export async function getRequestOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}
