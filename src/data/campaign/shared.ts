import type { CampaignOrganizer } from "./types";

export const sharedOrganizers: CampaignOrganizer[] = [
  {
    name: "Valentina Muriel",
    image: "/images/organizers/valentina-muriel",
    accent: "var(--yellow)",
    instagram: "https://www.instagram.com/valentina.muriell/",
    tiktok: "https://www.tiktok.com/@memukkita",
  },
  {
    name: "Cristal Navas",
    image: "/images/organizers/cristal-navas",
    accent: "var(--blue)",
    instagram: "https://www.instagram.com/zahara_cristal/",
    tiktok: "https://www.tiktok.com/@zahara_cristal",
  },
  {
    name: "Abraham Barrios",
    image: "/images/organizers/abraham-barrios",
    accent: "var(--red)",
    instagram: "https://www.instagram.com/eyyabraham_/",
    tiktok: "https://www.tiktok.com/@eyy_abraham",
  },
  {
    name: "Marlon Amarista",
    image: "/images/organizers/marlon-amarista",
    accent: "var(--blue)",
    instagram: "https://www.instagram.com/marlonamaristaoficial/",
    tiktok: "https://www.tiktok.com/@marlonamarista_",
  },
];

export const sharedChurchAffiliations = [
  "Ministerio Internacional Agua Viva",
  "Iglesia Oasis Internacional",
  "Ministerio Internacional Centro de Esperanza",
  "Nueva Jerusalén Cuadrangular",
];

export const joinSpanishList = (items: string[]) =>
  `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;

export const joinEnglishList = (items: string[]) =>
  `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;

export const sharedSocialImage = {
  path: "/images/todos-por-venezuela-social-card-v2.jpg",
  width: 1200,
  height: 630,
};

export const organizationLogo = {
  path: "/images/tpv-emblem.png",
  width: 256,
  height: 256,
};


export const fillCoin = (value: string, coin: string) =>
  value.replaceAll("{coin}", coin);
