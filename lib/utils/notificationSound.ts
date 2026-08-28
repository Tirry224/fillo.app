/**
 * Joue un court bip généré via Web Audio, sans fichier audio à héberger.
 * Ne fait rien si le contexte n'est pas disponible (SSR, navigateur trop
 * ancien, ou lecture bloquée tant qu'aucune interaction utilisateur n'a eu
 * lieu sur la page).
 */
export function playNotificationSound() {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.4);
    oscillator.onended = () => context.close();
  } catch {
    // Lecture audio indisponible (politique du navigateur) : sans impact,
    // l'indicateur visuel de la navigation prend le relais.
  }
}
