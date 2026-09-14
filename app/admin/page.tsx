import type { Metadata } from "next";
import Link from "next/link";
import { exigerSession } from "@/lib/auth-admin";
import {
  demandesStore,
  parPlusRecent,
  type DemandeEnregistree,
  type Statut,
} from "@/lib/demandes-store";
import { CarteDemande, EnTeteAdmin, metadonneesAdmin } from "@/components/admin-ui";

export const metadata: Metadata = {
  ...metadonneesAdmin,
  title: "Espace atelier",
};

export const dynamic = "force-dynamic";

const FILTRES = [
  { clé: "nouvelle", libellé: "À traiter" },
  { clé: "confirmee", libellé: "Confirmées" },
  { clé: "traitee", libellé: "Traitées" },
  { clé: "toutes", libellé: "Toutes" },
] as const;

export default async function EspaceAtelier({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  await exigerSession();

  const { filtre = "nouvelle" } = await searchParams;

  // Le stockage vit chez l'hébergeur : s'il ne répond pas, l'atelier doit
  // comprendre ce qui se passe et savoir que ses e-mails, eux, continuent
  // d'arriver. Une page d'erreur brute ne lui apprendrait ni l'un ni l'autre.
  let toutes: DemandeEnregistree[] = [];
  let panne: string | null = null;
  try {
    toutes = (await demandesStore().lister()).sort(parPlusRecent);
  } catch (erreur) {
    console.error("Lecture des demandes impossible :", erreur);
    panne = erreur instanceof Error ? erreur.message : String(erreur);
  }

  const compte = (statut: Statut) => toutes.filter((e) => e.statut === statut).length;
  const visibles =
    filtre === "toutes" ? toutes : toutes.filter((e) => e.statut === filtre);

  return (
    <div className="min-h-screen bg-ink pb-16">
      <EnTeteAdmin titre="Demandes" />

      <main className="mx-auto max-w-3xl px-5 py-6">
        {panne && (
          <div
            role="alert"
            data-erreur="stockage"
            className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4"
          >
            <p className="display text-base text-accent-soft">
              Impossible de lire les demandes pour l&apos;instant
            </p>
            <p className="mt-2 text-sm leading-relaxed text-bone/60">
              Le site continue de fonctionner et vous recevez toujours vos e-mails :
              rien n&apos;est perdu. Prévenez-moi, je regarde.
            </p>
            <p className="mt-2 font-mono text-xs break-words text-bone/35">{panne}</p>
          </div>
        )}

        <nav aria-label="Filtrer" className="mb-6 flex flex-wrap gap-2">
          {FILTRES.map((f) => {
            const actif = filtre === f.clé;
            const n = f.clé === "toutes" ? toutes.length : compte(f.clé);
            return (
              <Link
                key={f.clé}
                href={`/admin?filtre=${f.clé}`}
                aria-current={actif ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  actif
                    ? "border-accent bg-accent/12 text-accent"
                    : "border-bone/15 text-bone/55 hover:border-bone/40 hover:text-bone"
                }`}
              >
                {f.libellé}
                <span className={actif ? "ml-1.5 text-accent/70" : "ml-1.5 text-bone/30"}>
                  {n}
                </span>
              </Link>
            );
          })}
        </nav>

        {visibles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
            <p className="display text-lg text-bone/70">
              {toutes.length === 0 ? "Aucune demande pour l’instant" : "Rien dans cette catégorie"}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-bone/40">
              {toutes.length === 0
                ? "Les demandes envoyées depuis le site apparaîtront ici, et vous recevrez aussi un e-mail pour chacune."
                : "Essayez un autre filtre."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visibles.map((entrée) => (
              <CarteDemande key={entrée.id} entrée={entrée} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
