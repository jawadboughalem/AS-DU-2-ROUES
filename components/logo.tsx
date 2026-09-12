/**
 * Marque provisoire, dessinée d'après l'identité existante de l'atelier
 * (roue dentée + as de pique, noir et rouge).
 *
 * À REMPLACER par le fichier logo original du client, idéalement en SVG.
 * Si le client n'a que le fichier de sa carte de visite, il faudra le
 * vectoriser — c'est un point à aborder lors du rendez-vous de cadrage.
 */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  // 16 dents régulières sur la couronne
  const teeth = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="var(--color-accent)" />
      {teeth.map((angle) => (
        <rect
          key={angle}
          x="46.5"
          y="-1"
          width="7"
          height="12"
          rx="1.5"
          fill="var(--color-accent)"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="39" fill="none" stroke="#fff" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
      {/* Pique */}
      <path
        d="M50 28c-6 8-14 13-14 20a7.2 7.2 0 0 0 12.2 5.1c-.5 4.2-1.8 7-3.6 8.6h10.8c-1.8-1.6-3.1-4.4-3.6-8.6A7.2 7.2 0 0 0 64 48c0-7-8-12-14-20z"
        fill="#fff"
      />
    </svg>
  );
}

export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="leading-none">
      <span
        className={`display block text-[0.95rem] tracking-tight ${
          tone === "dark" ? "text-bone" : "text-ink"
        }`}
      >
        L&apos;As du 2 Roues
      </span>
      <span className={`eyebrow ${tone === "dark" ? "text-bone/45" : "text-ink/45"}`}>
        Paris 13
      </span>
    </span>
  );
}
