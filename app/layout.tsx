import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { services, site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** À remplacer par le domaine réel une fois acheté par le client. */
const SITE_URL = "https://www.asdu2roues.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Réparation moto & scooter à ${site.address.district}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Atelier indépendant de réparation, entretien et dépannage moto et scooter à Paris 13. Toutes marques, devis gratuit avant intervention. Achat, vente et reprise de deux-roues d'occasion.",
  keywords: [
    "réparation moto Paris 13",
    "garage scooter Paris 13",
    "entretien moto Paris",
    "révision scooter Paris",
    "mécanicien deux roues Paris",
    "dépannage scooter Paris",
    "rachat moto Paris",
    "reprise scooter Paris",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — Réparation moto & scooter à ${site.address.district}`,
    description:
      "Atelier indépendant moto et scooter à Paris 13. Toutes marques, devis gratuit, diagnostic expliqué. Achat, vente et reprise.",
  },
  robots: {
    // La maquette ne doit jamais être indexée. À inverser à la mise en production.
    index: !site.isDraft,
    follow: !site.isDraft,
  },
};

/**
 * Données structurées : c'est ce qui permet à Google d'afficher l'atelier,
 * ses horaires et sa note dans les résultats locaux.
 */
function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.name,
    url: SITE_URL,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    areaServed: "Paris et proche banlieue",
    priceRange: "€€",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.short },
    })),
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${inter.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
