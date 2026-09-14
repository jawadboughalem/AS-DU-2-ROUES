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

### D9 — La demande est enregistrée avant d'être envoyée par e-mail
Un e-mail n'est pas un stockage : s'il part en spam, si la clé d'API expire ou
si le service tombe, le prospect disparaît sans que personne ne s'en aperçoive.
La demande est donc écrite d'abord, envoyée ensuite ; et l'échec de l'écriture
n'annule pas l'envoi. Il faut deux pannes simultanées pour perdre un client.

### D10 — Netlify Blobs plutôt qu'une base de données
Supabase était prévu. Il aurait imposé un compte de plus à créer, à payer un
jour et à transmettre à l'atelier. Netlify Blobs est déjà inclus dans
l'hébergement : rien à ouvrir, rien à facturer, rien à migrer le jour où le
site change de mains. Le stockage est isolé derrière une interface de quatre
méthodes — si le volume justifie un jour une vraie base, seul ce fichier
change.

Corollaire : une seconde implémentation, un simple fichier JSON, sert en
développement et en recette. Sans elle l'espace ne serait testable qu'une fois
déployé.

### D11 — Un mot de passe partagé, pas de comptes
L'atelier, c'est une personne, éventuellement deux. Un système de comptes
ajouterait un formulaire d'inscription, une réinitialisation par e-mail, une
table d'utilisateurs à protéger — pour un seul utilisateur réel. Un mot de
passe en variable d'environnement et une session signée suffisent, et ne
laissent rien à voler côté client. Le jour où il faut distinguer deux
personnes, la question se reposera.

### D12 — Un magasin de données par contexte de déploiement
Un magasin Netlify Blobs vit par défaut au niveau du site : sa documentation
précise que les données sont lisibles et modifiables « across different
deploys and deploy contexts ». Concrètement, un aperçu de branche — URL
publique, code non relu — écrirait dans les demandes réelles de l'atelier, et
une recette suffirait à les altérer. Le magasin est donc nommé d'après
`CONTEXT` : seule la production écrit dans `demandes`.

`getDeployStore`, qui isole par déploiement, était le mauvais outil : ce
magasin est effacé avec son déploiement. Des demandes clients ne peuvent pas
disparaître au redéploiement suivant.

### D13 — Le code refuse un secret de signature trop court
Une construction Netlify a échoué : le scanner de secrets avait retrouvé la
valeur d'`ADMIN_SECRET` dans `docs/NETLIFY.md`. La doc proposait
`openssl rand -base64 48` dans un bloc de code ; la commande a été collée dans
Netlify à la place de son résultat. Le secret de signature valait donc une
chaîne publiquement lisible dans le dépôt — de quoi fabriquer un cookie de
session valide et entrer sans mot de passe.

Deux corrections, parce qu'une seule aurait laissé le piège intact :

1. **La doc** distingue désormais la commande de sa réponse, et donne une
   solution de repli sans terminal.
2. **Le code** refuse tout `ADMIN_SECRET` de moins de 32 caractères : aucune
   session ouverte, aucune session validée, et un message explicite sur la page
   de connexion. La longueur réelle reste dans les journaux du serveur — la
   donner à un visiteur non authentifié ne renseignerait que lui.

À retenir : le scanner n'a pas trouvé une fuite, il a trouvé une *absence* de
secret. C'est le même signal, et il méritait le même arrêt.

### D14 — Le créneau confirmé est stocké sous forme exploitable
La première version de l'espace ne conservait du rendez-vous confirmé que sa
phrase française : « Jeudi 24 septembre 2026, le matin, entre 10h et 13h ».
Elle se lit très bien et ne se trie pas. Impossible d'en tirer une vue semaine,
un comptage, ou un rappel la veille.

Le jour et le créneau sont donc stockés séparément, et la phrase reste à côté —
non par redondance, mais parce qu'elle est la trace de ce qui a été *promis* au
client dans son e-mail. Si la formulation évolue, l'historique doit continuer
de dire ce qui a réellement été écrit.

