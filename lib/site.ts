/**
 * SOURCE UNIQUE DE VÉRITÉ pour toutes les informations de l'atelier.
 *
 * Les coordonnées, horaires et prestations proviennent de la carte de visite
 * de l'atelier. Ce qui reste marqué "À CONFIRMER" doit être validé avant la
 * mise en production.
 */

export const site = {
  /** Passe à false avant la mise en production : masque le bandeau "maquette". */
  isDraft: true,

  name: "L'As du 2 Roues",
  tagline: "Atelier moto & scooter — Paris 13",

  // --- Confirmé par la carte de visite ----------------------------------
  phone: "01 86 04 65 05",
  phoneHref: "tel:+33186046505",
  email: "lasdudeuxroues@gmail.com",
  address: {
    street: "212 rue du Château des Rentiers",
    zip: "75013",
    city: "Paris",
    district: "Paris 13e",
    country: "FR",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=212+rue+du+Ch%C3%A2teau+des+Rentiers+75013+Paris",
  // ----------------------------------------------------------------------

  // --- À CONFIRMER avec le client ---------------------------------------
  /** Note et nombre d'avis à relever sur la fiche Google Business. */
  rating: { score: 4.9, count: 127 },
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=L%27As+du+2+Roues+212+rue+du+Ch%C3%A2teau+des+Rentiers+Paris",
  /** Métro / accès : à confirmer (Olympiades ? Porte d'Ivry ?). */
  access: "Métro Olympiades / Porte d'Ivry",
  // ----------------------------------------------------------------------

  /** Mardi au samedi, 10h – 19h (carte de visite). */
  hours: [
    { day: "Lundi", value: "Fermé", closed: true },
    { day: "Mardi", value: "10h00 – 19h00" },
    { day: "Mercredi", value: "10h00 – 19h00" },
    { day: "Jeudi", value: "10h00 – 19h00" },
    { day: "Vendredi", value: "10h00 – 19h00" },
    { day: "Samedi", value: "10h00 – 19h00" },
    { day: "Dimanche", value: "Fermé", closed: true },
  ],

  brands: [
    "Yamaha", "Honda", "Piaggio", "Peugeot", "Kymco",
    "SYM", "Suzuki", "Kawasaki", "Vespa", "BMW",
  ],
} as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  bullets: readonly string[];
  icon: string;
};

/** Prestations mécaniques. Achat / vente / reprise est traité à part. */
export const services: readonly Service[] = [
  {
    slug: "entretien-revision",
    title: "Entretien & révision",
    short: "Vidange, filtres, bougies, contrôle complet selon les préconisations constructeur.",
    bullets: ["Vidange moteur", "Filtres à air et à huile", "Bougies", "Contrôle 20 points"],
    icon: "oil",
  },
  {
    slug: "reparation",
    title: "Réparation mécanique",
    short: "Du petit dépannage à la remise en état moteur, sur devis validé avant intervention.",
    bullets: ["Moteur & cylindre", "Carburation & injection", "Suspension", "Carrosserie"],
    icon: "wrench",
  },
  {
    slug: "diagnostic",
    title: "Diagnostic",
    short: "Recherche de panne à la valise et à l'oreille, avant tout devis.",
    bullets: ["Lecture des codes défaut", "Test de compression", "Contrôle injection", "Rapport expliqué"],
    icon: "diag",
  },
  {
    slug: "depannage",
    title: "Dépannage",
    short: "Immobilisé dans Paris ? On intervient ou on récupère le véhicule.",
    bullets: ["Intervention sur place", "Enlèvement du véhicule", "Panne de démarrage", "Crevaison"],
    icon: "tow",
  },
  {
    slug: "pneumatiques",
    title: "Pneumatiques",
    short: "Montage, équilibrage et remplacement toutes tailles, moto comme scooter.",
    bullets: ["Montage & équilibrage", "Valve neuve", "Contrôle de pression", "Reprise de l'ancien pneu"],
    icon: "tire",
  },
  {
    slug: "freinage",
    title: "Freinage",
    short: "Plaquettes, disques, purge du circuit. La sécurité ne se négocie pas.",
    bullets: ["Plaquettes avant / arrière", "Disques", "Purge liquide de frein", "Contrôle des durites"],
    icon: "brake",
  },
  {
    slug: "transmission",
    title: "Transmission",
    short: "Kit chaîne, courroie, galets, variateur, embrayage.",
    bullets: ["Kit chaîne complet", "Courroie & galets", "Variateur", "Embrayage"],
    icon: "chain",
  },
  {
    slug: "electricite",
    title: "Électricité",
    short: "Batterie, démarreur, alternateur, faisceau, éclairage.",
    bullets: ["Batterie & charge", "Démarreur", "Faisceau électrique", "Éclairage & clignotants"],
    icon: "bolt",
  },
];

