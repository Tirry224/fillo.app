import { Resend } from "resend";

export type NewRequestNotification = {
  shopEmail: string;
  shopName: string;
  clientName: string;
  message: string;
};

/**
 * Envoie un email au commerçant quand un client lui soumet une nouvelle
 * demande. Ne doit jamais faire échouer le flux appelant : les erreurs sont
 * loguées et avalées ici, à charge de l'appelant de ne pas attendre de
 * garantie de livraison.
 */
export async function sendNewRequestNotification({
  shopEmail,
  shopName,
  clientName,
  message,
}: NewRequestNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `Fillo <${fromEmail}>`,
      to: shopEmail,
      subject: `Nouvelle demande de ${clientName}`,
      text: `${clientName} vous a envoyé une nouvelle demande sur ${shopName} :\n\n${message}`,
    });
  } catch (error) {
    console.error("Échec de l'envoi de l'email de notification", error);
  }
}
