import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fillo",
    short_name: "Fillo",
    description: "Gérez vos clients et vos ventes depuis WhatsApp avec Fillo.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef0f3",
    theme_color: "#273452",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
