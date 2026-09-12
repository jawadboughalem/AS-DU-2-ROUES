# Déploiement — procédure complète

> Objectif : passer du code à une URL publique, en gardant le client
> propriétaire de tout ce qui porte son identité.

---

## Étape 0 — Le dépôt GitHub

Le code vit actuellement dans le dépôt `BlackBox`, sur la branche
`claude/practical-cerf-skwc1n`.

**Deux options pour lui donner son vrai nom :**

| Option | Action | Conséquence |
|---|---|---|
| **A — Renommer** (le plus simple) | GitHub → dépôt → Settings → General → *Repository name* → `as-du-2-roues` → Rename | GitHub redirige l'ancienne URL. Rien à reconfigurer. |
| B — Nouveau dépôt | Créer `as-du-2-roues`, y pousser le code | Le dépôt `BlackBox` et son historique `mcp-blackbox` restent intacts |

Puis, dans les deux cas : merger la branche dans `main`, car c'est `main` que
Netlify va suivre.

```bash
git checkout main
git merge claude/practical-cerf-skwc1n
git push origin main
```

Après un renommage, mettre à jour l'URL distante locale :

```bash
git remote set-url origin https://github.com/<compte>/as-du-2-roues.git
```

---

## Étape 1 — Netlify

**Pourquoi Netlify et pas Vercel :** l'offre gratuite de Vercel (Hobby)
**interdit l'usage commercial**. Un site de client en est un. Netlify et
Cloudflare Pages autorisent le commercial sur leur offre gratuite.

1. Créer un compte sur netlify.com — **avec l'adresse du client si possible**,
   sinon avec la tienne en prévoyant de l'inviter comme propriétaire ensuite.
2. *Add new site* → *Import an existing project* → GitHub → autoriser → choisir
   le dépôt.
3. Netlify lit `netlify.toml` : la commande de build et le plugin Next.js sont
   déjà configurés, il n'y a rien à saisir.
4. *Deploy*. Au bout de 2 à 3 minutes, le site est en ligne sur une URL du type
   `as-du-2-roues.netlify.app`.

**C'est cette URL qu'on envoie au client pour la recette.** Jamais le dépôt.

À partir de là, chaque `git push` sur `main` redéploie automatiquement, et
chaque branche génère sa propre URL de préproduction.

---

## Étape 2 — Le nom de domaine

**Il doit être acheté par le client, avec sa carte, sur son compte.** C'est le
point le plus important de tout ce document : un domaine au nom du prestataire
rend le client captif, et c'est la première chose qu'un confrère lui
reprochera.

1. Registrar recommandé : **OVH** ou **Gandi** (français, support en français).
2. Candidats : `asdu2roues.fr`, `lasdu2roues.fr`, `asdu2roues.paris`.
   Vérifier la disponibilité avant de promettre quoi que ce soit au client.
3. Coût : 12 à 15 € par an.
4. Dans Netlify : *Domain management* → *Add a domain* → saisir le domaine.
5. Netlify indique les serveurs DNS à renseigner chez le registrar (ou les
   enregistrements A / CNAME si on garde le DNS du registrar). Compter de
   quelques minutes à 24 h de propagation.
6. **HTTPS** : Netlify délivre un certificat Let's Encrypt automatiquement, et
   le renouvelle seul. Vérifier que *Force HTTPS* est bien activé.

---

## Étape 3 — L'adresse e-mail

Aujourd'hui l'atelier utilise `lasdudeuxroues@gmail.com`. Ça fonctionne, mais
`contact@asdu2roues.fr` inspire nettement plus confiance sur un devis.

| Option | Coût | Pour qui |
|---|---|---|
| **Redirection d'alias** (recommandée au départ) | 0 € chez la plupart des registrars | `contact@asdu2roues.fr` arrive dans la boîte Gmail existante. Rien à changer dans ses habitudes. |
| Google Workspace | ~6,90 €/mois | S'il veut une vraie boîte professionnelle, avec envoi depuis cette adresse |

**Ne vends pas d'hébergement e-mail.** C'est une source de support sans fin pour
une marge nulle.

---

## Étape 4 — L'envoi des formulaires

Le formulaire est aujourd'hui une maquette : il ne transmet rien. Pour le
brancher réellement :

