import { emailAtelier, emailClient, emailConfirmation } from "@/lib/email-templates";
import type { Demande } from "@/lib/demande";

/**
 * Aperçu des e-mails dans un navigateur, sans en envoyer aucun.
 *
 * L'e-mail reçu par l'atelier est l'écran qu'il consultera plusieurs fois par
 * jour, sur un téléphone. Il mérite donc d'être recetté comme une page — ce
 * que cette route rend possible.
 *
 * Fermée par défaut : elle ne répond que si APERCU_EMAIL vaut "1". Elle
 * n'expose aucune donnée réelle, mais un site de client n'a pas à traîner
 * d'outil de développement accessible.
 */

export const dynamic = "force-dynamic";

const EXEMPLE: Demande = {
  mode: "devis",
  vehicule: "Scooter",
  marque: "Yamaha",
  modele: "XMAX 125 Tech Max",
  annee: "2019",
  km: "24 000",
  immatriculation: "ab-123-cd",
  prestation: "freinage",
  message:
    "Bruit au freinage à froid depuis une semaine, surtout le matin.\nÇa disparaît après quelques kilomètres.",
  disponibilite: "semaine",
  date: "2026-09-20",
  creneau: "matin",
  nom: "Jean-Baptiste Delacroix-Fontaine",
  telephone: "06 12 34 56 78",
  email: "jean-baptiste.delacroix@exemple.fr",
  consentement: true,
  societe: "",
};

export async function GET(request: Request) {
  if (process.env.APERCU_EMAIL !== "1") {
    return new Response("Aperçu désactivé.", { status: 404 });
  }

  const params = new URL(request.url).searchParams;
  const mode = params.get("mode") === "rdv" ? "rdv" : "devis";
  const type = params.get("type");

  const demande: Demande = { ...EXEMPLE, mode };
  const { html } =
    type === "client"
      ? emailClient(demande)
      : type === "confirmation"
        ? emailConfirmation(demande, "Samedi 20 septembre 2026, le matin, entre 10h et 13h")
        : emailAtelier(demande);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
