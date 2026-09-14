"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { exigerSession, fermerSession, ouvrirSession } from "@/lib/auth-admin";
import { demandesStore, type Statut } from "@/lib/demandes-store";
import { emailConfirmation } from "@/lib/email-templates";
import { site } from "@/lib/site";

/**
 * Chaque action revérifie la session côté serveur. Une action est une URL :
 * elle est appelable sans passer par l'interface, donc masquer un bouton ne
 * protège rien.
 */

export async function seConnecter(_état: string | null, données: FormData) {
  const saisie = String(données.get("motdepasse") ?? "");
  const résultat = await ouvrirSession(saisie);

  if (résultat.ok) redirect("/admin");

  return résultat.raison === "non-configure"
    ? "L'espace n'est pas encore configuré. Les variables ADMIN_MOT_DE_PASSE et ADMIN_SECRET sont manquantes."
    : "Mot de passe incorrect.";
}

export async function seDeconnecter() {
  await fermerSession();
  redirect("/admin/connexion");
}

const CRÉNEAUX: Record<string, string> = {
  matin: "le matin, entre 10h et 13h",
  apresmidi: "l'après-midi, entre 14h et 19h",
  indifferent: "dans la journée",
};

function phraseCréneau(date: string, créneau: string): string {
  const jour = new Date(`${date}T12:00:00`);
  const formaté = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(jour);
  const début = formaté.charAt(0).toUpperCase() + formaté.slice(1);
  return `${début}, ${CRÉNEAUX[créneau] ?? CRÉNEAUX.indifferent}`;
}

export async function confirmerRendezVous(données: FormData) {
  await exigerSession();

  const id = String(données.get("id") ?? "");
  const date = String(données.get("date") ?? "");
  const créneau = String(données.get("creneau") ?? "indifferent");
  if (!id || !date) return;

  const phrase = phraseCréneau(date, créneau);
  const entrée = await demandesStore().modifier(id, {
    statut: "confirmee",
    creneauConfirme: phrase,
  });
  if (!entrée) return;

  // L'e-mail est le seul engagement pris envers le client : son échec doit
  // être visible dans les journaux, mais il ne doit pas annuler la
  // confirmation déjà enregistrée côté atelier.
  const clé = process.env.RESEND_API_KEY;
  if (clé && entrée.demande.email) {
    const message = emailConfirmation(
      { ...entrée.demande, societe: "" },
      phrase,
    );
    const envoi = await new Resend(clé).emails.send({
      from: `${site.name} <${process.env.CONTACT_FROM ?? "onboarding@resend.dev"}>`,
      to: [entrée.demande.email],
      subject: message.objet,
      html: message.html,
    });
    if (envoi.error) {
      console.error("Confirmation enregistrée mais e-mail non envoyé :", envoi.error);
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
}

export async function changerStatut(données: FormData) {
  await exigerSession();

  const id = String(données.get("id") ?? "");
  const statut = String(données.get("statut") ?? "") as Statut;
  const statutsAutorisés: Statut[] = ["nouvelle", "confirmee", "traitee", "refusee"];
  if (!id || !statutsAutorisés.includes(statut)) return;

  await demandesStore().modifier(id, { statut });
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
}
