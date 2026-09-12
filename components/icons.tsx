type IconProps = { className?: string };

const base = "h-6 w-6";

/** Icônes dessinées à la main : pas de librairie, pas de poids inutile. */
export const Icons: Record<string, (p: IconProps) => React.JSX.Element> = {
  oil: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} className={className} aria-hidden>
      <path d="M4 13h9l3-3h4v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" stroke="currentColor" strokeLinejoin="round" />
      <path d="M8 13V9h5M16 6v4" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
  tire: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" />
      <path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
  brake: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" />
      <path d="M17 6.5a8.5 8.5 0 0 1 0 11" stroke="currentColor" strokeLinecap="round" />
      <path d="M6 8.5h3M6 15.5h3" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
  diag: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} className={className} aria-hidden>
      <rect x="3" y="4.5" width="18" height="13" rx="2" stroke="currentColor" />
      <path d="M6.5 12h2l1.5-3 2 6 1.5-3h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20.5h6" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
  bolt: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} className={className} aria-hidden>
      <path d="M13.5 3 6 13h5l-1.5 8L18 11h-5z" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  ),
  chain: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} className={className} aria-hidden>
      <circle cx="6.5" cy="12" r="3" stroke="currentColor" />
      <circle cx="17.5" cy="12" r="3" stroke="currentColor" />
      <path d="M9.5 10.5h5M9.5 13.5h5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
};

export function Phone({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className={className} aria-hidden>
      <path
        d="M5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.7 1.5C9.9 18 6 14.1 3.5 5.2A1.5 1.5 0 0 1 5 3.5z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Star({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="m12 2.5 2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3 6.1 20.4l1.2-6.5-4.8-4.6 6.6-.9z" />
    </svg>
  );
}

export function Arrow({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className={className} aria-hidden>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} className={className} aria-hidden>
      <path d="m4.5 12.5 5 5 10-11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Cross({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} className={className} aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

export function Camera({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M3.5 7.5h3l1.5-2h8l1.5 2h3v11h-17z" stroke="currentColor" strokeLinejoin="round" />
      <circle cx="12" cy="12.5" r="3.5" stroke="currentColor" />
    </svg>
  );
}
