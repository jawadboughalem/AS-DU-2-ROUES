"use client";

import { useState } from "react";
import { services } from "@/lib/site";
import { Arrow, Check } from "./icons";

const field =
  "w-full rounded-xl border border-bone/15 bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:border-accent focus:outline-none";
const fieldEnErreur =
  "w-full rounded-xl border border-accent bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:outline-none";
const label = "mb-1.5 block text-xs font-semibold tracking-wide text-bone/55";

type Mode = "devis" | "rdv";
type Erreurs = Record<string, string>;

/**
 * Choix de conception assumé : l'onglet « rendez-vous » recueille les
 * disponibilités du client, il ne réserve PAS un créneau ferme. L'atelier
 * confirme depuis son espace d'administration. Un créneau réservé
 * automatiquement serait intenable sans avoir vu le véhicule.
 */
export function QuoteForm() {
  const [mode, setMode] = useState<Mode>("devis");
  const [envoi, setEnvoi] = useState(false);
  const [envoyé, setEnvoyé] = useState(false);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [erreurGlobale, setErreurGlobale] = useState<string | null>(null);

  async function soumettre(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnvoi(true);
    setErreurs({});
    setErreurGlobale(null);

    const données = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const réponse = await fetch("/api/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...données,
          mode,
          consentement: données.consentement === "on",
        }),
      });

      const corps = await réponse.json().catch(() => ({}));

      if (!réponse.ok) {
        setErreurs(corps.champs ?? {});
        setErreurGlobale(corps.erreur ?? "L'envoi a échoué. Réessayez ou appelez-nous.");
        return;
      }

      setEnvoyé(true);
    } catch {
      setErreurGlobale(
        "Impossible de joindre le serveur. Vérifiez votre connexion, ou appelez-nous directement.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  const messageErreur = (champ: string) =>
    erreurs[champ] ? (
      <p className="mt-1.5 text-xs text-accent-soft">{erreurs[champ]}</p>
    ) : null;

  const classe = (champ: string) => (erreurs[champ] ? fieldEnErreur : field);

  if (envoyé) {
    return (
      <div className="flex min-h-[30rem] flex-col items-center justify-center rounded-2xl border border-accent/30 bg-accent/[0.07] p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="display mt-6 text-2xl">
          {mode === "devis" ? "Demande envoyée" : "Demande de rendez-vous envoyée"}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/65">
          {mode === "devis"
            ? "L’atelier vous répond sous 24 h ouvrées avec une estimation. Pour une urgence, appelez-nous directement."
            : "L’atelier vous rappelle sous 24 h ouvrées pour confirmer votre créneau. Tant que vous n’avez pas reçu cette confirmation, le rendez-vous n’est pas fixé."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-bone/12 bg-ink-2">
      <div role="tablist" aria-label="Type de demande" className="grid grid-cols-2">
        {(
          [
            { id: "devis", label: "Demande de devis" },
            { id: "rdv", label: "Demande de rendez-vous" },
          ] as const
        ).map((onglet) => (
          <button
            key={onglet.id}
            role="tab"
            type="button"
            aria-selected={mode === onglet.id}
            onClick={() => {
              setMode(onglet.id);
              setErreurs({});
              setErreurGlobale(null);
            }}
            className={`border-b px-4 py-4 text-sm font-semibold transition-colors ${
              mode === onglet.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-bone/10 text-bone/50 hover:text-bone/80"
            }`}
          >
            {onglet.label}
          </button>
        ))}
      </div>

      <form onSubmit={soumettre} className="p-6 sm:p-8">
        {/* Piège à robots : invisible et hors du flux de tabulation. */}
        <div aria-hidden className="absolute left-[-9999px]">
          <label htmlFor="societe">Société</label>
          <input id="societe" name="societe" tabIndex={-1} autoComplete="off" />
        </div>

        <fieldset className="mb-6">
          <legend className={label}>Votre véhicule *</legend>
          <div className="grid grid-cols-3 gap-2">
            {["Scooter", "Moto", "50 cm³"].map((type, i) => (
              <label
                key={type}
                className="relative cursor-pointer rounded-xl border border-bone/15 bg-ink px-3 py-3 text-center text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
              >
                <input
                  type="radio"
                  name="vehicule"
                  value={type}
                  defaultChecked={i === 0}
                  className="sr-only"
                  required
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="marque">Marque *</label>
            <input id="marque" name="marque" required className={classe("marque")} placeholder="Yamaha, Honda…" />
            {messageErreur("marque")}
          </div>
          <div>
            <label className={label} htmlFor="modele">Modèle *</label>
            <input id="modele" name="modele" required className={classe("modele")} placeholder="XMAX 125" />
            {messageErreur("modele")}
          </div>
          <div>
            <label className={label} htmlFor="annee">Année</label>
            <input id="annee" name="annee" inputMode="numeric" className={field} placeholder="2019" />
          </div>
          <div>
            <label className={label} htmlFor="km">Kilométrage</label>
            <input id="km" name="km" inputMode="numeric" className={field} placeholder="24 000" />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="immatriculation">
              Immatriculation{" "}
              <span className="font-normal text-bone/35">(facultatif, mais ça nous fait gagner du temps)</span>
            </label>
            <input
              id="immatriculation"
              name="immatriculation"
              className={`${field} uppercase placeholder:normal-case`}
              placeholder="AB-123-CD"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={label} htmlFor="prestation">Prestation souhaitée *</label>
          <select id="prestation" name="prestation" required className={classe("prestation")} defaultValue="">
            <option value="" disabled>Choisir…</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
            <option value="autre">Je ne sais pas / autre problème</option>
          </select>
          {messageErreur("prestation")}
        </div>

        <div className="mt-4">
          <label className={label} htmlFor="message">
            {mode === "devis" ? "Décrivez le problème *" : "Précisions (facultatif)"}
          </label>
          <textarea
            id="message"
            name="message"
            required={mode === "devis"}
            rows={mode === "devis" ? 4 : 3}
            className={classe("message")}
            placeholder="Bruit au freinage depuis une semaine, surtout à froid…"
          />
          {messageErreur("message")}
        </div>

        {mode === "rdv" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="date">Date souhaitée *</label>
              <input id="date" name="date" type="date" required className={classe("date")} />
              {messageErreur("date")}
            </div>
            <div>
              <label className={label} htmlFor="creneau">Créneau préféré *</label>
              <select id="creneau" name="creneau" required className={field} defaultValue="matin">
                <option value="matin">Matin (10h – 13h)</option>
                <option value="apresmidi">Après-midi (14h – 19h)</option>
                <option value="indifferent">Indifférent</option>
              </select>
            </div>
            <p className="rounded-xl border border-bone/10 bg-ink px-4 py-3 text-xs leading-relaxed text-bone/50 sm:col-span-2">
              Cette demande ne réserve pas encore votre créneau. L’atelier vous
              rappelle sous 24 h ouvrées pour le confirmer — nous préférons un
              rendez-vous tenu à un rendez-vous annulé.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <label className={label} htmlFor="disponibilite">Vos disponibilités</label>
            <select id="disponibilite" name="disponibilite" className={field} defaultValue="semaine">
              <option value="urgent">Dès que possible — c’est urgent</option>
              <option value="semaine">Cette semaine</option>
              <option value="prochaine">La semaine prochaine</option>
              <option value="flexible">Je suis flexible</option>
            </select>
          </div>
        )}

        <div className="mt-6 grid gap-4 border-t border-bone/10 pt-6 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="nom">Nom *</label>
            <input id="nom" name="nom" required className={classe("nom")} placeholder="Votre nom" />
            {messageErreur("nom")}
          </div>
          <div>
            <label className={label} htmlFor="telephone">Téléphone *</label>
            <input id="telephone" name="telephone" type="tel" required className={classe("telephone")} placeholder="06 12 34 56 78" />
            {messageErreur("telephone")}
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" className={classe("email")} placeholder="vous@exemple.fr" />
            {messageErreur("email")}
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-bone/50">
          <input type="checkbox" name="consentement" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#e11d26]" />
          <span>
            J’accepte que mes informations soient utilisées pour être recontacté au
            sujet de ma demande. Elles ne sont ni revendues ni utilisées à
            d’autres fins.
          </span>
        </label>

        {erreurGlobale && (
          <p
            role="alert"
            data-erreur="globale"
            className="mt-5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm leading-relaxed text-accent-soft"
          >
            {erreurGlobale}
          </p>
        )}

        <button
          type="submit"
          disabled={envoi}
          data-cta={mode === "devis" ? "quote-submit" : "rdv-submit"}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {envoi
            ? "Envoi en cours…"
            : mode === "devis"
              ? "Envoyer ma demande de devis"
              : "Envoyer ma demande de rendez-vous"}
          {!envoi && <Arrow className="h-4 w-4" />}
        </button>
        <p className="mt-3 text-center text-xs text-bone/35">
          Gratuit et sans engagement · Réponse sous 24 h ouvrées
        </p>
      </form>
    </div>
  );
}
