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

export function administrationConfiguree(): boolean {
  const { motDePasse, secret } = configuration();
  return Boolean(motDePasse && secret);
}

export type RésultatConnexion =
  | { ok: true }
  | { ok: false; raison: "non-configure" | "mauvais-mot-de-passe" };

export async function ouvrirSession(saisie: string): Promise<RésultatConnexion> {
  const { motDePasse, secret } = configuration();
  if (!motDePasse || !secret) return { ok: false, raison: "non-configure" };

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
  if (!secret) return false;

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