1. Créer un compte **Resend** (offre gratuite : ~3 000 e-mails/mois).
2. Y vérifier le domaine du client (quelques enregistrements DNS à ajouter).
3. Ajouter la clé d'API dans Netlify : *Site configuration* → *Environment
   variables* → `RESEND_API_KEY`. **Jamais dans le code, jamais sur GitHub.**
4. Deux e-mails partent à chaque demande : un vers l'atelier, un accusé de
   réception vers le client.

**Alternative sans compte tiers :** Netlify Forms (100 envois/mois gratuits).
Plus simple à mettre en place, mais moins souple sur la mise en forme des
e-mails, et le quota est vite atteint.

---

## Étape 5 — Vérifications avant mise en production

- [ ] `site.isDraft` passé à `false`
- [ ] Plus aucun `PhotoSlot` dans les pages
- [ ] Coordonnées, horaires et tarifs validés par écrit par le client
- [ ] Formulaire testé de bout en bout : l'atelier reçoit bien l'e-mail
- [ ] HTTPS actif et forcé
- [ ] Pages mentions légales et confidentialité en ligne
- [ ] Fiche Google Business à jour, **strictement identique** au site (nom,
      adresse, téléphone, horaires) — toute divergence pénalise le référencement
- [ ] Site soumis dans la Google Search Console
- [ ] Lighthouse ≥ 90 sur les quatre axes, sur mobile
- [ ] Test réel sur un téléphone, pas seulement en simulation navigateur

---

## Étape 6 — Qui possède quoi

| Service | Propriétaire du compte | Ton rôle |
|---|---|---|
| Nom de domaine | **Client** | Accès délégué |
| Netlify | **Client** | Administrateur invité |
| Google Business Profile | **Client** | Gestionnaire — *jamais* son mot de passe |
| Dépôt GitHub | Toi, transféré ou dupliqué à la livraison | Propriétaire |
| Resend / analytics | Toi (compte technique) | Propriétaire |

Règle : **tout ce qui porte l'identité du client lui appartient. Tout ce qui est
purement technique peut être à toi, mais doit rester transférable.**

---

## Coûts récurrents

| Poste | Coût |
|---|---|
| Nom de domaine `.fr` | 12 – 15 € / an |
| Hébergement Netlify | 0 € |
| Envoi des e-mails (Resend) | 0 € |
| Base de données (Supabase, pour la V2) | 0 € sur l'offre gratuite |
| **Total** | **~15 € / an** |

---

## V2 — Demandes de rendez-vous et espace d'administration

C'est ce que le client a demandé en priorité. Architecture retenue :

**Le principe, et pourquoi :** le formulaire enregistre une *demande* de
rendez-vous, pas une réservation ferme. L'atelier voit les demandes dans son
espace et confirme, décale ou refuse en un clic — le client reçoit alors un
e-mail de confirmation. Un créneau réservé automatiquement serait intenable :
sans avoir vu le véhicule, on ne connaît ni la durée ni les pièces nécessaires.
Le client garde la main, et aucun rendez-vous n'est annulé après coup.

**Stack :**

| Besoin | Choix | Coût |
|---|---|---|
| Base de données | Supabase (PostgreSQL, hébergé en UE) | 0 € |
| Authentification de l'atelier | Supabase Auth, e-mail + mot de passe | 0 € |
| Espace d'administration | Route `/admin` protégée dans le même projet Next.js | 0 € |
| Notifications | Resend (e-mail à l'atelier, accusé au client) | 0 € |

**Contenu de l'espace d'administration :**

- Liste des demandes (devis et rendez-vous) avec statut : nouvelle, confirmée,
  traitée, refusée
- Fiche détaillée : véhicule, prestation, coordonnées, description
- Confirmation d'un créneau en un clic → e-mail automatique au client
- Vue calendrier de la semaine
- Export CSV

**Points de vigilance :**

- **RGPD** : les demandes contiennent des données personnelles. Prévoir une
  durée de conservation (12 mois) et une purge automatique.
- **Sécurité** : `/admin` interdit aux moteurs de recherche, mot de passe fort,
  et idéalement double authentification.
- **Formation** : 30 minutes avec le client, plus un guide d'une page. Un
  espace d'administration que personne n'ouvre ne sert à rien.
