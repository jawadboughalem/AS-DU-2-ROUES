"use client";

import { useState } from "react";
import { services } from "@/lib/site";
import { Arrow, Check } from "./icons";

const field =
  "w-full rounded-xl border border-bone/15 bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:border-accent focus:outline-none";
const label = "mb-1.5 block text-xs font-semibold tracking-wide text-bone/55";

/**
 * MAQUETTE : le formulaire valide et affiche la confirmation, mais n’envoie
 * encore rien. L’envoi réel (route serveur + Resend + accusé de réception)
 * est prévu en phase de développement.
 */
export function QuoteForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex min-h-[26rem] flex-col items-center justify-center rounded-2xl border border-accent/30 bg-accent/[0.07] p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="display mt-6 text-2xl">Demande envoyée</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/65">
          L’atelier vous répond sous 24 h ouvrées avec une estimation. Pour une
          urgence, appelez-nous directement.
        </p>
        <p className="mt-6 rounded-lg bg-ink px-4 py-2.5 text-xs text-bone/45">
          Maquette : aucun message n’a réellement été envoyé.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-2xl border border-bone/12 bg-ink-2 p-6 sm:p-8"
      noValidate={false}
    >
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
          <input id="marque" name="marque" required className={field} placeholder="Yamaha, Honda…" />
        </div>
        <div>
          <label className={label} htmlFor="modele">Modèle *</label>
          <input id="modele" name="modele" required className={field} placeholder="XMAX 125" />
        </div>
        <div>
          <label className={label} htmlFor="annee">Année</label>
          <input id="annee" name="annee" inputMode="numeric" className={field} placeholder="2019" />
        </div>
        <div>
          <label className={label} htmlFor="km">Kilométrage</label>
          <input id="km" name="km" inputMode="numeric" className={field} placeholder="24 000" />
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="prestation">Prestation souhaitée *</label>
        <select id="prestation" name="prestation" required className={field} defaultValue="">
          <option value="" disabled>Choisir…</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
          <option value="autre">Je ne sais pas / autre problème</option>
        </select>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="message">Décrivez le problème *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className={field}
          placeholder="Bruit au freinage depuis une semaine, surtout à froid…"
        />
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="dispo">Vos disponibilités</label>
        <select id="dispo" name="dispo" className={field} defaultValue="semaine">
          <option value="urgent">Dès que possible — c’est urgent</option>
          <option value="semaine">Cette semaine</option>
          <option value="prochaine">La semaine prochaine</option>
          <option value="flexible">Je suis flexible</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 border-t border-bone/10 pt-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="nom">Nom *</label>
          <input id="nom" name="nom" required className={field} placeholder="Votre nom" />
        </div>
        <div>
          <label className={label} htmlFor="tel">Téléphone *</label>
          <input id="tel" name="tel" type="tel" required className={field} placeholder="06 12 34 56 78" />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" className={field} placeholder="vous@exemple.fr" />
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-bone/50">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff5a1f]" />
        <span>
          J’accepte que mes informations soient utilisées pour être recontacté au
          sujet de ma demande. Elles ne sont ni revendues ni utilisées à
          d’autres fins.
        </span>
      </label>

      <button
        type="submit"
        data-cta="quote-submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-accent-soft"
      >
        Envoyer ma demande
        <Arrow className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs text-bone/35">
        Gratuit et sans engagement · Réponse sous 24 h ouvrées
      </p>
    </form>
  );
}
