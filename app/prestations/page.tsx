import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { Breadcrumb, PageShell } from "@/components/page-shell";
import { Arrow, Icons, Phone } from "@/components/icons";
import { Eyebrow, Title } from "@/components/ui";

export const metadata: Metadata = {
  title: "Prestations moto et scooter à Paris 13",
  description:
    "Entretien, réparation, diagnostic, dépannage, pneus, freinage, transmission, électricité. Atelier indépendant toutes marques à Paris 13, ouvert le samedi.",
  alternates: { canonical: "/prestations" },
};

export default function PrestationsPage() {
  return (
    <PageShell>
      <section className="grain relative overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/3 h-[26rem] w-[26rem] rounded-full opacity-20 blur-[110px]"
          style={{ background: "radial-gradient(circle, #e11d26 0%, transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
          <Breadcrumb
            trail={[{ href: "/", label: "Accueil" }, { label: "Prestations" }]}
          />
          <Title as="h1" className="max-w-[16ch]">
            Nos prestations
          </Title>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/70 sm:text-lg">
            Motos et scooters, toutes marques, du 50 cm³ au gros cube. Chaque
            intervention commence par un diagnostic et un devis — rien n&apos;est
            engagé sans votre accord.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.phoneHref}
              data-cta="prestations-call"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-accent-soft"
            >
              <Phone className="h-4 w-4" />
              {site.phone}
            </a>
            <Link
              href="/#devis"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-[0.95rem] font-semibold text-bone transition-colors hover:border-bone/60 hover:bg-bone/5"
            >
              Demander un devis
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-bone text-ink">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-24">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = Icons[service.icon];
              return (
                <li key={service.slug}>
                  <Link
                    href={`/prestations/${service.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_18px_40px_-24px_rgba(10,11,13,0.45)]"
                  >
                    <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="display text-xl">{service.title}</h2>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/60">
                      {service.short}
                    </p>
                    {service.price && (
                      <p className="mt-4 text-sm font-semibold text-ink">
                        {service.price}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      En savoir plus
                      <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 rounded-2xl border border-ink/10 bg-white p-8">
            <Eyebrow>Une autre demande</Eyebrow>
            <h2 className="display text-2xl sm:text-3xl">
              Votre besoin n&apos;est pas dans la liste ?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
              Nous achetons, vendons et reprenons également motos et scooters
              d&apos;occasion, révisés par nos soins. Et si votre problème ne
              rentre dans aucune case, appelez-nous : on trouvera.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/#occasion"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/50"
              >
                Achat · Vente · Reprise
                <Arrow className="h-3.5 w-3.5" />
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
              >
                <Phone className="h-4 w-4" />
                {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
