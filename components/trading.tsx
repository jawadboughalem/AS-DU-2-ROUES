import { trading } from "@/lib/site";
import { Arrow } from "./icons";
import { Eyebrow, PhotoSlot, Section, Title } from "./ui";

/**
 * Achat / vente / reprise : la seconde activité de l'atelier, et surtout ce
 * que les centres de réseau concurrents ne proposent pas. Elle mérite sa
 * propre section plutôt qu'une ligne perdue dans les prestations.
 */
export function Trading() {
  return (
    <Section id="occasion" tone="darker">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
        <div>
          <Eyebrow>Occasion</Eyebrow>
          <Title>{trading.title}</Title>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/65">
            {trading.lead}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/45">
            Un véhicule vendu ici est un véhicule passé par notre atelier. C&apos;est
            la différence entre acheter à un particulier et acheter à un mécanicien.
          </p>
        </div>
        <PhotoSlot
          label="Photo — un ou deux véhicules d'occasion préparés, devant l'atelier."
          className="min-h-[15rem]"
        />
      </div>

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {trading.cards.map((card) => (
          <li key={card.title}>
            <a
              href="#devis"
              className="group flex h-full flex-col rounded-2xl border border-bone/12 bg-ink p-6 transition-colors hover:border-accent/50"
            >
              <h3 className="display text-xl">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-bone/60">
                {card.body}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                {card.cta}
                <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
