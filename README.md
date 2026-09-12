# L'As du 2 Roues — site vitrine

Site de l'atelier de réparation moto et scooter **L'As du 2 Roues** (Paris).

> **État : maquette de présentation.** Les textes, photos, tarifs et coordonnées
> sont provisoires et doivent être validés par le client avant toute mise en ligne.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, rendu statique) |
| Langage | TypeScript |
| Styles | Tailwind CSS v4 |
| Polices | Archivo (titres) + Inter (texte), servies localement via `next/font` |
| Hébergement prévu | Netlify ou Cloudflare Pages (offre gratuite, usage commercial autorisé) |

> ⚠️ L'offre gratuite de Vercel (Hobby) **interdit l'usage commercial**. Ne pas
> l'utiliser pour un site client.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run lint
```

## Organisation

```
app/
  layout.tsx        Polices, métadonnées SEO, données structurées LocalBusiness
  page.tsx          Composition de la page d'accueil
  globals.css       Design system (couleurs, typographie, utilitaires)
components/
  ui.tsx            Primitives partagées (Button, Section, Title, PhotoSlot…)
  icons.tsx         Icônes SVG dessinées à la main, sans dépendance
  hero.tsx          En-tête + accroche + CTA
  services.tsx      Les 6 prestations
  process-steps.tsx Le déroulement en 4 étapes
  why-us.tsx        Comparatif atelier indépendant / centre de réseau
  reviews.tsx       Avis clients
  pricing.tsx       Tarifs indicatifs
  quote-cta.tsx     Section demande de devis
  quote-form.tsx    Formulaire (client component)
  practical.tsx     Adresse, horaires, carte
  faq.tsx           Questions fréquentes
  footer.tsx        Pied de page
  sticky-call.tsx   Barre d'appel permanente (mobile)
lib/
  site.ts           SOURCE UNIQUE DE VÉRITÉ : coordonnées, horaires,
                    prestations, tarifs, avis, FAQ
docs/
  PROPOSITION-COMMERCIALE.md
  MAIL-CLIENT.md
```

**Règle :** aucune information de l'atelier n'est écrite en dur dans un composant.
Tout passe par `lib/site.ts`.

## À faire avant la mise en production

- [ ] Remplacer toutes les valeurs marquées `À CONFIRMER` dans `lib/site.ts`
      (téléphone, adresse, e-mail, note Google, horaires, lien Maps)
- [ ] Remplacer les `<PhotoSlot>` par de vraies photos de l'atelier
- [ ] Remplacer le logo typographique provisoire par le logo du client
- [ ] Faire valider ou retirer la grille de tarifs indicatifs
- [ ] Remplacer les avis fictifs par de vrais avis Google, avec accord
- [ ] Brancher l'envoi réel du formulaire (route serveur + service d'e-mails
      + accusé de réception)
- [ ] Créer les pages `/mentions-legales` et `/confidentialite`
- [ ] Créer les pages dédiées par prestation
- [ ] Intégrer la carte Google Maps en chargement différé
- [ ] Passer `site.isDraft` à `false` (retire le bandeau et autorise l'indexation)

## Qualité

```bash
npm run check   # typecheck + lint + build
```

Ces trois commandes sont aussi lancées par la CI GitHub sur chaque push et
chaque pull request (`.github/workflows/ci.yml`).
