import Link from "next/link";
import type { Metadata } from "next";
import { STATUTS, type DemandeEnregistree, type Statut } from "@/lib/demandes-store";
import { LogoMark } from "./logo";
import { seDeconnecter } from "@/app/admin/actions";

/** Un espace de gestion n'a rien à faire dans un moteur de recherche. */
export const metadonneesAdmin: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const TONS: Record<string, string> = {
  accent: "border-accent/40 bg-accent/12 text-accent-soft",
  vert: "border-emerald-500/40 bg-emerald-500/12 text-emerald-400",
  gris: "border-bone/20 bg-bone/[0.06] text-bone/50",
};

export function Badge({ statut }: { statut: Statut }) {
  const { libelle, couleur } = STATUTS[statut];
  return (
    <span className={`inline-block rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${TONS[couleur]}`}>
      {libelle}
    </span>
  );
}

export function EnTeteAdmin({ titre }: { titre: string }) {
  return (
    <header className="border-b border-bone/10 bg-ink-2">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <div className="leading-tight">
            <p className="display text-sm">{titre}</p>
            <p className="eyebrow text-bone/40">Espace atelier</p>
          </div>
        </div>
        <form action={seDeconnecter}>
          <button
            type="submit"
            className="rounded-full border border-bone/20 px-4 py-2 text-xs font-semibold text-bone/60 transition-colors hover:border-bone/50 hover:text-bone"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}

export function dateLisible(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function CarteDemande({ entrée }: { entrée: DemandeEnregistree }) {
  const { demande: d } = entrée;
  const rdv = d.mode === "rdv";

  return (
    <li>
      <Link
        href={`/admin/${entrée.id}`}
        className="block rounded-2xl border border-bone/12 bg-ink-2 p-5 transition-colors hover:border-bone/30"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge statut={entrée.statut} />
          <span className="text-[0.7rem] font-semibold tracking-wide text-bone/45">
            {rdv ? "RENDEZ-VOUS" : "DEVIS"}
          </span>
          <span className="ml-auto text-xs text-bone/35">{dateLisible(entrée.recueLe)}</span>
        </div>

        <p className="display mt-3 text-lg">{d.nom}</p>
        <p className="mt-1 text-sm text-bone/65">
          {d.vehicule} · {d.marque} {d.modele}
        </p>

        {entrée.creneauConfirme && (
          <p className="mt-2 text-sm font-semibold text-emerald-400">
            {entrée.creneauConfirme}
          </p>
        )}

        <p className="mt-3 text-sm text-accent">{d.telephone}</p>
      </Link>
    </li>
  );
}
