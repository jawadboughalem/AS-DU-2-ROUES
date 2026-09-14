/**
 * Créneaux, jours et semaines.
 *
 * Tout ce qui touche au calendrier de l'atelier vit ici : les libellés des
 * créneaux, la mise en français des dates, et l'arithmétique des semaines.
 * Ces règles étaient dispersées entre le formulaire, les e-mails et les
 * actions — trois endroits où écrire « le matin, entre 10h et 13h », donc
 * trois endroits à corriger le jour où l'atelier change ses horaires.
 */

export type CléCréneau = "matin" | "apresmidi" | "indifferent";

export const CRENEAUX: Record<CléCréneau, { court: string; horaire: string; phrase: string }> = {
  matin: { court: "Matin", horaire: "10h – 13h", phrase: "le matin, entre 10h et 13h" },
  apresmidi: { court: "Après-midi", horaire: "14h – 19h", phrase: "l’après-midi, entre 14h et 19h" },
  indifferent: { court: "Dans la journée", horaire: "10h – 19h", phrase: "dans la journée" },
};

/** Les deux créneaux proposés à la confirmation, dans l'ordre de la journée. */
export const CRENEAUX_OUVRES: CléCréneau[] = ["matin", "apresmidi"];

export function estCléCréneau(valeur: unknown): valeur is CléCréneau {
  return typeof valeur === "string" && valeur in CRENEAUX;
}

/* -------------------------------------------------------------------------- */
/*  Dates                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Une date de rendez-vous est un jour, pas un instant : on l'ancre donc à midi
 * UTC. Sans cela, un décalage horaire ou un changement d'heure peut faire
 * basculer un rendez-vous sur la veille ou le lendemain.
 */
function versDate(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

function versIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Le jour courant à Paris, et non celui du serveur.
 *
 * Netlify exécute ses fonctions en UTC. Un samedi soir à 23h30 à Paris, il est
 * déjà dimanche pour le serveur : « cette semaine » sauterait d'une semaine
 * sous les yeux de l'atelier. Le format en-CA donne directement AAAA-MM-JJ.
 */
export function aujourdhui(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

/**
 * La semaine que l'atelier doit voir en ouvrant la page.
 *
 * Le dimanche, la semaine « en cours » est celle qui vient de se terminer :
 * la page s'ouvrirait sur cinq jours passés, au moment précis où l'on prépare
 * les cinq suivants. Ce jour-là, on regarde donc devant. Le lundi ne pose pas
 * le problème — sa semaine est déjà celle qui commence.
 */
export function semaineParDéfaut(): string {
  const jour = aujourdhui();
  return indiceJour(jour) === 6 ? décalerJours(jour, 1) : jour;
}

export function décalerJours(iso: string, jours: number): string {
  const date = versDate(iso);
  date.setUTCDate(date.getUTCDate() + jours);
  return versIso(date);
}

/** Lundi de la semaine contenant cette date. La semaine française commence lundi. */
export function lundiDeLaSemaine(iso: string): string {
  const date = versDate(iso);
  const recul = (date.getUTCDay() + 6) % 7; // dimanche = 0 en JS, lundi = 0 ici
  return décalerJours(iso, -recul);
}

/** Les sept jours de la semaine, du lundi au dimanche. */
export function joursDeLaSemaine(lundi: string): string[] {
  return Array.from({ length: 7 }, (_, i) => décalerJours(lundi, i));
}

/** Position dans la semaine : 0 = lundi … 6 = dimanche. */
export function indiceJour(iso: string): number {
  return (versDate(iso).getUTCDay() + 6) % 7;
}

const FR = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { ...options, timeZone: "UTC" });

function majuscule(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** « Jeudi 24 septembre 2026 » */
export function jourLisible(iso: string): string {
  return majuscule(
    FR({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(versDate(iso)),
  );
}

/** « Jeudi 24 sept. » — pour les en-têtes de colonne, où la place manque. */
export function jourCourt(iso: string): string {
  return majuscule(FR({ weekday: "long", day: "numeric", month: "short" }).format(versDate(iso)));
}

/** « 15 – 21 septembre 2026 », en évitant de répéter le mois quand il est le même. */
export function semaineLisible(lundi: string): string {
  const dimanche = décalerJours(lundi, 6);
  const mêmeMois = lundi.slice(0, 7) === dimanche.slice(0, 7);
  const début = FR(mêmeMois ? { day: "numeric" } : { day: "numeric", month: "long" }).format(
    versDate(lundi),
  );
  const fin = FR({ day: "numeric", month: "long", year: "numeric" }).format(versDate(dimanche));
  return `${début} – ${fin}`;
}

/** « Jeudi 24 septembre 2026, le matin, entre 10h et 13h » — la phrase envoyée au client. */
export function phraseCréneau(date: string, créneau: CléCréneau): string {
  return `${jourLisible(date)}, ${CRENEAUX[créneau].phrase}`;
}
