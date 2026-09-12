import { site } from "@/lib/site";
import { Arrow, Phone } from "./icons";
import { Eyebrow, Section, Title } from "./ui";

export function Practical() {
  return (
    <Section id="infos" tone="dark">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>Infos pratiques</Eyebrow>
          <Title>Passez à l&apos;atelier.</Title>

          <dl className="mt-9 space-y-7">
            <div>
              <dt className="eyebrow text-bone/40">Adresse</dt>
              <dd className="mt-2 text-lg text-bone/90">
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-bone/40">Téléphone</dt>
              <dd className="mt-2">
                <a
                  href={site.phoneHref}
                  data-cta="infos-call"
                  className="display text-2xl text-accent hover:underline"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-bone/40">Horaires</dt>
              <dd className="mt-3">
                <ul className="max-w-xs">
                  {site.hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex justify-between border-b border-bone/8 py-2 text-sm last:border-0"
                    >
                      <span className="text-bone/70">{h.day}</span>
                      <span
                        className={
                          "closed" in h && h.closed
                            ? "text-bone/35"
                            : "font-medium text-bone"
                        }
                      >
                        {h.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
            >
              <Phone className="h-4 w-4" />
              Appeler
            </a>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="infos-directions"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 px-6 py-3.5 text-sm font-semibold text-bone transition-colors hover:border-bone/60"
            >
              Itinéraire
              <Arrow className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Emplacement de la carte : chargée en différé en production pour ne
            pas pénaliser la performance ni déposer de cookie au chargement. */}
        <div className="relative min-h-[22rem] overflow-hidden rounded-2xl border border-bone/12 bg-ink-2">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div className="absolute inset-0 grid place-items-center p-8 text-center">
            <div>
              <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" strokeWidth={1.7} aria-hidden>
                  <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" />
                </svg>
              </span>
              <p className="display text-lg">Carte Google Maps</p>
              <p className="mx-auto mt-2 max-w-[30ch] text-xs leading-relaxed text-bone/50">
                Intégrée en production, en chargement différé — adresse exacte à
                confirmer avec l&apos;atelier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
