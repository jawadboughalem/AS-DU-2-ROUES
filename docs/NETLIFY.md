# Mise en ligne sur Netlify

## Netlify, c'est quoi

Un **hébergeur qui se branche sur GitHub**. Une fois connecté :

1. tu pousses ton code sur GitHub ;
2. Netlify le détecte, lance `npm run build` sur ses propres serveurs ;
3. il met le résultat en ligne, avec HTTPS, sur un réseau de diffusion mondial.

Tu ne touches jamais à un serveur, tu ne fais jamais de `ftp`, tu ne redémarres
rien. **Ton `git push` est ton déploiement.**

### Ce que Netlify apporte que GitHub Pages ne peut pas

GitHub Pages ne sait servir que des **fichiers figés**. C'est suffisant pour une
maquette, pas pour un site qui doit agir.

| Besoin | GitHub Pages | Netlify |
|---|---|---|
| Servir des pages | ✅ | ✅ |
| HTTPS et nom de domaine | ✅ | ✅ |
| **Envoyer un e-mail à la réception d'un formulaire** | ❌ | ✅ |
| **Espace d'administration avec un mot de passe** | ❌ | ✅ |
| **Lire et écrire dans une base de données** | ❌ | ✅ |
| Variables secrètes (clés d'API) | ❌ | ✅ |
| URL de préproduction par branche | ❌ | ✅ |

Les trois lignes en gras sont exactement ce que l'offre 2 vend au client. Elles
ont besoin d'un serveur qui exécute du code à chaque visite — c'est ce que
Netlify fournit et que Pages ne fournira jamais.

### Le prix

**0 €.** L'offre gratuite couvre très largement un site d'atelier, et — point
important — **elle autorise l'usage commercial**, contrairement à l'offre
gratuite de Vercel qui l'interdit.

---

## Pourquoi tu n'as pas à me donner d'accès

Deux raisons.

**1. Je ne peux pas joindre Netlify.** La politique réseau de cet environnement
refuse `netlify.com` au niveau du proxy. Avec ou sans identifiants, je ne peux
ni me connecter, ni créer le site, ni lancer un déploiement. Un mot de passe ne
changerait rien au blocage.

**2. On ne partage pas d'identifiants, jamais.** Un mot de passe ou un jeton
collé dans une conversation, un ticket ou un mail est un secret compromis : il
reste dans l'historique, il est sauvegardé, il fuit. C'est vrai avec moi comme
avec n'importe quel prestataire. **La bonne pratique, c'est de ne jamais avoir
à le faire** — et c'est justement le cas ici.

La connexion GitHub ↔ Netlify se fait **directement entre les deux services**,
par une autorisation que tu accordes en un clic. Aucun secret ne transite par
toi, ni par moi.

---

## La marche à suivre — environ 3 minutes

### 1. Créer le compte

Va sur **netlify.com** → *Sign up* → **Sign up with GitHub**.

> **Avec quel compte ?** Le tien pour l'instant. À la livraison, tu inviteras le
> client comme propriétaire du site, ou tu transféreras le site vers son compte.
> C'est prévu dans la proposition : tout ce qui porte son identité doit finir
> chez lui.

### 2. Importer le dépôt

*Add new site* → *Import an existing project* → **GitHub** → autoriser l'accès →
choisir **`AS-DU-2-ROUES`**.

### 3. Ne rien saisir

Netlify lit le fichier `netlify.toml` déjà présent dans le dépôt : commande de
build, version de Node, plugin Next.js, en-têtes de sécurité. Les champs se
remplissent seuls.

Clique **Deploy**.

### 4. Attendre 2 à 3 minutes

Le site sort sur une URL du type `nom-aleatoire.netlify.app`. Tu peux la
renommer : *Site configuration* → *Change site name* → `as-du-2-roues`.

**C'est cette URL qu'on met dans le mail au client.**

---

## Après, tout est automatique

À partir de là, chaque `git push` sur `main` redéploie le site tout seul. Et
chaque branche produit sa propre URL de préproduction — c'est ce qui te
permettra d'envoyer une version en validation sans toucher au site en ligne.

---

## Les variables d'environnement, en détail

Les variables à créer dans *Site configuration → Environment variables*.
Elles ne se configurent pas toutes de la même façon, et l'erreur coûte cher.

| Variable | Secret ? | Portée (Scopes) | Valeur |
|---|---|---|---|
| `RESEND_API_KEY` | **Oui** — cocher *Contains secret values* | **Functions, et rien d'autre** | La clé Resend |
| `ADMIN_MOT_DE_PASSE` | **Oui** | **Functions, et rien d'autre** | Le mot de passe de l'espace atelier |
| `ADMIN_SECRET` | **Oui** | **Functions, et rien d'autre** | Une longue chaîne aléatoire, jamais vue par personne |
| `CONTACT_TO` | Non | Functions | L'adresse qui reçoit les demandes |
| `CONTACT_FROM` | Non | Functions | L'adresse d'expédition (`onboarding@resend.dev` tant que le domaine n'est pas vérifié) |
| `NEXT_PUBLIC_SITE_URL` | **Non, jamais** | **Builds** | L'adresse publique du site |

**Les deux variables de l'espace atelier.** `ADMIN_MOT_DE_PASSE` est ce que
l'atelier tape pour entrer. `ADMIN_SECRET` ne se tape jamais : c'est la clé
avec laquelle le serveur signe le cookie de session. Sans elle, n'importe qui
pourrait fabriquer un cookie valide et entrer sans mot de passe. Elle se
génère au hasard, se colle dans Netlify, et s'oublie :

```bash
openssl rand -base64 48
```

Changer `ADMIN_SECRET` déconnecte tout le monde immédiatement — c'est le geste
à faire si un doute apparaît, sans avoir à changer le mot de passe de
l'atelier.

Tant que ces deux variables sont absentes, `/admin` affiche la page de
connexion et refuse toute saisie en l'expliquant. Le site public, lui,
fonctionne normalement.

**Les aperçus ne touchent pas aux vraies demandes.** Un magasin Netlify Blobs
vit par défaut au niveau du site : un déploiement d'aperçu lirait et
modifierait les demandes de production. Le code nomme donc le magasin d'après
la variable `CONTEXT` fournie par Netlify — seule la production écrit dans
`demandes`, un aperçu écrit dans `demandes-deploy-preview`. C'est pour cette
raison que le mot de passe peut avoir la même valeur dans tous les contextes
sans risque pour les données de l'atelier.

**Pourquoi `Functions` pour la clé.** Sur Netlify, Next.js est servi par une
fonction serverless — on la voit passer dans le journal de construction sous
le nom `___netlify-server-handler`. C'est elle qui exécute la route d'envoi
d'e-mails, à chaque requête. La portée qui la concerne s'appelle donc
*Functions*, et non *Runtime*, qui vise les fonctions edge et les formulaires
Netlify.

**Et surtout : ne pas cocher `Builds` pour un secret.** Le scanner de secrets
de Netlify fait échouer la construction s'il retrouve la valeur d'une variable
marquée secrète dans les fichiers produits :

```
Secret env var "RESEND_API_KEY"'s value detected:
  found value at line 12289 in .netlify/.next/cache/turbopack/...
Build failed due to a user error
```

Ce n'est pas un faux positif. Avec la portée *Builds*, la variable est
présente pendant la construction, et le cache de Turbopack en conserve une
copie. Le secret se retrouve donc écrit sur disque, dans un cache que Netlify
restaure d'une construction à l'autre.

**La bonne réponse serait de retirer la portée `Builds`**, que cette clé n'a
jamais eu besoin d'avoir. Sur l'offre gratuite, ce n'est pas possible :
restreindre les portées est une fonction payante, l'interface affiche
*Upgrade to unlock* et les cases restent grisées.

À défaut, on exempte le cache du scanner, dans `netlify.toml` :

```toml
SECRETS_SCAN_OMIT_PATHS = ".netlify/.next/cache/**,.next/cache/**"
```

**La distinction qui compte.** Trois réglages existent, et ils ne se valent
pas du tout :

| Réglage | Effet | Verdict |
|---|---|---|
| `SECRETS_SCAN_ENABLED=false` | Éteint le contrôle entièrement | ❌ jamais |
| `SECRETS_SCAN_OMIT_KEYS` | Cesse de chercher **cette clé**, partout | ❌ jamais |
| `SECRETS_SCAN_OMIT_PATHS` sur le cache | Cesse de scanner **un répertoire non publié** | ✅ ciblé |

Les deux premiers aveuglent le contrôle. Le troisième le concentre là où il
sert : le cache de construction n'est pas servi aux visiteurs, alors que tout
ce qui part réellement en ligne continue d'être scanné. C'est la réponse que
la documentation de Netlify prévoit pour ce cas précis.

**Pourquoi dans `netlify.toml` et pas dans l'interface.** Une exemption de
sécurité doit être lisible, versionnée et justifiée. Dans un fichier, elle
porte un commentaire qui explique pourquoi elle existe et quand la retirer ;
dans l'interface, c'est une case cochée que personne ne saura expliquer dans
six mois.

**Après correction, il faut vider le cache.** La construction fautive a été
sauvegardée : *Deploys → Trigger deploy → **Clear cache and deploy site***.
Un simple redéploiement restaurerait le cache empoisonné et échouerait
à nouveau.

**Pourquoi `Builds` pour l'URL.** Tout ce qui commence par `NEXT_PUBLIC_` est
inscrit en dur dans le code envoyé au navigateur, au moment de la
construction. C'est le préfixe qui le dit : **une variable `NEXT_PUBLIC_` est
publique par nature.** Ne jamais y mettre un secret — la cocher *Contains
secret values* ne changerait rien, elle finirait quand même dans le code
source visible par tous.

**Contextes de déploiement : le choix ne se pose pas pour un secret.**

Dès que *Contains secret values* est coché, Netlify **impose** des portées
explicites et **une valeur explicite par contexte** : l'option *Same value for
all deploy contexts* devient inaccessible. Ce n'est pas un défaut de l'offre
gratuite, c'est une règle de sécurité — elle empêche qu'un secret de
production se retrouve appliqué partout d'un seul geste, y compris dans des
environnements de test.

Pour la clé Resend — et de la même façon pour `ADMIN_MOT_DE_PASSE` et
`ADMIN_SECRET` — remplir ainsi :

| Contexte | Valeur |
|---|---|
| Production | la clé |
| Deploy Previews | la clé — sinon les liens de validation envoyés au client ont un formulaire cassé |
| Branch deploys | la clé |
| Preview Server & Agent Runners | vide |
| **Local development (Netlify CLI)** | **vide** |

La dernière ligne compte. L'interface l'écrit elle-même sous le champ : cette
valeur *« is available to the CLI, and is not considered secret »*. Y coller
la vraie clé annule une partie de la protection qu'on vient d'activer. En
développement local, la clé vit dans `.env.local`, qui est ignoré par Git.

Les variables non secrètes — `CONTACT_TO`, `CONTACT_FROM` et
`NEXT_PUBLIC_SITE_URL` — n'ont pas cette contrainte : *Same value for all
deploy contexts* leur va très bien.

**Après chaque ajout ou modification :** *Deploys → Trigger deploy → Clear
cache and deploy site*. Une variable n'est pas appliquée rétroactivement au
déploiement déjà en ligne.

---

## Les secrets ne se montrent pas

Une règle, sans exception : **un secret ne sort jamais de l'endroit où il doit
vivre.** Pas dans une conversation, pas dans un ticket, pas dans un mail, pas
dans une capture d'écran.

Une capture d'un écran de configuration est une fuite au même titre qu'un
copier-coller : la valeur est lisible, et elle reste dans l'historique de
l'outil où elle a transité.

Avant toute capture, masquer le champ — Netlify propose une icône œil barré à
droite de chaque valeur — ou recadrer.

**Si un secret a fuité :** le révoquer d'abord, en créer un nouveau ensuite.
Dans cet ordre. Une clé révoquée est inoffensive ; une clé « qu'on pense que
personne n'a vue » ne l'est pas.

---

## Ce que je fais dès que l'URL existe

1. **Brancher l'envoi réel du formulaire** : une route serveur reçoit la
   demande, la valide, envoie l'e-mail à l'atelier et l'accusé de réception au
   client.
2. **Créer le compte Resend** pour l'envoi d'e-mails (offre gratuite).
3. **Monter l'espace d'administration** : liste des demandes,
   confirmation en un clic. *(Fait — sans Supabase : le stockage passe par
   Netlify Blobs, déjà inclus dans l'hébergement.)*

Pour les étapes 2 et 3, il faudra une clé d'API. **Elle ne passera pas non plus
par la conversation** : tu la colleras directement dans *Site configuration →
Environment variables* chez Netlify. Le code lit la variable, personne ne voit
la valeur.

---

## Et GitHub Pages, on le garde ?

Oui, pour l'instant — ça ne coûte rien et ça fait un filet de sécurité. Mais
**on ne communique qu'une seule URL au client** : celle de Netlify, qui
deviendra le vrai site. Pages restera une copie de démonstration jusqu'à
l'achat du nom de domaine, après quoi on l'éteindra pour éviter deux versions
du même site dans les moteurs de recherche.
