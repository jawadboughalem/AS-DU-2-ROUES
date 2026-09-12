import { site } from "@/lib/site";
import { Check, Phone } from "./icons";
import { Eyebrow, Title } from "./ui";
import { QuoteForm } from "./quote-form";

const arguments_ = [
  "Devis estimé ou créneau confirmé sous 24 h ouvrées",
  "Aucun engagement, aucun frais",
  "Vous parlez directement au mécanicien, pas à un centre d’appel",
  "Plus votre description est précise, plus l’estimation l’est",
];

export function QuoteCta() {
  return (
    <section id="devis" className="grain relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-32 h-[30rem] w-[30rem] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #e11d26 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="lg:pt-4">
          <Eyebrow>Devis &amp; rendez-vous</Eyebrow>
          <Title className="max-w-[11ch]">
            Décrivez votre problème.
          </Title>
          <p className="display mt-1 text-4xl text-accent sm:text-5xl md:text-[3.4rem]">
            On s’occupe du reste.
          </p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-bone/65">
            Pas besoin de vous déplacer pour savoir combien ça coûte, ni pour
            caler un passage à l&apos;atelier. Choisissez l&apos;onglet qui
            correspond à votre besoin.
          </p>

          <ul className="mt-8 space-y-3">
            {arguments_.map((a) => (
              <li key={a} className="flex items-start gap-3 text-sm text-bone/75">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-bone/12 bg-ink-2 p-6">
            <p className="text-sm text-bone/60">Vous préférez parler de vive voix ?</p>
            <a
              href={site.phoneHref}
              data-cta="devis-call"
              className="display mt-2 inline-flex items-center gap-2.5 text-2xl text-accent hover:underline"
            >
              <Phone className="h-5 w-5" />
              {site.phone}
            </a>
          </div>
        </div>

        <QuoteForm />
      </div>
    </section>
  );
}
