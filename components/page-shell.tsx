import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";
import { StickyCall } from "./sticky-call";
import { DraftBanner } from "./draft-banner";

/** Enveloppe commune aux pages internes : bandeau, en-tête opaque, pied de page. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DraftBanner />
      <Header solid />
      <main>{children}</main>
      <Footer />
      <StickyCall />
    </>
  );
}

export function Breadcrumb({
  trail,
}: {
  trail: readonly { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-bone/45">
        {trail.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-bone">
                {item.label}
              </Link>
            ) : (
              <span className="text-bone/70">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
