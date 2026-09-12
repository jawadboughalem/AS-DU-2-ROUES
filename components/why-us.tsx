import { Check, Cross } from "./icons";
import { Eyebrow, Section, Title } from "./ui";

const rows = [
  { label: "Qui s'occupe de votre véhicule", us: "Le même mécanicien, que vous connaissez", them: "Un technicien différent à chaque passage" },
  { label: "Le devis", us: "Établi après diagnostic, sur mesure", them: "Forfait standardisé, options en supplément" },
  { label: "Les pièces remplacées", us: "On vous les montre et on vous explique", them: "Remplacées, rarement expliquées" },
  { label: "Les modèles acceptés", us: "Toutes marques, y compris anciens modèles", them: "Marques et modèles récents en priorité" },
  { label: "Le conseil", us: "On vous dit aussi ce qui peut attendre", them: "L'intérêt est de vendre la prestation" },
];

export function WhyUs() {
  return (
    <Section tone="light">
      <div className="max-w-2xl">
        <Eyebrow>Pourquoi un atelier indépendant</Eyebrow>
        <Title>Un garage, pas une chaîne.</Title>
        <p className="mt-5 text-base leading-relaxed text-ink/65">
          Les centres rapides ont leurs avantages. Mais sur un deux-roues, ce
          qui fait la différence, c&apos;est le mécanicien qui connaît votre
          machine — et qui a le temps de vous l&apos;expliquer.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-ink/10 bg-ink px-5 py-4 text-bone sm:grid-cols-[1.2fr_1fr_1fr] sm:px-7">
          <span className="eyebrow text-bone/45">Le critère</span>
          <span className="eyebrow text-accent">L&apos;As du 2 Roues</span>
          <span className="eyebrow hidden text-bone/45 sm:block">
            Un centre de réseau
          </span>
        </div>
        <ul>
          {rows.map((row, i) => (
            <li
              key={row.label}
              className={`grid gap-2 px-5 py-5 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-start sm:gap-4 sm:px-7 ${
                i % 2 ? "bg-bone-2/40" : ""
              }`}
            >
              <span className="text-sm font-semibold text-ink">{row.label}</span>
              <span className="flex items-start gap-2 text-sm text-ink/75">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {row.us}
              </span>
              <span className="flex items-start gap-2 text-sm text-ink/40">
                <Cross className="mt-0.5 h-4 w-4 shrink-0" />
                {row.them}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
