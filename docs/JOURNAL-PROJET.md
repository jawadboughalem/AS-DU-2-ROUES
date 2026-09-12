# Journal de projet — L'As du 2 Roues

Registre des décisions et de l'état d'avancement. Mis à jour à chaque session.
Sert aussi de base à l'étude de cas portfolio.

**Client :** L'As du 2 Roues — 212 rue du Château des Rentiers, 75013 Paris
**Dépôt :** `jawadboughalem/AS-DU-2-ROUES`
**Démarrage :** 12 septembre 2026

---

## État actuel

| Chantier | État |
|---|---|
| Cadrage produit | ✅ Fait |
| Analyse concurrentielle (Moto'Minute) | ✅ Fait |
| Analyse de prix | ✅ Fait — voir `ANALYSE-PRIX.md` |
| Maquette page d'accueil | ✅ Fait |
| Identité visuelle | ✅ Reprise du logo existant (noir / rouge / pique) |
| Recette automatisée | ✅ 56 contrôles verts, pages et API |
| Déploiement | ✅ Netlify — https://exquisite-klepon-7b7751.netlify.app/ |
| Envoi réel du formulaire | 🟡 Codé et testé — attend la clé Resend |
| Pages par prestation | ✅ 8 pages livrées |
| Mentions légales / confidentialité | ✅ Livrées, champs légaux à compléter |
| Espace d'administration | ⬜ À faire |
| Proposition et mail client | ✅ Prêts — mail aussi livré en Word |

---

## Décisions structurantes

### D1 — Pas de réservation à créneaux fermes
**Le client a demandé une prise de rendez-vous en ligne.** Retenu, mais sous
forme de *demande* : le client indique date et créneau souhaités, l'atelier
confirme depuis son espace.

*Pourquoi :* sans avoir vu le véhicule, ni la durée d'intervention ni les
pièces ne sont connues. Un créneau bloqué automatiquement obligerait l'atelier
à annuler — ce qui produit des avis négatifs, l'inverse de l'objectif.
Le formulaire et la FAQ l'annoncent explicitement au visiteur.

### D2 — Positionnement inverse de celui du concurrent
Moto'Minute vend le volume (60 000 réparations/an, 3 centres, « -30 min de
prise en charge »). Un atelier indépendant perd sur ce terrain.

Le site vend donc l'inverse : le même mécanicien, le devis avant intervention,
les pièces montrées, **l'ouverture le samedi** et **l'achat/vente/reprise**.

### D3 — L'ouverture du samedi comme argument principal
Aucun des trois centres Moto'Minute n'ouvre le samedi ; l'atelier est ouvert du
mardi au samedi. Pour une clientèle qui travaille en semaine, c'est l'argument
décisif. Placé en accroche et dans le comparatif.

### D4 — Achat / vente / reprise traité comme une activité à part entière
Découvert sur la carte de visite, absent de la première version. Le concurrent
ne le propose pas. Section dédiée plutôt qu'une ligne dans les prestations.

### D5 — Prix ramené de 2 990 € à 1 890 €
Le premier chiffrage partait de la complexité technique. Les comparables réels
du marché placent un site de garage avec formulaire de RDV à 1 190 – 1 690 €.
Un écart de 1 800 € face à cette référence était intenable.

1 890 € se justifie en une phrase (sur-mesure + espace de gestion), et une
entrée à 1 190 € reste possible si le budget coince. Détail dans
`ANALYSE-PRIX.md`.

