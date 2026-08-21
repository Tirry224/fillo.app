import { Typography } from "@/components";

export function HomeIntro() {
  return (
    <div className="grid gap-4">
      <Typography component="h1" className="max-w-[340px]" variant="display">
        Ne perdez plus aucun client WhatsApp.
      </Typography>
      <Typography component="p" className="max-w-[360px]" variant="caption2">
        Un lien unique en bio. Chaque demande devient une fiche client. Rien ne
        se perd dans la conversation.
      </Typography>
    </div>
  );
}
