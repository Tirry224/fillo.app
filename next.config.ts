import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Autorise le serveur de dev à répondre aux requêtes venant du téléphone de test,
  // accédé via l'IP locale (http://192.168.4.21:3001) plutôt que localhost.
  allowedDevOrigins: ["192.168.4.21"],
};

export default nextConfig;
