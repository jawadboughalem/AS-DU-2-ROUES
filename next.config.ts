import type { NextConfig } from "next";

/**
 * Deux cibles de déploiement coexistent volontairement :
 *
 * 1. Par défaut (Netlify, plus tard) : rendu Next.js complet, indispensable
 *    dès que le formulaire enverra réellement des e-mails et que l'espace
 *    d'administration aura besoin de routes serveur.
 *
 * 2. STATIC_EXPORT=true (GitHub Pages) : export 100 % statique, utilisé pour
 *    publier la maquette de présentation sans dépendre d'un compte tiers.
 *    Suffisant tant que le site n'a pas de route serveur.
 *
 * NEXT_PUBLIC_BASE_PATH est fourni par le workflow à partir du nom du dépôt,
 * pour que le site continue de fonctionner si le dépôt est renommé.
 */
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = staticExport
  ? {
      output: "export",
      basePath,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
