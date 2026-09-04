"use client";

import { useEffect } from "react";

/** Enregistre le service worker (public/sw.js) nécessaire aux notifications push. Ne rend rien. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Pas critique : sans service worker, les notifications push restent
        // simplement indisponibles (le bouton d'activation ne s'affichera pas).
      });
    }
  }, []);

  return null;
}
