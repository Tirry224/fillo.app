/**
 * Convertit un nom de boutique en identifiant d'URL (slug) : minuscules,
 * sans accents ni caractères spéciaux, mots séparés par des tirets.
 * Sert à construire le lien public de la boutique (fillo.app/{slug}).
 * Retombe sur "ma-boutique" si le nom ne contient aucun caractère
 * alphanumérique, pour ne jamais générer un slug vide.
 */
export function createSlug(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "ma-boutique"
  );
}
