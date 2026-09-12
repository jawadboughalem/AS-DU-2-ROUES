import { site } from "@/lib/site";

/** Visible tant que `site.isDraft` vaut true. À retirer avant mise en ligne. */
export function DraftBanner() {
  if (!site.isDraft) return null;
  return (
    <div className="relative z-50 bg-accent/15 px-5 py-2 text-center text-[0.7rem] font-medium tracking-wide text-accent-soft">
      MAQUETTE DE PRÉSENTATION — textes, photos et tarifs provisoires, à valider
      avec l&apos;atelier
    </div>
  );
}
