import Link from "next/link";
import { services, site } from "@/lib/site";
import { LogoMark } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink pb-28 lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <p className="display text-lg">{site.name}</p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/55">
            Atelier indépendant de réparation, d&apos;entretien et de dépannage
            moto et scooter à {site.address.district}. Toutes marques. Achat,
            vente et reprise.
          </p>
          <a
            href={site.phoneHref}
            className="display mt-5 inline-block text-xl text-accent hover:underline"
          >
            {site.phone}
          </a>
        </div>

        <div>
          <p className="eyebrow mb-4 text-bone/40">Prestations</p>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a href="#prestations" className="text-sm text-bone/60 hover:text-bone">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-bone/40">L&apos;atelier</p>
          <ul className="space-y-2 text-sm text-bone/60">
            <li>
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </li>
            <li>
              <a href="#infos" className="hover:text-bone">
                Horaires &amp; accès
              </a>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-bone">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-bone">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-bone/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Tous droits réservés.
          </p>
          <p>Maquette de présentation — contenus provisoires.</p>
        </div>
      </div>
    </footer>
  );
}
