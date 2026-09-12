import { Breadcrumb, PageShell } from "./page-shell";
import { Title } from "./ui";

/** Mise en page commune aux pages légales : colonne de lecture étroite. */
export function LegalPage({
  title,
  label,
  updated,
  children,
}: {
  title: string;
  label: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 md:py-20">
          <Breadcrumb trail={[{ href: "/", label: "Accueil" }, { label }]} />
          <Title as="h1">{title}</Title>
          <p className="mt-4 text-xs text-bone/45">Dernière mise à jour : {updated}</p>
          <div className="mt-12 space-y-8">{children}</div>
        </div>
      </section>
    </PageShell>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="display mb-3 text-xl">{heading}</h2>
      <div className="space-y-3 text-[0.9375rem] leading-relaxed text-bone/70">
        {children}
      </div>
    </section>
  );
}

/** Signale une information que le client doit encore fournir. */
export function ToFill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-accent/15 px-1.5 py-0.5 font-medium text-accent-soft">
      {children}
    </span>
  );
}
