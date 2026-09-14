import type { Metadata } from "next";
import Link from "next/link";
import { exigerSession } from "@/lib/auth-admin";
import { demandesStore, parPlusAncien, type DemandeEnregistree } from "@/lib/demandes-store";
import { libelléPrestation } from "@/lib/demande";
import {
  CRENEAUX,
  CRENEAUX_OUVRES,
  aujourdhui,
  semaineParDéfaut,
  décalerJours,
  indiceJour,
  jourCourt,
  joursDeLaSemaine,
  lundiDeLaSemaine,
  semaineLisible,
  type CléCréneau,
} from "@/lib/creneaux";
import { EnTeteAdmin, metadonneesAdmin } from "@/components/admin-ui";

export const metadata: Metadata = { ...metadonneesAdmin, title: "Semaine" };
export const dynamic = "force-dynamic";

/** L'atelier ouvre du mardi au samedi : indices 1 à 5, lundi valant 0. */
const JOURS_OUVRES = [1, 2, 3, 4, 5];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

function CarteRendezVous({ entrée }: { entrée: DemandeEnregistree }) {
  const d = entrée.demande;
  return (
    <li>
      <Link
        href={`/admin/${entrée.id}`}
        data-demande={entrée.id}
        className="block rounded-xl border border-bone/12 bg-ink px-4 py-3 transition-colors hover:border-bone/30"
      >
        <p className="text-sm font-semibold text-bone">{d.nom}</p>
        <p className="mt-0.5 text-xs text-bone/55">
          {d.vehicule} {d.marque} {d.modele}
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="text-bone/70">{libelléPrestation(d.prestation)}</span>
          <span className="text-bone/25">·</span>
          <span className="text-accent">{d.telephone}</span>
        </p>
      </Link>
    </li>
  );
}

export default async function VueSemaine({
  searchParams,
}: {
  searchParams: Promise<{ debut?: string }>;
}) {
  await exigerSession();

  const { debut } = await searchParams;
  const ancre = debut && ISO.test(debut) ? debut : semaineParDéfaut();
  const lundi = lundiDeLaSemaine(ancre);
  const jours = joursDeLaSemaine(lundi);
  const cejour = aujourdhui();

  let toutes: DemandeEnregistree[] = [];
  let panne: string | null = null;
  try {
    toutes = await demandesStore().lister();
  } catch (erreur) {
    console.error("Lecture des demandes impossible :", erreur);
    panne = erreur instanceof Error ? erreur.message : String(erreur);
  }

  const confirmés = toutes.filter(
    (e) => e.statut === "confirmee" && e.rdvDate && jours.includes(e.rdvDate),
  );

  /** Ce qui est confirmé pour ce jour, dans ce créneau. */
  const rendezVous = (jour: string, créneau: CléCréneau) =>
    confirmés
      .filter((e) => e.rdvDate === jour && (e.rdvCreneau ?? "indifferent") === créneau)
      .sort(parPlusAncien);

  /**
   * Les demandes que le client a posées sur ce jour sans qu'elles soient
   * encore confirmées. C'est ce qui dit à l'atelier s'il doit regarder ce jour
   * de plus près, ou s'il peut le laisser tel quel.
   */
  const enAttente = (jour: string) =>
    toutes.filter((e) => e.statut === "nouvelle" && e.demande.mode === "rdv" && e.demande.date === jour)
      .length;

  /**
   * Les jours fermés ne sont affichés que s'ils portent quelque chose. Les
   * masquer systématiquement ferait disparaître un rendez-vous pris en
   * exception — une donnée ne doit jamais devenir invisible.
   */
  const àAfficher = jours.filter((jour, i) => {
    if (JOURS_OUVRES.includes(i)) return true;
    return confirmés.some((e) => e.rdvDate === jour) || enAttente(jour) > 0;
  });

  const total = confirmés.length;

  return (
    <div className="min-h-screen bg-ink pb-16">
      <EnTeteAdmin titre="Semaine" onglet="semaine" />

      <main className="mx-auto max-w-3xl px-5 py-6">
        {panne && (
          <div
            role="alert"
            data-erreur="stockage"
            className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4"
          >
            <p className="display text-base text-accent-soft">
              Impossible de lire les rendez-vous pour l&apos;instant
            </p>
            <p className="mt-2 text-sm leading-relaxed text-bone/60">
              Le site continue de fonctionner et vous recevez toujours vos e-mails :
              rien n&apos;est perdu. Prévenez-moi, je regarde.
            </p>
            <p className="mt-2 font-mono text-xs break-words text-bone/35">{panne}</p>
          </div>
        )}

        <div className="mb-2 flex items-center justify-between gap-3">
          <Link
            href={`/admin/semaine?debut=${décalerJours(lundi, -7)}`}
            aria-label="Semaine précédente"
            className="rounded-full border border-bone/20 px-4 py-2.5 text-sm font-semibold text-bone/60 transition-colors hover:border-bone/50 hover:text-bone"
          >
            ←
          </Link>
          <h1 className="display text-center text-base">{semaineLisible(lundi)}</h1>
          <Link
            href={`/admin/semaine?debut=${décalerJours(lundi, 7)}`}
            aria-label="Semaine suivante"
            className="rounded-full border border-bone/20 px-4 py-2.5 text-sm font-semibold text-bone/60 transition-colors hover:border-bone/50 hover:text-bone"
          >
            →
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-center gap-3">
          <p className="text-xs text-bone/40">
            {total === 0
              ? "Aucun rendez-vous confirmé"
              : `${total} rendez-vous confirmé${total > 1 ? "s" : ""}`}
          </p>
          {lundi !== lundiDeLaSemaine(semaineParDéfaut()) && (
            <Link href="/admin/semaine" className="text-xs font-semibold text-accent hover:underline">
              Revenir à cette semaine
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {àAfficher.map((jour) => {
            const cest = jour === cejour;
            const ferme = !JOURS_OUVRES.includes(indiceJour(jour));
            const attente = enAttente(jour);
            const créneaux: CléCréneau[] = [
              ...CRENEAUX_OUVRES,
              ...(rendezVous(jour, "indifferent").length ? (["indifferent"] as CléCréneau[]) : []),
            ];

            return (
              <section
                key={jour}
                data-jour={jour}
                className={`rounded-2xl border bg-ink-2 p-4 ${
                  cest ? "border-accent/50" : "border-bone/12"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <h2 className={`display text-base ${cest ? "text-accent" : ""}`}>
                    {jourCourt(jour)}
                  </h2>
                  {cest && <span className="eyebrow text-accent/70">Aujourd&apos;hui</span>}
                  {ferme && <span className="eyebrow text-bone/35">Normalement fermé</span>}
                  {attente > 0 && (
                    <span className="ml-auto rounded-full border border-bone/20 px-2.5 py-1 text-[0.7rem] font-semibold text-bone/55">
                      {attente} en attente
                    </span>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {créneaux.map((clé) => {
                    const liste = rendezVous(jour, clé);
                    return (
                      <div key={clé}>
                        <p className="mb-1.5 flex items-baseline gap-2">
                          <span className="eyebrow text-bone/45">{CRENEAUX[clé].court}</span>
                          <span className="text-[0.7rem] text-bone/25">{CRENEAUX[clé].horaire}</span>
                        </p>
                        {liste.length === 0 ? (
                          <p className="rounded-xl border border-dashed border-bone/12 px-4 py-3 text-xs text-bone/30">
                            Libre
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {liste.map((e) => (
                              <CarteRendezVous key={e.id} entrée={e} />
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
