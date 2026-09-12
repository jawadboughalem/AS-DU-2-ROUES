/**
 * Contenu des prestations, une page dédiée par entrée.
 *
 * Ces pages sont le moteur du référencement local : elles répondent aux
 * recherches précises (« changement plaquettes scooter Paris 13 ») que la page
 * d'accueil ne peut pas capter.
 *
 * Les textes sont des propositions à faire valider par l'atelier — en
 * particulier les tarifs et les délais.
 */

export type Service = {
  slug: string;
  title: string;
  /** Titre de la page et libellé du fil d'Ariane. */
  pageTitle: string;
  metaDescription: string;
  /** Phrase d'accroche, en haut de la page dédiée. */
  intro: string;
  /** Résumé court, utilisé sur la page d'accueil. */
  short: string;
  /** Ce que comprend l'intervention. */
  bullets: readonly string[];
  /** Signes qui doivent alerter le client. */
  signs: readonly string[];
  /** Tarif indicatif, à valider par l'atelier. */
  price?: string;
  /** Durée habituelle, à valider par l'atelier. */
  duration?: string;
  icon: string;
};

export const services: readonly Service[] = [
  {
    slug: "entretien-revision",
    title: "Entretien & révision",
    pageTitle: "Entretien et révision moto & scooter à Paris 13",
    metaDescription:
      "Révision et entretien moto et scooter à Paris 13 : vidange, filtres, bougies, contrôle complet. Toutes marques, devis gratuit. Ouvert le samedi.",
    intro:
      "L'entretien régulier coûte toujours moins cher que la panne qu'il évite. Nous suivons les préconisations du constructeur, et nous vous disons ce qui peut encore attendre.",
    short:
      "Vidange, filtres, bougies, contrôle complet selon les préconisations constructeur.",
    bullets: [
      "Vidange moteur et remplacement du joint",
      "Filtre à huile et filtre à air",
      "Bougies d'allumage",
      "Contrôle des niveaux et des jeux",
      "Contrôle de l'usure : pneus, plaquettes, transmission",
      "Remise à zéro du témoin d'entretien",
    ],
    signs: [
      "Vous avez dépassé l'intervalle de révision indiqué au carnet",
      "Le témoin d'entretien est allumé",
      "Le moteur démarre moins bien à froid",
      "Vous ne savez pas quand la dernière vidange a été faite",
    ],
    price: "dès 49 € (scooter) / 89 € (moto)",
    duration: "Dans la journée",
    icon: "oil",
  },
  {
    slug: "reparation",
    title: "Réparation mécanique",
    pageTitle: "Réparation moto et scooter à Paris 13",
    metaDescription:
      "Réparation mécanique moto et scooter à Paris 13 : moteur, injection, suspension, carrosserie. Devis gratuit avant toute intervention.",
    intro:
      "Du petit dépannage à la remise en état moteur. Nous établissons toujours un devis avant d'intervenir : vous savez ce que vous payez, et pourquoi.",
    short:
      "Du petit dépannage à la remise en état moteur, sur devis validé avant intervention.",
    bullets: [
      "Moteur, cylindre, segmentation",
      "Carburation et système d'injection",
      "Suspensions, amortisseurs, fourche",
      "Carrosserie et carénages",
      "Remplacement de pièces d'usure",
      "Remise en route après immobilisation prolongée",
    ],
    signs: [
      "Un bruit anormal apparaît au moteur ou à l'accélération",
      "Une perte de puissance ou de reprise",
      "Une fuite sous le véhicule",
      "Le deux-roues est resté immobilisé plusieurs mois",
    ],
    duration: "Selon diagnostic et disponibilité des pièces",
    icon: "wrench",
  },
  {
    slug: "diagnostic",
    title: "Diagnostic",
    pageTitle: "Diagnostic moto et scooter à Paris 13",
    metaDescription:
      "Diagnostic électronique et mécanique moto et scooter à Paris 13. Lecture des codes défaut, test de compression, rapport expliqué.",
    intro:
      "Avant de remplacer une pièce, encore faut-il être sûr que c'est la bonne. Nous cherchons la panne à la valise et à l'oreille, et nous vous expliquons ce que nous trouvons.",
    short: "Recherche de panne à la valise et à l'oreille, avant tout devis.",
    bullets: [
      "Lecture et effacement des codes défaut",
      "Test de compression moteur",
      "Contrôle du système d'injection",
      "Contrôle du circuit de charge",
      "Rapport expliqué, sans jargon",
    ],
    signs: [
      "Un voyant moteur reste allumé",
      "Le véhicule cale ou refuse de démarrer sans raison apparente",
      "La consommation a nettement augmenté",
      "Un autre garage n'a pas trouvé l'origine du problème",
    ],
    price: "dès 39 €",
    duration: "1 à 2 heures",
    icon: "diag",
  },
  {
    slug: "depannage",
    title: "Dépannage",
    pageTitle: "Dépannage moto et scooter à Paris",
    metaDescription:
      "Dépannage moto et scooter à Paris et proche banlieue : panne de démarrage, crevaison, enlèvement du véhicule. Appelez l'atelier.",
    intro:
      "Immobilisé dans Paris ? Appelez-nous. Selon la panne, nous intervenons sur place ou nous récupérons le véhicule pour le ramener à l'atelier.",
    short: "Immobilisé dans Paris ? On intervient ou on récupère le véhicule.",
    bullets: [
      "Intervention sur place quand c'est possible",
      "Enlèvement et rapatriement à l'atelier",
      "Panne de démarrage et batterie",
      "Crevaison",
      "Panne d'essence ou d'allumage",
    ],
    signs: [
      "Le véhicule ne démarre plus et vous ne pouvez pas le déplacer",
      "Une crevaison vous immobilise",
      "Une panne survient loin de chez vous",
    ],
    duration: "Selon localisation — appelez-nous",
    icon: "tow",
  },
  {
    slug: "pneumatiques",
    title: "Pneumatiques",
    pageTitle: "Changement de pneus moto et scooter à Paris 13",
    metaDescription:
      "Montage et équilibrage de pneus moto et scooter à Paris 13. Toutes tailles, valve neuve, reprise de l'ancien pneu. Ouvert le samedi.",
    intro:
      "Le pneu est la seule pièce qui touche la route. Nous montons, équilibrons et contrôlons, toutes tailles, moto comme scooter.",
    short:
      "Montage, équilibrage et remplacement toutes tailles, moto comme scooter.",
    bullets: [
      "Montage et équilibrage",
      "Valve neuve systématique",
      "Contrôle de la pression et du parallélisme",
      "Reprise et recyclage de l'ancien pneu",
      "Conseil sur le type de gomme selon votre usage",
    ],
    signs: [
      "Les témoins d'usure affleurent la bande de roulement",
      "Le pneu a plus de cinq ans, même peu roulé",
      "Vous constatez des craquelures sur les flancs",
      "Le véhicule tire d'un côté ou vibre",
    ],
    price: "dès 79 € monté et équilibré",
    duration: "Moins d'une heure",
    icon: "tire",
  },
  {
    slug: "freinage",
    title: "Freinage",
    pageTitle: "Freinage moto et scooter à Paris 13",
    metaDescription:
      "Plaquettes, disques et purge du circuit de frein, moto et scooter, à Paris 13. Contrôle gratuit, devis avant intervention.",
    intro:
      "C'est la prestation sur laquelle nous ne transigeons jamais. Si vos freins sont limites, nous vous le disons — et si ça peut attendre, nous vous le disons aussi.",
    short: "Plaquettes, disques, purge du circuit. La sécurité ne se négocie pas.",
    bullets: [
      "Plaquettes avant et arrière",
      "Disques et contrôle du voilage",
      "Purge et remplacement du liquide de frein",
      "Contrôle des durites et des étriers",
      "Réglage du frein arrière à tambour",
    ],
    signs: [
      "Le levier ou la pédale part trop loin",
      "Un grincement ou un couinement au freinage",
      "La distance de freinage a augmenté",
      "Le liquide de frein est foncé ou date de plus de deux ans",
    ],
    price: "dès 59 € le train de plaquettes",
    duration: "Dans la journée",
    icon: "brake",
  },
  {
    slug: "transmission",
    title: "Transmission",
    pageTitle: "Transmission moto et scooter à Paris 13",
    metaDescription:
      "Kit chaîne, courroie, galets, variateur et embrayage, moto et scooter, à Paris 13. Devis gratuit, toutes marques.",
    intro:
      "Chaîne sur une moto, courroie et variateur sur un scooter : c'est ce qui transmet la puissance à la roue, et c'est ce qui s'use le plus vite en ville.",
    short: "Kit chaîne, courroie, galets, variateur, embrayage.",
    bullets: [
      "Kit chaîne complet : chaîne, couronne, pignon",
      "Courroie de transmission et galets",
      "Variateur et embrayage centrifuge",
      "Réglage et graissage de chaîne",
      "Contrôle du jeu et de l'alignement",
    ],
    signs: [
      "Des à-coups à l'accélération",
      "Une chaîne qui claque ou qui saute",
      "Une perte de reprise sur un scooter",
      "Un bruit de sifflement au démarrage",
    ],
    price: "dès 149 € le kit chaîne complet",
    duration: "Dans la journée",
    icon: "chain",
  },
  {
    slug: "electricite",
    title: "Électricité",
    pageTitle: "Électricité moto et scooter à Paris 13",
    metaDescription:
      "Batterie, démarreur, alternateur, faisceau et éclairage, moto et scooter, à Paris 13. Diagnostic électrique, devis gratuit.",
    intro:
      "Une panne électrique laisse rarement repartir. Batterie, démarreur, faisceau : nous remontons le circuit jusqu'à la cause, pas jusqu'au symptôme.",
    short: "Batterie, démarreur, alternateur, faisceau, éclairage.",
    bullets: [
      "Batterie : test, charge, remplacement",
      "Démarreur et relais",
      "Alternateur et circuit de charge",
      "Faisceau électrique et connectique",
      "Éclairage, clignotants, avertisseur",
    ],
    signs: [
      "Le démarreur peine ou ne répond plus",
      "La batterie se décharge en quelques jours",
      "Les phares faiblissent au ralenti",
      "Un clignotant ou un feu ne fonctionne plus",
    ],
    duration: "Selon diagnostic",
    icon: "bolt",
  },
];

export function findService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
