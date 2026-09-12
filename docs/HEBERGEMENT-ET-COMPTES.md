# Hébergement, noms de domaine et comptes : qui paie, qui possède

> Document de référence, réutilisable pour tous les clients.

---

## Le principe, en une phrase

**N'avance jamais d'argent pour un client, et ne détiens jamais les clés de son
activité.**

Tout le reste découle de là.

---

## Les trois modèles du marché

### Modèle A — Le client possède et paie tout ✅ *recommandé*

Le client crée les comptes, avec son adresse e-mail et sa carte bancaire. Tu es
invité dessus comme administrateur ou collaborateur.

| | |
|---|---|
| Nom de domaine | Son compte OVH / Gandi, sa carte, prélèvement automatique |
| Hébergement | Son compte Netlify (0 €) |
| Fiche Google Business | Son compte, toi en « gestionnaire » |
| Ce que tu factures | La prestation. Point. |

**Avantages** — Zéro avance de trésorerie. Zéro responsabilité si un paiement
échoue. Le client n'est jamais captif, donc il te fait confiance. Et le jour où
il change de prestataire, la passation est propre : ça se termine bien, et un
client qui part content te recommande.

**Inconvénient** — Il faut lui faire créer deux comptes. Comptez 15 minutes,
ensemble, pendant le rendez-vous de cadrage.

### Modèle B — Tu avances et tu refactures

Tu achètes le domaine et l'hébergement sur ton compte, tu lui refactures chaque
année avec une marge.

**Pourquoi je le déconseille ici :**

- **Le montant rend l'opération absurde.** Le domaine coûte 12 à 15 € par an.
  Émettre une facture, la relancer, l'encaisser et la comptabiliser coûte plus
  cher en temps que la marge que tu y feras.
- **Tu deviens responsable d'une panne que tu ne contrôles pas.** Ta carte
  expire, le renouvellement échoue, le site tombe — et c'est ta faute.
- **Le client devient captif**, ce qui est exactement l'argument que tu utilises
  contre les offres d'abonnement dans ta proposition. Tu ne peux pas dénoncer un
  système et l'appliquer.
- **Point fiscal (micro-entreprise)** : les frais que tu refactures entrent dans
  ton chiffre d'affaires. Tu consommes ton plafond pour zéro marge.
  ⚠️ *À confirmer avec un comptable — c'est de la fiscalité, pas du web.*

### Modèle C — L'abonnement tout compris

Tout sur ton compte, le client paie 50 à 150 €/mois, et ne possède rien. C'est
le modèle Solocal / Simplébo. C'est aussi exactement ce contre quoi ta
proposition se positionne. À exclure.

---

## Le modèle A en pratique

### Comment faire créer les comptes à un client qui « n'y connaît rien »

**Ne lui envoie pas un tutoriel.** Il ne le fera pas, et le projet s'arrêtera là.

**Fais-le avec lui, pendant le rendez-vous de cadrage.** Quinze minutes, sur son
ordinateur ou son téléphone :

1. Tu tiens le clavier, tu le guides.
2. **C'est lui qui saisit son mot de passe et sa carte.** Tu regardes ailleurs à
   ce moment-là — dis-le à voix haute, ça le rassure.
3. Une fois les comptes créés, il t'invite comme administrateur.

Tu repars avec les accès dont tu as besoin, sans jamais avoir connu un seul de
ses mots de passe. C'est ça, la posture professionnelle.

### Ce que ça donne concrètement

| Poste | Qui paie | Combien | Qui possède |
|---|---|---|---|
| Développement du site | Client → toi | 1 890 € | Client |
| Nom de domaine | Client → OVH | ~15 €/an | Client |
| Hébergement Netlify | — | 0 € | Client |
| Envoi d'e-mails Resend | — | 0 € | Toi (compte technique) |
| Base de données Supabase | — | 0 € | Client, à terme |
| Maintenance (optionnelle) | Client → toi | 39 €/mois | — |

**Tu ne factures aucun frais récurrent d'hébergement, parce qu'il n'y en a
pas.** C'est un argument de vente, pas une perte.

### La seule chose qui reste à ton nom

Les comptes purement techniques (Resend pour les e-mails, l'outil de mesure
d'audience) peuvent rester chez toi. Ils ne portent pas l'identité du client,
ils ne le rendent pas captif, et tu peux les migrer en une heure.

**La règle :** tout ce qui porte le nom du client lui appartient. Tout ce qui
est plomberie peut rester chez toi, à condition d'être transférable.

---

## « Je veux pas m'occuper de ça, gère tout »

C'est ce qu'il va dire. Réponse :

> « Les comptes seront à votre nom, mais vous n'aurez rien à faire. Le domaine
> se renouvelle tout seul sur votre carte, 15 € par an, et c'est moi qui gère
> tout le reste. Vous possédez, je m'occupe. »

**Il ne veut pas gérer — il ne demande pas à ne pas posséder.** Les deux ne sont
pas liés, et c'est précisément ce qu'il faut lui expliquer.

S'il insiste vraiment pour que tu avances les frais, alors écris-le dans le
devis, avec ce qui se passe à la fin du contrat : « les frais avancés sont
refacturés à l'euro, et le domaine est transféré au client à la fin de la
prestation, sans frais ».

---

## Ce qui se passe en cas de coup dur

| Scénario | Modèle A (client propriétaire) | Modèle B (toi propriétaire) |
|---|---|---|
| Tu arrêtes ton activité | Il garde tout, il trouve un autre prestataire | Il perd son site et son domaine |
| Il ne paie pas le solde | Tu retires tes accès, il garde un site | Tu peux couper — mais couper un site pour un impayé est un terrain juridique glissant |
| Il change de prestataire | Passation propre, bonne référence | Conflit, et parfois une mauvaise réputation |
| Ta carte bancaire expire | Aucun impact | Le domaine n'est pas renouvelé, le site tombe |

Le dernier cas est le plus fréquent, et le plus bête.

---

## À écrire dans le devis

> **Propriété et frais récurrents**
>
> Le nom de domaine et le compte d'hébergement sont créés au nom du client, sur
> ses propres comptes, et lui appartiennent intégralement. Les frais associés,
> soit environ 15 € par an pour le nom de domaine, sont réglés directement par
> le client auprès du registrar. L'hébergement est gratuit.
>
> Le prestataire est administrateur de ces comptes pendant la durée de la
> mission, sans jamais détenir les identifiants personnels du client. À l'issue
> de la prestation, ou à tout moment sur simple demande, les accès du
> prestataire sont retirés sans que le fonctionnement du site en soit affecté.

---

## Le piège à éviter dans l'offre de maintenance

Écrire « hébergement et domaine inclus » dans une formule de maintenance est
**ambigu** : le client comprend « c'est vous qui payez », toi tu voulais dire
« c'est moi qui m'en occupe ». C'est un litige en préparation, pour 15 €.

La formulation correcte :

> « Gestion technique de l'hébergement et du nom de domaine : surveillance,
> renouvellement, sauvegardes. Les frais correspondants, environ 15 € par an,
> restent réglés par le client auprès du registrar. »
