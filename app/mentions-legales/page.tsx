import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LegalPage, LegalSection, ToFill } from "@/components/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site de ${site.name}, atelier moto et scooter à ${site.address.district}.`,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      label="Mentions légales"
      updated="12 septembre 2026"
    >
      <LegalSection heading="Éditeur du site">
        <p>
          <strong className="text-bone">{site.name}</strong>
          <br />
          {site.address.street}
          <br />
          {site.address.zip} {site.address.city}
          <br />
          Téléphone : {site.phone}
          <br />
          E-mail : {site.email}
        </p>
        <p>
          Forme juridique : <ToFill>à compléter</ToFill> — SIRET :{" "}
          <ToFill>à compléter</ToFill> — Numéro de TVA intracommunautaire :{" "}
          <ToFill>à compléter</ToFill>
        </p>
        <p>
          Directeur de la publication : <ToFill>à compléter</ToFill>
        </p>
      </LegalSection>

      <LegalSection heading="Hébergement">
        <p>
          Le site est hébergé par <ToFill>à compléter à la mise en ligne</ToFill>.
        </p>
      </LegalSection>

      <LegalSection heading="Assurance professionnelle">
        <p>
          Assureur : <ToFill>à compléter</ToFill> — Numéro de contrat :{" "}
          <ToFill>à compléter</ToFill> — Couverture géographique :{" "}
          <ToFill>à compléter</ToFill>
        </p>
      </LegalSection>

      <LegalSection heading="Propriété intellectuelle">
        <p>
          L&apos;ensemble des contenus de ce site — textes, photographies,
          identité visuelle, mise en page — est protégé par le droit de la
          propriété intellectuelle. Toute reproduction, même partielle, est
          interdite sans autorisation écrite préalable.
        </p>
      </LegalSection>

      <LegalSection heading="Tarifs et disponibilités">
        <p>
          Les tarifs présentés sur ce site sont donnés à titre indicatif,
          main-d&apos;œuvre comprise, pour les modèles les plus courants. Ils ne
          constituent pas une offre contractuelle. Le prix exact est confirmé par
          un devis gratuit établi après examen du véhicule.
        </p>
        <p>
          Les demandes de rendez-vous envoyées depuis ce site ne valent pas
          réservation ferme : un créneau n&apos;est confirmé qu&apos;après
          validation par l&apos;atelier.
        </p>
      </LegalSection>

      <LegalSection heading="Responsabilité">
        <p>
          L&apos;atelier s&apos;efforce de maintenir les informations de ce site
          exactes et à jour, sans garantir qu&apos;elles soient exemptes
          d&apos;erreur. Les liens vers des sites tiers, notamment cartographiques,
          n&apos;engagent pas sa responsabilité.
        </p>
      </LegalSection>

      <LegalSection heading="Médiation de la consommation">
        <p>
          Conformément à l&apos;article L.612-1 du code de la consommation, tout
          consommateur a le droit de recourir gratuitement à un médiateur de la
          consommation en vue de la résolution amiable d&apos;un litige.
          Médiateur désigné : <ToFill>à compléter</ToFill>
        </p>
      </LegalSection>

      <LegalSection heading="Données personnelles">
        <p>
          Le traitement des données transmises via les formulaires est décrit
          dans la{" "}
          <a href="/confidentialite" className="text-accent underline">
            politique de confidentialité
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
