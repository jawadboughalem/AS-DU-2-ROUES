import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findService, services } from "@/lib/services";
import { process, site } from "@/lib/site";
import { Breadcrumb, PageShell } from "@/components/page-shell";
import { Arrow, Check, Icons, Phone } from "@/components/icons";
import { Eyebrow, Title } from "@/components/ui";

/**
 * L'export statique exige que toutes les routes soient connues au build :
 * `dynamicParams` est donc désactivé, une URL inconnue rend un 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return {
    title: service.pageTitle,
    description: service.metaDescription,
    alternates: { canonical: `/prestations/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const Icon = Icons[service.icon];
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <PageShell>
      {/* ---------- Accroche ---------- */}
      <section className="grain relative overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-[26rem] w-[26rem] rounded-full opacity-20 blur-[110px]"
          style={{ background: "radial-gradient(circle, #e11d26 0%, transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
          <Breadcrumb
            trail={[
              { href: "/", label: "Accueil" },
              { href: "/prestations", label: "Prestations" },
              { label: service.title },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <div>
              <span className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-accent/12 text-accent">
                <Icon className="h-7 w-7" />
              </span>
              <Title as="h1" className="max-w-[18ch]">
                {service.title}
              </Title>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/70 sm:text-lg">
                {service.intro}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={site.phoneHref}
                  data-cta={`service-${service.slug}-call`}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-accent-soft"
                >
                  <Phone className="h-4 w-4" />
                  {site.phone}
                </a>
                <Link
                  href="/#devis"
                  data-cta={`service-${service.slug}-quote`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-[0.95rem] font-semibold text-bone transition-colors hover:border-bone/60 hover:bg-bone/5"
                >
                  Demander un devis
                  <Arrow className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Repères pratiques */}
            <dl className="rounded-2xl border border-bone/12 bg-ink-2 p-6">
              {service.price && (
                <div className="border-b border-bone/10 pb-4">
                  <dt className="eyebrow text-bone/40">Tarif indicatif</dt>
                  <dd className="display mt-1.5 text-xl text-accent">{service.price}</dd>
                </div>
              )}
              {service.duration && (
                <div className={service.price ? "border-b border-bone/10 py-4" : "border-b border-bone/10 pb-4"}>
                  <dt className="eyebrow text-bone/40">Durée habituelle</dt>
                  <dd className="mt-1.5 text-sm text-bone/85">{service.duration}</dd>
                </div>
              )}
              <div className="pt-4">
                <dt className="eyebrow text-bone/40">Horaires</dt>
                <dd className="mt-1.5 text-sm text-bone/85">
                  Du mardi au samedi, 10h – 19h
                </dd>
                <dd className="mt-1 text-xs text-bone/45">
                  {site.address.street}, {site.address.zip} {site.address.city}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- Contenu de l'intervention ---------- */}
      <section className="bg-bone text-ink">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Ce que comprend l&apos;intervention</Eyebrow>
            <h2 className="display text-3xl sm:text-4xl">Dans le détail</h2>
            <ul className="mt-7 space-y-3">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[0.9375rem] text-ink/75">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow>Quand faut-il intervenir</Eyebrow>
            <h2 className="display text-3xl sm:text-4xl">Les signes qui alertent</h2>
            <ul className="mt-7 space-y-3">
              {service.signs.map((s) => (
                <li
                  key={s}
                  className="rounded-xl border border-ink/10 bg-white px-5 py-4 text-[0.9375rem] text-ink/75"
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink/55">
              Un doute ? Appelez-nous et décrivez ce que vous constatez. Nous
              vous dirons si ça peut attendre — c&apos;est gratuit, et ça évite
              parfois un déplacement inutile.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Déroulement ---------- */}
      <section className="bg-ink-2 text-bone">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-24">
          <Eyebrow>Comment ça se passe</Eyebrow>
          <h2 className="display max-w-[20ch] text-3xl sm:text-4xl">
            Rien n&apos;est engagé sans votre accord.
          </h2>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <li key={step.step} className="rounded-2xl border border-bone/10 bg-ink p-6">
                <span className="display text-2xl text-accent">{step.step}</span>
                <h3 className="display mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone/60">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Appel à l'action ---------- */}
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-accent/25 bg-accent/[0.07] p-8 md:flex-row md:items-center">
            <div>
              <h2 className="display text-2xl sm:text-3xl">
                Besoin d&apos;un devis pour {service.title.toLowerCase()} ?
              </h2>
              <p className="mt-2 max-w-lg text-sm text-bone/65">
                Décrivez votre véhicule et votre problème, nous revenons vers
                vous sous 24 h ouvrées.
              </p>
            </div>
            <Link
              href="/#devis"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-4 text-[0.95rem] font-semibold text-white transition-colors hover:bg-accent-soft"
            >
              Demander un devis
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Maillage interne ---------- */}
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <Eyebrow tone="muted">Nos autres prestations</Eyebrow>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/prestations/${s.slug}`}
                  className="inline-block rounded-full border border-bone/15 px-4 py-2 text-sm text-bone/70 transition-colors hover:border-accent/50 hover:text-bone"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