export const process = [
  {
    step: "01",
    title: "Vous décrivez votre besoin",
    body: "Par téléphone, en demande de devis ou en demande de rendez-vous. Marque, modèle, kilométrage, symptômes : plus c'est précis, plus notre réponse l'est.",
  },
  {
    step: "02",
    title: "On vous confirme un créneau",
    body: "Nous vous rappelons sous 24 h ouvrées pour caler un rendez-vous réaliste, en fonction de l'intervention et des pièces à prévoir.",
  },
  {
    step: "03",
    title: "Diagnostic et devis clair",
    body: "Nous examinons le véhicule et vous annonçons un prix avant toute intervention. Pas de travaux engagés sans votre accord.",
  },
  {
    step: "04",
    title: "Restitution et explications",
    body: "On vous montre les pièces remplacées, on vous explique ce qui est à surveiller, et quand revenir. Facture détaillée.",
  },
];

/** À CONFIRMER : le client doit valider chaque ligne ou refuser l'affichage des prix. */
export const pricing = [
  { label: "Vidange scooter 50 / 125 cm³", price: "dès 49 €" },
  { label: "Vidange moto (huile + filtre)", price: "dès 89 €" },
  { label: "Plaquettes de frein (un train)", price: "dès 59 €" },
  { label: "Pneu scooter monté & équilibré", price: "dès 79 €" },
  { label: "Kit chaîne complet", price: "dès 149 €" },
  { label: "Diagnostic électronique", price: "dès 39 €" },
];

/** À CONFIRMER : à remplacer par de vrais avis Google, avec l'accord du client. */
export const reviews = [
  {
    name: "Julien M.",
    body: "Diagnostic honnête, on m'a expliqué ce qui était urgent et ce qui pouvait attendre. Ça change des concessions.",
    context: "Yamaha XMAX 125",
  },
  {
    name: "Sarah B.",
    body: "Scooter récupéré le jour même pour un problème de démarrage. Prix annoncé = prix payé.",
    context: "Piaggio Liberty 125",
  },
  {
    name: "Karim T.",
    body: "Ils ont repris mon ancienne 125 et m'ont trouvé un modèle révisé dans mon budget. Deux affaires en une visite.",
    context: "Honda CB 125",
  },
];

export const faq = [
  {
    q: "Faut-il prendre rendez-vous ?",
    a: "C'est préférable. Une demande de rendez-vous en ligne ou un appel nous permet de préparer les pièces et de vous donner un créneau réaliste. Pour une urgence, appelez-nous directement.",
  },
  {
    q: "Mon créneau est-il confirmé immédiatement ?",
    a: "Non, et c'est volontaire. Vous nous indiquez vos disponibilités, nous vous confirmons le créneau sous 24 h ouvrées après avoir vérifié la charge de l'atelier et les pièces nécessaires. Nous préférons un rendez-vous tenu à un rendez-vous annulé.",
  },
  {
    q: "Travaillez-vous toutes les marques ?",
    a: "Oui, motos et scooters toutes marques, y compris les modèles que les concessions refusent souvent de prendre en charge.",
  },
  {
    q: "Un devis est-il payant ?",
    a: "Le devis est gratuit. Seul un diagnostic électronique approfondi peut être facturé, et il est toujours annoncé à l'avance.",
  },
  {
    q: "Reprenez-vous mon ancien deux-roues ?",
    a: "Oui. Nous rachetons et reprenons motos et scooters, roulants ou non. Envoyez-nous quelques photos et les informations du véhicule pour recevoir une estimation.",
  },
  {
    q: "Intervenez-vous en dépannage ?",
    a: "Oui, dans Paris et la proche banlieue. Appelez-nous : selon la panne, nous intervenons sur place ou nous récupérons le véhicule pour le ramener à l'atelier.",
  },
];

/**
 * Ligne d'activité distincte de la mécanique : achat, vente et reprise de
 * véhicules d'occasion. C'est ce que le réseau concurrent ne propose pas.
 */
export const trading = {
  title: "Achat · Vente · Reprise",
  lead:
    "Nous ne faisons pas que réparer : nous achetons, reprenons et revendons motos et scooters d'occasion, révisés par nos soins.",
  cards: [
    {
      title: "Vous vendez",
      body: "Rachat de votre moto ou scooter, roulant ou non. Estimation gratuite, paiement immédiat, démarches administratives prises en charge.",
      cta: "Faire estimer mon véhicule",
    },
    {
      title: "Vous reprenez",
      body: "Votre ancien deux-roues est déduit du prix de votre prochain véhicule. Une seule visite, une seule démarche.",
      cta: "Demander une reprise",
    },
    {
      title: "Vous achetez",
      body: "Occasions révisées dans notre atelier, avec l'historique d'entretien. Vous savez exactement ce que vous achetez.",
      cta: "Voir les véhicules disponibles",
    },
  ],
} as const;
