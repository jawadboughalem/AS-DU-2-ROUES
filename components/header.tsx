import Link from "next/link";
import { site } from "@/lib/site";
import { Phone } from "./icons";
import { LogoMark, Wordmark } from "./logo";

const nav = [
  { href: "#prestations", label: "Prestations" },
  { href: "#occasion", label: "Achat / Vente" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#avis", label: "Avis" },
  { href: "#infos", label: "Infos pratiques" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — accueil`}>
          <LogoMark className="h-11 w-11" />
          <Wordmark />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-bone/70 transition-colors hover:text-bone"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phoneHref}
            data-cta="header-call"
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft sm:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {site.phone}
          </a>

          {/* Menu mobile sans JavaScript */}
          <details className="relative lg:hidden">
            <summary
              className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border border-bone/20 text-bone [&::-webkit-details-marker]:hidden"
              aria-label="Ouvrir le menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth={1.8} aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-bone/15 bg-ink-2 py-2 shadow-2xl">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-bone/80 hover:bg-bone/5 hover:text-bone"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#devis"
                className="mt-1 block border-t border-bone/10 px-4 py-2.5 text-sm font-semibold text-accent"
              >
                Devis / Rendez-vous
              </a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
