import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container, Typography } from "@/app/components";

export function PrivacyPage() {
  return (
    <Container className="gap-6">
      <Link
        aria-label="Retour"
        className="inline-flex items-center gap-2 text-xl leading-none text-navy"
        href="/"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        <span className="text-sm font-bold">Retour</span>
      </Link>

      <Typography component="h1" variant="h2">
        Confidentialité &amp; mentions légales
      </Typography>

      <Typography component="p" variant="body-base">
        Fillo est un projet en phase de lancement, pas encore constitué en
        société. Cette page décrit de façon simple les données traitées et
        comment nous contacter ; elle sera complétée avec les informations
        légales de l&apos;entreprise dès sa constitution.
      </Typography>

      <div className="grid gap-4">
        <div className="grid gap-1">
          <Typography component="h2" variant="h4">
            Données collectées
          </Typography>
          <Typography component="p" variant="body-base">
            Quand un client remplit le formulaire public d&apos;une boutique,
            nous enregistrons son nom, son numéro WhatsApp, le message de sa
            demande et, si fournies, jusqu&apos;à 3 photos. Ces informations
            sont transmises uniquement au commerçant concerné, pour lui
            permettre de traiter la demande.
          </Typography>
        </div>

        <div className="grid gap-1">
          <Typography component="h2" variant="h4">
            Utilisation des données
          </Typography>
          <Typography component="p" variant="body-base">
            Les données servent exclusivement à la gestion de la relation
            entre un commerçant et ses clients (suivi des ventes et des
            demandes). Elles ne sont ni vendues, ni partagées avec des tiers
            à des fins commerciales.
          </Typography>
        </div>

        <div className="grid gap-1">
          <Typography component="h2" variant="h4">
            Vos droits
          </Typography>
          <Typography component="p" variant="body-base">
            Vous pouvez demander l&apos;accès, la correction ou la
            suppression de vos données en écrivant à{" "}
            <a className="underline" href="mailto:boubatirry224@gmail.com">
              boubatirry224@gmail.com
            </a>
            .
          </Typography>
        </div>
      </div>
    </Container>
  );
}
