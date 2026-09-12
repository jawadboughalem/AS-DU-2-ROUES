/**
 * SOURCE UNIQUE DE VÉRITÉ pour toutes les informations de l'atelier.
 *
 * Tout ce qui est marqué "À CONFIRMER" doit être validé par le client avant
 * la mise en production. Ce fichier sert aussi de check-list des informations
 * à récupérer lors du rendez-vous de cadrage.
 */

export const site = {
  /** Passe à false avant la mise en production : masque le bandeau "maquette". */
  isDraft: true,

  name: "L'As du 2 Roues",
  tagline: "Atelier moto & scooter à Paris",

  // --- À CONFIRMER auprès du client -------------------------------------
  phone: "01 00 00 00 00",
  phoneHref: "tel:+33100000000",
  email: "contact@asdu2roues.fr",
  address: {
    street: "00 rue à confirmer",
    zip: "750XX",
    city: "Paris",
    country: "FR",
  },
  /** Lien "Itinéraire" Google Maps — à remplacer par celui de la fiche réelle. */
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=L%27As+du+2+Roues+Paris",
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=L%27As+du+2+Roues+Paris",
  rating: { score: 4.9, count: 127 },
  // ----------------------------------------------------------------------

  hours: [
    { day: "Lundi", value: "9h00 – 19h00" },
    { day: "Mardi", value: "9h00 – 19h00" },
    { day: "Mercredi", value: "9h00 – 19h00" },
    { day: "Jeudi", value: "9h00 – 19h00" },
    { day: "Vendredi", value: "9h00 – 19h00" },
    { day: "Samedi", value: "9h00 – 17h00" },
    { day: "Dimanche", value: "Fermé", closed: true },
  ],

  brands: [
    "Yamaha", "Honda", "Piaggio", "Peugeot", "Kymco",
    "SYM", "BMW", "Suzuki", "Kawasaki", "Vespa",
  ],
} as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  bullets: readonly string[];
  icon: string;
};

export const services: readonly Service[] = [
  {
    slug: "revision-entretien",
    title: "Révision & entretien",
    short: "Vidange, filtres, bougies, contrôle complet selon les préconisations constructeur.",
    bullets: ["Vidange moteur", "Filtres à air et à huile", "Bougies", "Contrôle 20 points"],
    icon: "oil",
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
    slug: "diagnostic",
    title: "Diagnostic",
    short: "Recherche de panne à la valise et à l'oreille, avant tout devis.",
    bullets: ["Lecture des codes défaut", "Test de compression", "Contrôle injection", "Rapport expliqué"],
    icon: "diag",
  },
  {
    slug: "electricite",
    title: "Électricité",
    short: "Batterie, démarreur, alternateur, faisceau, éclairage.",
    bullets: ["Batterie & charge", "Démarreur", "Faisceau électrique", "Éclairage & clignotants"],
    icon: "bolt",
  },
  {
    slug: "transmission",
    title: "Transmission",
    short: "Kit chaîne, courroie, galets, variateur, embrayage.",
    bullets: ["Kit chaîne complet", "Courroie & galets", "Variateur", "Embrayage"],
    icon: "chain",
  },
];

export const process = [
  {
    step: "01",
    title: "Vous nous décrivez le problème",
    body: "Par téléphone ou via le formulaire de devis. Marque, modèle, kilométrage, symptômes : plus c'est précis, plus notre réponse l'est.",
  },
  {
    step: "02",
    title: "Diagnostic et devis clair",
    body: "Nous examinons le véhicule et vous annonçons un prix avant toute intervention. Pas de travaux engagés sans votre accord.",
  },
  {
    step: "03",
    title: "Intervention à l'atelier",
    body: "Pièces d'origine ou équivalentes, traçabilité conservée. On vous montre les pièces remplacées.",
  },
  {
    step: "04",
    title: "Restitution et explications",
    body: "On vous explique ce qui a été fait, ce qui est à surveiller, et quand revenir. Facture détaillée.",
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
    body: "Ils ont accepté ma vieille 125 que personne ne voulait toucher. Travail soigné, je ne vais plus ailleurs.",
    context: "Honda CB 125",
  },
];

export const faq = [
  {
    q: "Faut-il prendre rendez-vous ?",
    a: "C'est préférable. Un appel ou une demande de devis en ligne nous permet de préparer les pièces et de vous donner un créneau réaliste. Pour une urgence, appelez-nous directement.",
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
    q: "Utilisez-vous des pièces d'origine ?",
    a: "Nous utilisons des pièces d'origine ou de qualité équivalente. Vous choisissez : nous vous présentons les options et les écarts de prix.",
  },
  {
    q: "Combien de temps dure une intervention ?",
    a: "Un entretien courant se fait dans la journée. Pour une réparation nécessitant une commande de pièce, nous vous annonçons un délai au moment du devis.",
  },
  {
    q: "Puis-je laisser mon véhicule et le récupérer plus tard ?",
    a: "Oui, dans la limite de la place disponible à l'atelier. Prévenez-nous au moment de la prise de rendez-vous.",
  },
];
