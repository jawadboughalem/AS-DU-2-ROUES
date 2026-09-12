import { process } from "@/lib/site";
import { Eyebrow, PhotoSlot, Section, Title } from "./ui";

export function ProcessSteps() {
  return (
    <Section id="deroulement" tone="darker">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <Eyebrow>Comment ça se passe</Eyebrow>
          <Title>
            Quatre étapes,
            <br /> zéro zone d&apos;ombre.
          </Title>
          <p className="mt-5 text-base leading-relaxed text-bone/65">
            La première crainte quand on confie sa moto, c&apos;est la facture
            surprise. Voici exactement comment nous travaillons, à chaque fois.
          </p>
          <PhotoSlot
            label="Photo secondaire — plan large de l'atelier, ou le patron devant la devanture."
            className="mt-9 min-h-[13rem]"
          />
        </div>

        <ol className="relative space-y-8 border-l border-bone/12 pl-8">
          {process.map((item) => (
            <li key={item.step} className="relative">
              <span
                aria-hidden
                className="absolute -left-[2.55rem] grid h-8 w-8 place-items-center rounded-full border border-accent/40 bg-ink font-display text-xs font-bold text-accent"
              >
                {item.step}
              </span>
              <h3 className="display text-xl sm:text-2xl">{item.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone/60">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
