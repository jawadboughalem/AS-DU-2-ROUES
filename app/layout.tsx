import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { site } from "@/lib/site";
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
    default: `${site.name} — Réparation moto & scooter à ${site.address.city}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Atelier indépendant de réparation et d'entretien moto et scooter à Paris. Toutes marques, diagnostic honnête, devis gratuit avant toute intervention.",
  keywords: [
    "réparation moto Paris",
    "garage scooter Paris",
    "entretien moto Paris",
    "révision scooter Paris",
    "mécanicien deux roues Paris",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — Réparation moto & scooter à ${site.address.city}`,
    description:
      "Atelier indépendant moto et scooter à Paris. Toutes marques, devis gratuit, diagnostic expliqué.",
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
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
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
