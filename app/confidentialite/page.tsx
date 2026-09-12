import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LegalPage, LegalSection, ToFill } from "@/components/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Traitement des données personnelles sur le site de ${site.name}.`,
  alternates: { canonical: "/confidentialite" },
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      label="Confidentialité"
      updated="12 septembre 2026"
    >
      <LegalSection heading="En résumé">
        <p>
          Ce site ne dépose aucun cookie publicitaire et ne suit pas votre
          navigation d&apos;un site à l&apos;autre. Les seules données collectées
          sont celles que vous saisissez vous-même dans les formulaires, et elles
          servent uniquement à répondre à votre demande.
        </p>
      </LegalSection>

      <LegalSection heading="Responsable du traitement">
        <p>
          {site.name} — {site.address.street}, {site.address.zip}{" "}
          {site.address.city}. Contact : {site.email} ou {site.phone}.
        </p>
      </LegalSection>

      <LegalSection heading="Données collectées">
        <p>
          Lorsque vous envoyez une demande de devis ou de rendez-vous, nous
          recueillons :
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>votre nom et votre numéro de téléphone ;</li>
          <li>votre adresse e-mail, si vous la renseignez ;</li>
          <li>
            les informations relatives à votre véhicule : type, marque, modèle,
            année, kilométrage, immatriculation si vous la renseignez ;
          </li>
          <li>la description de votre besoin et vos disponibilités.</li>
        </ul>
        <p>
          Aucune donnée sensible au sens du RGPD n&apos;est demandée. Ne faites
          figurer aucune information de santé, bancaire ou d&apos;identité dans
          le champ de description.
        </p>
      </LegalSection>

      <LegalSection heading="Finalité et base légale">
        <p>
          Ces données servent exclusivement à vous recontacter, à établir un
          devis et à organiser votre passage à l&apos;atelier. La base légale est
          l&apos;exécution de mesures précontractuelles prises à votre demande
          (article 6.1.b du RGPD).
        </p>
        <p>
          Elles ne sont ni vendues, ni louées, ni utilisées à des fins de
          prospection sans votre accord.
        </p>
      </LegalSection>

      <LegalSection heading="Durée de conservation">
        <p>
          Les demandes sans suite sont supprimées au bout de{" "}
          <strong className="text-bone">12 mois</strong>. Lorsque la demande
          débouche sur une intervention, les informations nécessaires au suivi de
          l&apos;entretien du véhicule sont conservées pendant la durée légale
          applicable aux documents comptables.
        </p>
      </LegalSection>

      <LegalSection heading="Destinataires">
        <p>
          Seule l&apos;équipe de l&apos;atelier accède à ces informations. Elles
          transitent par nos prestataires techniques d&apos;hébergement et
          d&apos;envoi d&apos;e-mails, dans l&apos;Union européenne :{" "}
          <ToFill>liste à compléter à la mise en ligne</ToFill>.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies et mesure d'audience">
        <p>
          Aucun cookie publicitaire ni traceur tiers n&apos;est déposé. La mesure
          d&apos;audience, si elle est activée, est réalisée sans cookie et sans
          identification individuelle — c&apos;est pourquoi aucune bannière de
          consentement ne vous est imposée.
        </p>
        <p>
          La carte Google Maps n&apos;est chargée qu&apos;au moment où vous
          l&apos;affichez.
        </p>
      </LegalSection>

      <LegalSection heading="Vos droits">
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de limitation et d&apos;opposition sur vos données.
          Pour les exercer, écrivez à {site.email} ou appelez le {site.phone}.
          Nous répondons sous un mois.
        </p>
        <p>
          En cas de désaccord persistant, vous pouvez saisir la CNIL —{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            cnil.fr
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
