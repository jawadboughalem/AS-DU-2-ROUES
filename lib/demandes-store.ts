import { promises as fs } from "node:fs";
import path from "node:path";
import type { Demande } from "./demande";

/**
 * Stockage des demandes.
 *
 * Deux implémentations derrière une même interface. En production, Netlify
 * Blobs : aucun compte supplémentaire à créer pour le client, aucun coût.
 * En développement et pendant la recette, un simple fichier JSON — sans quoi
 * rien de ce qui suit ne serait testable ailleurs que sur Netlify.
 */

export type Statut = "nouvelle" | "confirmee" | "traitee" | "refusee";

export const STATUTS: Record<Statut, { libelle: string; couleur: string }> = {
  nouvelle: { libelle: "Nouvelle", couleur: "accent" },
  confirmee: { libelle: "Confirmée", couleur: "vert" },
  traitee: { libelle: "Traitée", couleur: "gris" },
  refusee: { libelle: "Refusée", couleur: "gris" },
};

/** Le piège à robots n'a rien à faire dans ce qui est conservé. */
export type DemandeConservee = Omit<Demande, "societe">;

export type DemandeEnregistree = {
  id: string;
  recueLe: string;
  majLe?: string;
  statut: Statut;
  /** Renseigné quand l'atelier confirme un rendez-vous. */
  creneauConfirme?: string;
  noteAtelier?: string;
  demande: DemandeConservee;
};

export type Modification = Partial<
  Pick<DemandeEnregistree, "statut" | "creneauConfirme" | "noteAtelier">
>;

interface Store {
  enregistrer(entrée: DemandeEnregistree): Promise<void>;
  lister(): Promise<DemandeEnregistree[]>;
  lire(id: string): Promise<DemandeEnregistree | null>;
  modifier(id: string, patch: Modification): Promise<DemandeEnregistree | null>;
}

/* -------------------------------------------------------------------------- */
/*  Netlify Blobs — production                                                 */
/* -------------------------------------------------------------------------- */

function storeNetlify(): Store {
  async function espace() {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: "demandes", consistency: "strong" });
  }

  return {
    async enregistrer(entrée) {
      const s = await espace();
      await s.setJSON(entrée.id, entrée);
    },
    async lister() {
      const s = await espace();
      const { blobs } = await s.list();
      const entrées = await Promise.all(
        blobs.map((b) => s.get(b.key, { type: "json" }) as Promise<DemandeEnregistree>),
      );
      return entrées.filter(Boolean);
    },
    async lire(id) {
      const s = await espace();
      return (await s.get(id, { type: "json" })) as DemandeEnregistree | null;
    },
    async modifier(id, patch) {
      const s = await espace();
      const actuelle = (await s.get(id, { type: "json" })) as DemandeEnregistree | null;
      if (!actuelle) return null;
      const suivante = { ...actuelle, ...patch, majLe: new Date().toISOString() };
      await s.setJSON(id, suivante);
      return suivante;
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Fichier JSON — développement et recette                                    */
/* -------------------------------------------------------------------------- */

function storeFichier(): Store {
  const fichier = path.join(process.cwd(), ".data", "demandes.json");

  async function lireTout(): Promise<DemandeEnregistree[]> {
    try {
      return JSON.parse(await fs.readFile(fichier, "utf8"));
    } catch {
      return [];
    }
  }

  async function écrireTout(entrées: DemandeEnregistree[]) {
    await fs.mkdir(path.dirname(fichier), { recursive: true });
    await fs.writeFile(fichier, JSON.stringify(entrées, null, 2), "utf8");
  }

  return {
    async enregistrer(entrée) {
      const tout = await lireTout();
      await écrireTout([entrée, ...tout]);
    },
    lister: lireTout,
    async lire(id) {
      return (await lireTout()).find((e) => e.id === id) ?? null;
    },
    async modifier(id, patch) {
      const tout = await lireTout();
      const i = tout.findIndex((e) => e.id === id);
      if (i === -1) return null;
      tout[i] = { ...tout[i], ...patch, majLe: new Date().toISOString() };
      await écrireTout(tout);
      return tout[i];
    },
  };
}

/* -------------------------------------------------------------------------- */

/**
 * Netlify renseigne NETLIFY=true dans ses fonctions. Ailleurs — machine de
 * développement, recette — on retombe sur le fichier.
 */
export function demandesStore(): Store {
  return process.env.NETLIFY === "true" ? storeNetlify() : storeFichier();
}

export function nouvelIdentifiant(): string {
  const maintenant = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const aléa = crypto.randomUUID().slice(0, 8);
  // Préfixe horodaté : les clés se trient naturellement du plus récent au plus ancien.
  return `${maintenant}-${aléa}`;
}

/** Tri décroissant par date de réception, quel que soit le magasin. */
export function parPlusRecent(a: DemandeEnregistree, b: DemandeEnregistree) {
  return b.recueLe.localeCompare(a.recueLe);
}
