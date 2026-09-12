import Link from "next/link";
import { site } from "@/lib/site";
import { Phone } from "./icons";

/**
 * Barre d'appel permanente sur mobile.
 * La majorité des visiteurs arrivent depuis un téléphone, souvent en panne :
 * l'appel doit rester à un pouce de distance en permanence.
 */
export function StickyCall() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-bone/10 bg-ink-2/95 p-3 backdrop-blur lg:hidden">
      <div className="flex gap-2.5">
        <a
          href={site.phoneHref}
          data-cta="sticky-call"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white"
        >
          <Phone className="h-4 w-4" />
          Appeler l&apos;atelier
        </a>
        <Link
          href="/#devis"
          data-cta="sticky-quote"
          className="flex flex-1 items-center justify-center rounded-full border border-bone/25 py-3.5 text-sm font-semibold text-bone"
        >
          Devis gratuit
        </Link>
      </div>
    </div>
  );
}
