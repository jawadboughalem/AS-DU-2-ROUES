import { reviews, site } from "@/lib/site";
import { Arrow, Star } from "./icons";
import { Eyebrow, Section, Title } from "./ui";

export function Reviews() {
  return (
    <Section id="avis" tone="dark">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <Eyebrow>Ce qu&apos;en disent nos clients</Eyebrow>
          <Title>
            {site.rating.score.toFixed(1)} / 5 sur Google,
            <br className="hidden sm:block" /> et ce n&apos;est pas un hasard.
          </Title>
        </div>
        <a
          href={site.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          Lire les {site.rating.count} avis
          <Arrow className="h-4 w-4" />
        </a>
      </div>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {reviews.map((review) => (
          <li
            key={review.name}
            className="flex flex-col rounded-2xl border border-bone/10 bg-ink-2 p-6"
          >
            <span className="flex gap-0.5 text-accent" aria-label="5 étoiles sur 5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4" />
              ))}
            </span>
            <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-bone/80">
              « {review.body} »
            </blockquote>
            <footer className="mt-5 border-t border-bone/10 pt-4">
              <p className="text-sm font-semibold">{review.name}</p>
              <p className="text-xs text-bone/45">{review.context}</p>
            </footer>
          </li>
        ))}
      </ul>
    </Section>
  );
}