### D15 — La vue semaine sert surtout au moment de confirmer
Un planning qu'on consulte est utile ; un planning qui intervient au moment de
la décision change le travail. L'indication de charge a donc été placée dans la
fiche, juste au-dessus du bouton de confirmation : « déjà 2 le matin et 0
l'après-midi ». C'est là que l'information évite l'erreur, pas dans un onglet
qu'il faudrait penser à ouvrir avant.

Trois règles de fond pour cette vue :
- **Aucune donnée invisible.** Les jours fermés ne sont masqués que s'ils sont
  vides. Un rendez-vous pris en exception un lundi reste affiché, signalé comme
  tel.
- **Le dimanche, on regarde devant.** La semaine « en cours » d'un dimanche est
  celle qui se termine : la page s'ouvrirait sur cinq jours passés au moment
  précis où l'on prépare les cinq suivants.
- **L'heure est celle de Paris, pas celle du serveur.** Netlify exécute ses
  fonctions en UTC ; un samedi 23h30 à Paris, le serveur est déjà dimanche.

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

1. ~~Créer le compte Resend et saisir RESEND_API_KEY chez Netlify~~ — fait
2. ~~Espace d'administration : liste des demandes, confirmation en un clic~~ —
   fait (Netlify Blobs, pas Supabase : voir D10)
3. Saisir `ADMIN_MOT_DE_PASSE` et `ADMIN_SECRET` chez Netlify, puis vérifier
   qu'une vraie demande apparaît bien dans `/admin` en ligne
4. ~~Vue semaine des rendez-vous confirmés~~ — fait
5. Renommer le site Netlify en `as-du-2-roues` et mettre à jour
   `NEXT_PUBLIC_SITE_URL`
6. Page « L'atelier » (à propos), une fois les photos prises
7. Remplacer les emplacements photo par les vraies images
8. Compléter les champs légaux : SIRET, forme juridique, assurance, médiateur

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

### 14 septembre 2026
- Rendu des e-mails corrigé sur mobile : il manquait la balise `viewport`, si
  bien que Gmail Android composait sur 980 px et décalait tout vers la droite
- **Le test mentait** : il comparait la largeur du contenu à celle de la page,
  toutes deux à 980 px, et voyait donc zéro débordement. Il mesure désormais
  d'abord la largeur de l'appareil. Un test qui mesure la mauvaise chose est
  pire que pas de test du tout.
- Enregistrement des demandes avant envoi de l'e-mail (D9), stockage Netlify
  Blobs avec adaptateur fichier pour la recette (D10)
- Espace atelier livré : connexion par mot de passe partagé (D11), session
  signée de 12 h, liste filtrable, fiche détaillée, confirmation d'un créneau
  avec e-mail au client, changement de statut
- Recette étendue à l'espace : six contrôles, du refus sans session jusqu'à la
  déconnexion
- Magasin isolé par contexte de déploiement (D12) : un aperçu ne peut plus
  écrire dans les demandes de production
- Construction en échec sur le scanner de secrets : `ADMIN_SECRET` valait la
  commande de génération au lieu de son résultat. Doc clarifiée et garde-fou
  posé dans le code (D13)

### 14 septembre 2026 (suite)
- Construction en échec sur un 500 interne de Netlify, à l'étape de
  téléversement : relancée, passée. Rien de notre côté.
- Vue semaine livrée : mardi – samedi, matin et après-midi, navigation d'une
  semaine à l'autre, demandes en attente signalées par jour
- Créneau confirmé stocké sous forme exploitable (D14), indication de charge
  au moment de confirmer (D15)
- Arithmétique des dates isolée et vérifiée sur ses cas limites : changement
  d'heure d'octobre, passage d'année, jour parisien contre jour serveur
- Deux défauts levés par la recette étendue : un sélecteur devenu ambigu (le
  nouvel onglet est lui aussi un lien vers /admin/…) et, derrière, une vraie
  absence — ni la liste ni la semaine ne portaient de titre de niveau 1
