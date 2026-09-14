import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Authentification de l'espace d'administration.
 *
 * Un seul utilisateur — l'atelier — donc un seul mot de passe partagé, stocké
 * en variable d'environnement. Pas de compte à créer, pas de service tiers,
 * pas de base d'utilisateurs à protéger.
 *
 * La session est un cookie signé : il ne contient qu'une date d'expiration et
 * sa signature. Rien à voler, rien à falsifier sans le secret du serveur.
 */

const COOKIE = "atelier_session";
const DUREE_HEURES = 12;

/**
 * Longueur minimale du secret de signature.
 *
 * Un secret court est un secret devinable, et un secret devinable rend la
 * signature décorative : qui peut le retrouver fabrique un cookie valide et
 * entre sans mot de passe.
 *
 * Ce seuil sert aussi de garde-fou contre l'erreur humaine — une phrase
 * recopiée, un texte d'exemple, une commande collée à la place de son
 * résultat. Trente-deux caractères, c'est plus long que toutes ces
 * maladresses et beaucoup moins qu'une vraie valeur tirée au hasard.
 */
const LONGUEUR_MINIMALE_SECRET = 32;

function encodeur() {
  return new TextEncoder();
}

async function clé(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encodeur().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((o) => o.toString(16).padStart(2, "0")).join("");
}

async function signer(valeur: string, secret: string) {
  return hex(await crypto.subtle.sign("HMAC", await clé(secret), encodeur().encode(valeur)));
}

/**
 * Comparaison à durée constante. Comparer deux chaînes avec === laisse fuir,
 * par le temps de réponse, la longueur du préfixe correct — ce qui permet de
 * reconstituer un secret caractère par caractère.
 */
function égalitéConstante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let écart = 0;
  for (let i = 0; i < a.length; i++) écart |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return écart === 0;
}

function configuration() {
  return {
    motDePasse: process.env.ADMIN_MOT_DE_PASSE,
    secret: process.env.ADMIN_SECRET,
  };
}

/**
 * Un secret trop court n'est pas une configuration incomplète : c'est une
 * configuration dangereuse. On refuse donc d'ouvrir la moindre session plutôt
 * que d'en protéger une avec une signature qui ne protège rien.
 */
function secretUtilisable(secret: string | undefined): boolean {
  return typeof secret === "string" && secret.length >= LONGUEUR_MINIMALE_SECRET;
}

export function administrationConfiguree(): boolean {
  const { motDePasse, secret } = configuration();
  return Boolean(motDePasse) && secretUtilisable(secret);
}

export type RésultatConnexion =
  | { ok: true }
  | { ok: false; raison: "non-configure" | "secret-faible" | "mauvais-mot-de-passe" };

export async function ouvrirSession(saisie: string): Promise<RésultatConnexion> {
  const { motDePasse, secret } = configuration();
  if (!motDePasse || !secret) return { ok: false, raison: "non-configure" };

  if (!secretUtilisable(secret)) {
    // La longueur réelle reste dans les journaux du serveur : l'afficher à un
    // visiteur non authentifié renseignerait un attaquant sans aider personne.
    console.error(
      `ADMIN_SECRET fait ${secret.length} caractères, il en faut au moins ` +
        `${LONGUEUR_MINIMALE_SECRET}. Aucune session ne sera ouverte.`,
    );
    return { ok: false, raison: "secret-faible" };
  }

  // Les deux valeurs sont d'abord réduites à une empreinte de longueur fixe :
  // sans cela, la comparaison à durée constante trahirait la longueur du
  // mot de passe attendu.
  const empreinte = async (v: string) =>
    hex(await crypto.subtle.digest("SHA-256", encodeur().encode(v)));

  if (!égalitéConstante(await empreinte(saisie), await empreinte(motDePasse))) {
    return { ok: false, raison: "mauvais-mot-de-passe" };
  }

  const expiration = String(Date.now() + DUREE_HEURES * 3600 * 1000);
  const jeton = `${expiration}.${await signer(expiration, secret)}`;

  (await cookies()).set(COOKIE, jeton, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_HEURES * 3600,
  });

  return { ok: true };
}

export async function fermerSession() {
  (await cookies()).delete(COOKIE);
}

export async function sessionValide(): Promise<boolean> {
  const { secret } = configuration();
  // Même garde à la vérification qu'à l'ouverture : si le secret est
  // raccourci après coup, les sessions déjà ouvertes cessent d'être valides.
  if (!secret || !secretUtilisable(secret)) return false;

  const jeton = (await cookies()).get(COOKIE)?.value;
  if (!jeton) return false;

  const [expiration, signature] = jeton.split(".");
  if (!expiration || !signature) return false;
  if (Number(expiration) < Date.now()) return false;

  return égalitéConstante(signature, await signer(expiration, secret));
}

/**
 * À appeler au début de CHAQUE page et de CHAQUE action de l'espace.
 * Masquer un lien dans l'interface n'est pas une protection : seule une
 * vérification côté serveur, à chaque entrée, en est une.
 */
export async function exigerSession() {
  if (!(await sessionValide())) redirect("/admin/connexion");
}