### D6 — Déploiement par GitHub Actions plutôt que Netlify
L'environnement de développement n'a pas accès à `netlify.com` (refus de
politique d'egress, 403 sur le CONNECT). Plutôt que de contourner, le build a
été déplacé sur l'infrastructure GitHub, ce qui est de toute façon le pipeline
CI/CD normal d'un projet.

Première tentative via l'artefact Pages officiel : échec, le jeton du workflow
ne peut pas *créer* le site Pages (`Resource not accessible by integration`).
Solution retenue : publication sur une branche `gh-pages`, qui ne demande que
le droit d'écriture sur le contenu.

**Activation de Pages : les trois voies sont verrouillées.**

| Voie | Résultat |
|---|---|
| Jeton du workflow (`actions/configure-pages`) | `Resource not accessible by integration` |
| Jeton de session via l'API REST `/repos/…/pages` | `Access to this GitHub API path is not permitted through this proxy` |
| Ouvrir `github.io` depuis la session | Egress refusé (403 sur le CONNECT) |

Le pipeline fonctionne — la branche `gh-pages` contient bien le site construit
(`index.html`, `_next/`, `.nojekyll`). Seule l'activation initiale de Pages
demande une action manuelle, une seule fois :
**Settings → Pages → Source : *Deploy from a branch* → `gh-pages` / `/ (root)`.**
Ensuite chaque push redéploie tout seul.

Cette cible est **provisoire**. Dès que le formulaire enverra de vrais e-mails
et que l'espace d'administration existera, le site aura besoin de routes
serveur et basculera sur Netlify.

### D7 — GitHub Pages retiré au profit de Netlify
La double cible de build a rempli son office : publier la maquette sans
dépendre d'un compte tiers, le temps que Netlify soit en place. Elle est
retirée, car un export statique ne peut pas héberger la route serveur du
formulaire — la version Pages aurait affiché un formulaire cassé, ce qui est
pire que pas de version du tout.

Reste une action à faire une fois : passer *Settings → Pages → Source* sur
*None*, sans quoi GitHub continue de servir la dernière construction.

### D8 — Le piège à robots est accepté par le schéma, pas rejeté
La première version refusait le champ piège au niveau de la validation. La
recette a montré que le robot recevait alors une erreur nommant précisément le
champ fautif — soit exactement l'information qui lui permet de contourner le
piège au coup suivant. Le schéma l'accepte désormais, et la route répond 200
sans rien envoyer.

---

## Ce qui reste à obtenir du client

- [ ] **Le logo en fichier original** — celui de la carte est une photo, non
      exploitable. La marque actuelle du site est une interprétation.
- [ ] Validation ou refus de la grille de **tarifs indicatifs**
- [ ] Vraies **photos de l'atelier** (prévoir une heure sur place)
- [ ] Confirmation des **horaires** et de l'accès (station de métro)
- [ ] Note et nombre d'**avis Google** réels, et accord pour les citer
- [ ] Qui gère la **fiche Google Business**
- [ ] Informations légales : SIRET, forme juridique, assurance

---

## Prochaines étapes techniques

1. Créer le compte Resend et saisir RESEND_API_KEY chez Netlify
2. Espace d'administration : Supabase (base + authentification), liste des
   demandes, confirmation en un clic
3. Page « L'atelier » (à propos), une fois les photos prises
4. Remplacer les emplacements photo par les vraies images
5. Compléter les champs légaux : SIRET, forme juridique, assurance, médiateur

---

## Journal

### 12 septembre 2026
- Cadrage complet, analyse du besoin et de la concurrence
- Maquette de la page d'accueil livrée : 12 sections, formulaire à deux
  onglets, barre d'appel mobile, données structurées `AutoRepair`
- Identité reprise de la carte de visite (noir / rouge / pique)
- Recette automatisée écrite et passée : 34 contrôles verts, 1 défaut corrigé
  (meta description à 185 caractères, ramenée à 154)
- Dépôt réaffecté, ancien projet `mcp-blackbox` préservé sur la branche
  `claude/mcp-blackbox-cli-setup-oxwb3w`
- Pipeline de déploiement mis en place
- Analyse de prix refaite sur comparables réels, tarif révisé à 1 890 €
- Proposition commerciale et mail client prêts, mail livré aussi en Word
- GitHub Pages activé, maquette en ligne
- 8 pages prestation, page pilier, mentions légales et confidentialité
- Champ immatriculation ajouté au formulaire
- Recette étendue au parcours complet du site : elle a détecté une ancre morte
  vers `#devis` sur les 11 pages internes, corrigée
- Netlify en ligne, GitHub Pages retiré
- Envoi réel du formulaire codé : schéma partagé, route serveur, deux e-mails,
  piège à robots, états de chargement et d'erreur
- Recette étendue à la route serveur : trois anomalies levées, dont une réelle
  (le piège à robots renseignait le robot sur le champ à éviter) et deux
  fausses (Next.js pose son propre role="alert" ; un piège hors écran reste
  « visible » au sens de Playwright)
