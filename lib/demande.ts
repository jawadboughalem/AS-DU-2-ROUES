import { z } from "zod";
import { services } from "./services";

/**
 * Schéma d'une demande de devis ou de rendez-vous.
 *
 * Volontairement partagé entre le navigateur et le serveur : la validation
 * côté client est un confort, celle du serveur est la seule qui protège
 * réellement. Une seule définition évite qu'elles divergent.
 */

/** Les prestations connues, plus la sortie « autre » du formulaire. */
const prestationsValides: readonly string[] = [
  ...services.map((s) => s.slug),
  "autre",
];

const texte = (max: number) => z.string().trim().min(1).max(max);

export const demandeSchema = z
  .object({
    mode: z.enum(["devis", "rdv"]),

    vehicule: z.enum(["Scooter", "Moto", "50 cm³"]),
    marque: texte(60),
    modele: texte(60),
    annee: z.string().trim().max(4).optional().or(z.literal("")),
    km: z.string().trim().max(12).optional().or(z.literal("")),
    immatriculation: z.string().trim().max(12).optional().or(z.literal("")),

    prestation: z
      .string()
      .refine((v) => prestationsValides.includes(v), "Prestation inconnue"),
    message: z.string().trim().max(2000).optional().or(z.literal("")),

    // Onglet devis
    disponibilite: z.enum(["urgent", "semaine", "prochaine", "flexible"]).optional(),

    // Onglet rendez-vous
    date: z.string().trim().max(10).optional().or(z.literal("")),
    creneau: z.enum(["matin", "apresmidi", "indifferent"]).optional(),

    nom: texte(80),
    telephone: z
      .string()
      .trim()
      .min(6, "Numéro de téléphone trop court")
      .max(25)
      .regex(/^[\d\s+().-]+$/, "Numéro de téléphone invalide"),
    email: z.string().trim().email("Adresse e-mail invalide").max(120).optional().or(z.literal("")),

    consentement: z.literal(true),

    /**
     * Piège à robots : ce champ est masqué et ne doit jamais être rempli par
     * un humain. Le schéma l'accepte volontairement — c'est la route qui
     * décide quoi en faire. Le refuser ici renverrait une erreur de
     * validation au robot, ce qui lui apprendrait exactement quel champ
     * laisser vide.
     */
    societe: z.string().max(200).optional().or(z.literal("")),
  })
  .refine((d) => d.mode !== "devis" || (d.message && d.message.length >= 10), {
    message: "Merci de décrire le problème en quelques mots",
    path: ["message"],
  })
  .refine((d) => d.mode !== "rdv" || Boolean(d.date), {
    message: "Merci d'indiquer une date souhaitée",
    path: ["date"],
  });

export type Demande = z.infer<typeof demandeSchema>;

export const LIBELLES = {
  disponibilite: {
    urgent: "Dès que possible — urgent",
    semaine: "Cette semaine",
    prochaine: "La semaine prochaine",
    flexible: "Flexible",
  },
  creneau: {
    matin: "Matin (10h – 13h)",
    apresmidi: "Après-midi (14h – 19h)",
    indifferent: "Indifférent",
  },
} as const;

export function libelléPrestation(slug: string): string {
  return services.find((s) => s.slug === slug)?.title ?? "Autre / ne sait pas";
}
