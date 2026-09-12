import Link from "next/link";
import { services } from "@/lib/site";
import { Icons, Arrow } from "./icons";
import { Eyebrow, Section, Title } from "./ui";

export function Services() {
  return (
    <Section id="prestations" tone="light">
      <div className="max-w-2xl">
        <Eyebrow>Nos prestations</Eyebrow>
        <Title>
          Tout ce dont votre
          <br className="hidden sm:block" /> deux-roues a besoin.
        </Title>
        <p className="mt-5 text-base leading-relaxed text-ink/65">
          De l&apos;entretien courant à la recherche de panne, l&apos;atelier
          prend en charge motos et scooters de toutes marques. Une seule
          adresse, un seul interlocuteur.
        </p>
      </div>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="display text-xl">{service.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink/60">
                  {service.short}
                </p>
                <ul className="mt-4 space-y-1.5 border-t border-ink/8 pt-4">
                  {service.bullets.map((b) => (
                    <li key={b} className="text-[0.8125rem] text-ink/55">
                      · {b}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  En savoir plus
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
