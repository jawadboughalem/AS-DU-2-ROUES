import { site } from "@/lib/site";
import { Header } from "./header";
import { Arrow, Check, Phone } from "./icons";
import { PhotoSlot, RatingChip } from "./ui";

export function Hero() {
  return (
    <div className="grain relative overflow-hidden bg-ink">
      {/* Halo d'accent discret, purement décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(circle, #e11d26 0%, transparent 65%)" }}
      />
      <Header />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pt-32 pb-20 sm:px-8 md:pt-40 md:pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-accent">
            Atelier indépendant · {site.address.district}
          </p>

          <h1 className="display text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-[4.25rem]">
            Réparation moto
            <br />
            &amp; scooter à Paris{" "}13.
            <br />
            <span className="text-accent">Sans mauvaise surprise.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
            Entretien, réparation, dépannage — et achat, vente, reprise. Toutes
            marques, du 50 cm³ au gros cube. On diagnostique, on vous explique,
            on vous annonce le prix — <strong className="font-semibold text-bone">et seulement
            ensuite</strong> on intervient.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
            {["Ouvert le samedi", "Toutes marques", "Achat · Vente · Reprise"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-bone/75">
                <Check className="h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.phoneHref}
              data-cta="hero-call"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[0.95rem] font-semibold text-white shadow-[0_14px_40px_-14px_rgba(225,29,38,0.85)] transition-colors hover:bg-accent-soft"
            >
              <Phone className="h-4.5 w-4.5" />
              {site.phone}
            </a>
            <a
              href="#devis"
              data-cta="hero-quote"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-[0.95rem] font-semibold text-bone transition-colors hover:border-bone/60 hover:bg-bone/5"
            >
              Demander un devis
              <Arrow className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8">
            <RatingChip />
          </div>
        </div>

        <div className="relative">
          <PhotoSlot
            label="Photo principale — l'atelier en activité, un mécanicien au travail sur une moto. Format vertical, prise sur place."
            className="min-h-[22rem] lg:min-h-[30rem]"
          />
          {/* Carte de réassurance superposée */}
          <div className="absolute -bottom-5 -left-3 w-56 rounded-xl border border-bone/10 bg-ink-2 p-4 shadow-2xl sm:-left-6">
            <p className="display text-3xl text-accent">24h</p>
            <p className="mt-1 text-xs leading-relaxed text-bone/65">
              Réponse à votre demande de devis sous 24 h ouvrées.
            </p>
          </div>
        </div>
      </div>

      {/* Bandeau marques */}
      <div className="relative border-y border-bone/10 bg-ink-2/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-7 gap-y-2 px-5 py-5 sm:px-8">
          <span className="eyebrow text-bone/35">Nous travaillons</span>
          {site.brands.map((brand) => (
            <span key={brand} className="text-sm font-medium text-bone/45">
              {brand}
            </span>
          ))}
          <span className="text-sm font-medium text-accent">et les autres</span>
        </div>
      </div>
    </div>
  );
}
