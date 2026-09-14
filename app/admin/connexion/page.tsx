"use client";

import { useActionState } from "react";
import { seConnecter } from "../actions";
import { LogoMark } from "@/components/logo";

export default function ConnexionPage() {
  const [erreur, action, enCours] = useActionState(seConnecter, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="display mt-5 text-2xl">Espace atelier</h1>
          <p className="mt-2 text-sm text-bone/50">
            Vos demandes de devis et de rendez-vous.
          </p>
        </div>

        <form action={action} className="rounded-2xl border border-bone/12 bg-ink-2 p-6">
          <label
            htmlFor="motdepasse"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-bone/55"
          >
            Mot de passe
          </label>
          <input
            id="motdepasse"
            name="motdepasse"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl border border-bone/15 bg-ink px-4 py-3 text-sm text-bone focus:border-accent focus:outline-none"
          />

          {erreur && (
            <p
              role="alert"
              data-erreur="connexion"
              className="mt-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm leading-relaxed text-accent-soft"
            >
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={enCours}
            className="mt-5 w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft disabled:opacity-60"
          >
            {enCours ? "Vérification…" : "Entrer"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-bone/30">
          Page réservée à l&apos;atelier.
        </p>
      </div>
    </main>
  );
}
