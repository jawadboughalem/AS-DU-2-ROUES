import Link from "next/link";
import { Camera, Star } from "./icons";
import { site } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Bouton                                                                     */
/* -------------------------------------------------------------------------- */

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "ghostLight";
  className?: string;
  "aria-label"?: string;
};

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-soft shadow-[0_10px_30px_-12px_rgba(255,90,31,0.8)]",
  ghost:
    "border border-bone/25 text-bone hover:border-bone/60 hover:bg-bone/5",
  ghostLight:
    "border border-ink/20 text-ink hover:border-ink/50 hover:bg-ink/5",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <Link
      href={href}
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Structure de section                                                       */
/* -------------------------------------------------------------------------- */

export function Section({
  id,
  tone = "dark",
  className = "",
  children,
}: {
  id?: string;
  tone?: "dark" | "light" | "darker";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    dark: "bg-ink text-bone",
    darker: "bg-ink-2 text-bone",
    light: "bg-bone text-ink",
  } as const;
  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "muted";
}) {
  return (
    <p
      className={`eyebrow mb-4 ${tone === "accent" ? "text-accent" : "text-current/50"}`}
    >
      {children}
    </p>
  );
}

export function Title({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={`display text-4xl sm:text-5xl md:text-[3.4rem] ${className}`}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Emplacement photo                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Marque l'emplacement d'une photo que le client doit fournir.
 * Volontairement visible : tant que ces blocs sont présents, le site
 * n'est pas prêt pour la production.
 */
export function PhotoSlot({
  label,
  className = "",
  tone = "dark",
}: {
  label: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed p-6 text-center ${
        isDark
          ? "border-bone/20 bg-ink-3 text-bone/55"
          : "border-ink/20 bg-bone-2 text-ink/50"
      } ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${
            isDark ? "rgba(255,255,255,.05)" : "rgba(10,11,13,.05)"
          } 0 10px, transparent 10px 20px)`,
        }}
      />
      <Camera className="relative h-7 w-7" />
      <p className="relative max-w-[26ch] text-xs leading-relaxed font-medium">
        {label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Note Google                                                                */
/* -------------------------------------------------------------------------- */

export function RatingChip({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <a
      href={site.googleReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors ${
        tone === "dark"
          ? "border-bone/15 bg-bone/[0.04] hover:border-bone/35"
          : "border-ink/15 bg-white hover:border-ink/35"
      }`}
    >
      <span className="flex text-accent" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-3.5 w-3.5" />
        ))}
      </span>
      <span className="font-semibold">{site.rating.score.toFixed(1)}</span>
      <span className="opacity-60">·</span>
      <span className="opacity-70">{site.rating.count} avis Google</span>
    </a>
  );
}
