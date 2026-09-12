import { faq } from "@/lib/site";
import { Eyebrow, Section, Title } from "./ui";

export function Faq() {
  return (
    <Section tone="darker">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Eyebrow>Questions fréquentes</Eyebrow>
          <Title>Vous vous demandez sûrement…</Title>
        </div>

        <ul className="divide-y divide-bone/10 border-y border-bone/10">
          {faq.map((item) => (
            <li key={item.q}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[0.9375rem] font-semibold text-bone [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-bone/20 text-accent transition-transform duration-200 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" strokeWidth={2.4}>
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-5 pr-12 text-sm leading-relaxed text-bone/60">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
