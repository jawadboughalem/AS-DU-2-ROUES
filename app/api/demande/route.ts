import { Resend } from "resend";
import { demandeSchema } from "@/lib/demande";
import { emailAtelier, emailClient } from "@/lib/email-templates";
import { site } from "@/lib/site";

/**
 * Réception des demandes de devis et de rendez-vous.
 *
 * Deux e-mails partent : l'un vers l'atelier, l'autre en accusé de réception
 * vers le client s'il a laissé une adresse. L'échec de l'accusé ne fait pas
 * échouer la demande — l'atelier a reçu l'information, c'est ce qui compte.
 */

export const dynamic = "force-dynamic";

/**
 * Les variables sont lues à chaque requête, et non au chargement du module.
 * Cela garantit qu'aucune valeur ne peut être capturée au moment de la
 * construction, et qu'une correction de configuration prend effet sans
 * reconstruire le site.
 */
function configuration() {
  return {
    clé: process.env.RESEND_API_KEY,
    destinataire: process.env.CONTACT_TO ?? site.email,
    expéditeur: process.env.CONTACT_FROM ?? "onboarding@resend.dev",
  };
}

function réponse(statut: number, corps: Record<string, unknown>) {
  return Response.json(corps, { status: statut });
}

export async function POST(request: Request) {
  let données: unknown;
  try {
    données = await request.json();
  } catch {
    return réponse(400, { erreur: "Requête illisible." });
  }

  const résultat = demandeSchema.safeParse(données);
  if (!résultat.success) {
    const champs: Record<string, string> = {};
    for (const problème of résultat.error.issues) {
      const champ = String(problème.path[0] ?? "");
      if (champ && !champs[champ]) champs[champ] = problème.message;
    }
    return réponse(400, { erreur: "Certains champs sont incomplets.", champs });
  }

  const demande = résultat.data;

  // Piège à robots : on répond comme si tout allait bien, sans rien envoyer.
  if (demande.societe) {
    return réponse(200, { ok: true });
  }

  const { clé, destinataire, expéditeur } = configuration();
  if (!clé) {
    console.error(
      "RESEND_API_KEY absente : la demande n'a pas pu être transmise à l'atelier.",
    );
    return réponse(503, {
      erreur:
        "L'envoi est momentanément indisponible. Appelez-nous directement, nous répondons tout de suite.",
    });
  }

  const resend = new Resend(clé);
  const atelier = emailAtelier(demande);

  const envoiAtelier = await resend.emails.send({
    from: `${site.name} <${expéditeur}>`,
    to: [destinataire],
    replyTo: demande.email || undefined,
    subject: atelier.objet,
    html: atelier.html,
  });

  if (envoiAtelier.error) {
    console.error("Échec de l'envoi vers l'atelier :", envoiAtelier.error);
    return réponse(502, {
      erreur:
        "L'envoi a échoué. Appelez-nous directement, nous répondons tout de suite.",
    });
  }

  if (demande.email) {
    const accusé = emailClient(demande);
    const envoiClient = await resend.emails.send({
      from: `${site.name} <${expéditeur}>`,
      to: [demande.email],
      subject: accusé.objet,
      html: accusé.html,
    });
    // L'atelier a l'information : un accusé manquant ne justifie pas un échec.
    if (envoiClient.error) {
      console.error("Accusé de réception non envoyé :", envoiClient.error);
    }
  }

  return réponse(200, { ok: true });
}
