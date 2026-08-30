import type { MetadataRoute } from "next";

/**
 * Fillo n'est pas une marketplace : seule la home a un intérêt SEO. Les pages
 * boutique publiques (/[shopSlug]) et les pages privées de l'app n'ont rien à
 * faire dans les résultats de recherche, donc tout est bloqué sauf "/" exact
 * (le "$" ancre la règle sur l'URL exacte, seule technique fiable pour
 * n'autoriser que la home sans énumérer chaque route existante).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/$",
      disallow: "/",
    },
  };
}
