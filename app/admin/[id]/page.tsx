import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerSession } from "@/lib/auth-admin";
import { demandesStore } from "@/lib/demandes-store";
import { LIBELLES, libelléPrestation } from "@/lib/demande";
import { Badge, EnTeteAdmin, dateLisible, metadonneesAdmin } from "@/components/admin-ui";
import { Phone } from "@/components/icons";
import { changerStatut, confirmerRendezVous } from "../actions";

export const metadata: Metadata = { ...metadonneesAdmin, title: "Demande" };
export const dynamic = "force-dynamic";

function Ligne({ intitulé, valeur }: { intitulé: string; valeur?: string | null }) {
  if (!valeur) return null;
  return (
    <div className="flex justify-between gap-6 border-b border-bone/8 py-3 last:border-0">
      <dt className="shrink-0 text-sm text-bone/45">{intitulé}</dt>
      <dd className="text-right text-sm font-semibold break-words text-bone/90">{valeur}</dd>
    </div>
  );
}

export default async function FicheDemande({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigerSession();

  const { id } = await params;
  // Une panne de stockage et une demande inexistante mènent au même écran :
  // dans les deux cas il n'y a rien à afficher, et la liste porte déjà le
  // diagnostic.
  const entrée = await demandesStore()
    .lire(id)
    .catch((erreur) => {
      console.error("Lecture de la demande impossible :", erreur);
      return null;
    });
  if (!entrée) notFound();

  const d = entrée.demande;
  const rdv = d.mode === "rdv";

  return (
    <div className="min-h-screen bg-ink pb-20">
      <EnTeteAdmin titre="Demande" />

      <main className="mx-auto max-w-3xl px-5 py-6">
        <Link href="/admin" className="text-sm text-bone/45 hover:text-bone">
          ← Retour aux demandes
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Badge statut={entrée.statut} />
          <span className="text-[0.7rem] font-semibold tracking-wide text-bone/45">
            {rdv ? "RENDEZ-VOUS" : "DEVIS"}
          </span>
          <span className="ml-auto text-xs text-bone/35">
            Reçue {dateLisible(entrée.recueLe)}
          </span>
        </div>

        <h1 className="display mt-4 text-3xl">{d.nom}</h1>

        <a
          href={`tel:${d.telephone.replace(/\s/g, "")}`}
          className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-accent-soft"
        >
          <Phone className="h-4 w-4" />
          Rappeler le {d.telephone}
        </a>

        {entrée.creneauConfirme && (
          <p className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
            Confirmé : {entrée.creneauConfirme}
          </p>
        )}

        <dl className="mt-7 rounded-2xl border border-bone/12 bg-ink-2 px-5">
          <Ligne intitulé="Véhicule" valeur={`${d.vehicule} · ${d.marque} ${d.modele}`} />
          <Ligne intitulé="Année" valeur={d.annee} />
          <Ligne intitulé="Kilométrage" valeur={d.km} />
          <Ligne intitulé="Immatriculation" valeur={d.immatriculation?.toUpperCase()} />
          <Ligne intitulé="Prestation" valeur={libelléPrestation(d.prestation)} />
          {rdv && <Ligne intitulé="Date souhaitée" valeur={d.date} />}
          {rdv && d.creneau && <Ligne intitulé="Créneau souhaité" valeur={LIBELLES.creneau[d.creneau]} />}
          {!rdv && d.disponibilite && (
            <Ligne intitulé="Disponibilité" valeur={LIBELLES.disponibilite[d.disponibilite]} />
          )}
          <Ligne intitulé="Téléphone" valeur={d.telephone} />
          <Ligne intitulé="E-mail" valeur={d.email} />
        </dl>

        {d.message && (
          <section className="mt-6">
            <h2 className="eyebrow mb-2 text-bone/40">Ce qu&apos;il décrit</h2>
            <p className="rounded-xl border border-bone/10 bg-ink-2 px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap text-bone/85">
              {d.message}
            </p>
          </section>
        )}

        {/* ---------- Confirmation d'un créneau ---------- */}
        {rdv && entrée.statut !== "refusee" && (
          <section className="mt-8 rounded-2xl border border-bone/12 bg-ink-2 p-5">
            <h2 className="display text-lg">
              {entrée.statut === "confirmee" ? "Modifier le créneau" : "Confirmer un créneau"}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-bone/50">
              {d.email
                ? "Le client recevra un e-mail de confirmation avec la date et l’horaire."
                : "Ce client n’a pas laissé d’e-mail : pensez à le prévenir par téléphone."}
            </p>

            <form action={confirmerRendezVous} className="mt-4">
              <input type="hidden" name="id" value={entrée.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-1.5 block text-xs font-semibold text-bone/55">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={d.date || undefined}
                    className="w-full rounded-xl border border-bone/15 bg-ink px-4 py-3 text-sm text-bone focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="creneau" className="mb-1.5 block text-xs font-semibold text-bone/55">
                    Créneau
                  </label>
                  <select
                    id="creneau"
                    name="creneau"
                    defaultValue={d.creneau ?? "matin"}
                    className="w-full rounded-xl border border-bone/15 bg-ink px-4 py-3 text-sm text-bone focus:border-accent focus:outline-none"
                  >
                    <option value="matin">Matin (10h – 13h)</option>
                    <option value="apresmidi">Après-midi (14h – 19h)</option>
                    <option value="indifferent">Dans la journée</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                data-action="confirmer"
                className="mt-4 w-full rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                Confirmer et prévenir le client
              </button>
            </form>
          </section>
        )}

        {/* ---------- Suite du traitement ---------- */}
        <section className="mt-5 flex flex-wrap gap-3">
          {entrée.statut !== "traitee" && (
            <form action={changerStatut}>
              <input type="hidden" name="id" value={entrée.id} />
              <input type="hidden" name="statut" value="traitee" />
              <button
                type="submit"
                data-action="traiter"
                className="rounded-full border border-bone/20 px-5 py-3 text-sm font-semibold text-bone/70 transition-colors hover:border-bone/50 hover:text-bone"
              >
                Marquer comme traitée
              </button>
            </form>
          )}
          {entrée.statut !== "refusee" && (
            <form action={changerStatut}>
              <input type="hidden" name="id" value={entrée.id} />
              <input type="hidden" name="statut" value="refusee" />
              <button
                type="submit"
                data-action="refuser"
                className="rounded-full border border-bone/20 px-5 py-3 text-sm font-semibold text-bone/40 transition-colors hover:border-accent/50 hover:text-accent-soft"
              >
                Refuser
              </button>
            </form>
          )}
          {entrée.statut !== "nouvelle" && (
            <form action={changerStatut}>
              <input type="hidden" name="id" value={entrée.id} />
              <input type="hidden" name="statut" value="nouvelle" />
              <button
                type="submit"
                data-action="rouvrir"
                className="rounded-full border border-bone/20 px-5 py-3 text-sm font-semibold text-bone/40 transition-colors hover:border-bone/50 hover:text-bone"
              >
                Remettre à traiter
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
