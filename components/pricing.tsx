import { pricing } from "@/lib/site";
import { Eyebrow, Section, Title } from "./ui";

export function Pricing() {
  return (
    <Section id="tarifs" tone="light">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Eyebrow>Tarifs indicatifs</Eyebrow>
          <Title>Les prix, avant de venir.</Title>
          <p className="mt-5 text-base leading-relaxed text-ink/65">
            Rares sont les ateliers qui affichent leurs prix. Nous le faisons
            parce que vous avez le droit de savoir à quoi vous attendre.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink/50">
            Ces montants sont donnés à titre indicatif, main-d&apos;œuvre
            comprise, pour les modèles les plus courants. Le prix exact est
            confirmé par devis gratuit après examen du véhicule.
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-2">
          <ul>
            {pricing.map((line, i) => (
              <li
                key={line.label}
                className={`flex items-baseline justify-between gap-6 px-5 py-4 ${
                  i ? "border-t border-ink/8" : ""
                }`}
              >
                <span className="text-sm text-ink/75">{line.label}</span>
                <span className="display shrink-0 text-lg text-ink">
                  {line.price}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="#devis"
            className="mt-2 flex items-center justify-center rounded-xl bg-ink px-5 py-4 text-sm font-semibold text-bone transition-colors hover:bg-ink-3"
          >
            Obtenir un prix exact pour mon véhicule
          </a>
        </div>
      </div>
    </Section>
  );
}
