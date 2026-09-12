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

## Ce que je fais dès que l'URL existe

1. **Brancher l'envoi réel du formulaire** : une route serveur reçoit la
   demande, la valide, envoie l'e-mail à l'atelier et l'accusé de réception au
   client.
2. **Créer le compte Resend** pour l'envoi d'e-mails (offre gratuite).
3. **Monter l'espace d'administration** : base Supabase, authentification,
   liste des demandes, confirmation en un clic.

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
