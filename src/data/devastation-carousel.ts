// Fotos de prensa verificadas via NPR.
const nprDayOf =
    "https://www.npr.org/2026/06/24/nx-s1-5869817/2-major-earthquakes-strike-northern-venezuela-near-caracas";
const nprDeathToll =
    "https://www.npr.org/2026/06/26/nx-s1-5870651/venezuela-earthquakes-caracas";

export const devastationSlides = [
    {
        image: "venezuela-earthquake-2026-caracas-rescue-search",
        widths: [720, 1080, 1440, 1800],
        alt: "Rescatistas y policías buscan sobrevivientes sobre los escombros de un edificio colapsado en Caracas.",
        width: 2000,
        height: 1333,
        place: "Caracas",
        title: "La búsqueda entre las ruinas",
        caption:
            "Rescatistas y vecinos buscan sobrevivientes en un edificio que se vino abajo.",
        credit: "Juan Barreto / AFP vía Getty Images",
        creditUrl: nprDayOf,
    },
    {
        image: "venezuela-earthquake-2026-laguaira-neighbors-rescue",
        widths: [720, 1080, 1440, 1800],
        alt: "Un grupo de vecinos carga en brazos a un hombre rescatado de los escombros de un edificio en La Guaira.",
        width: 2000,
        height: 1333,
        place: "La Guaira",
        title: "Sacado con vida de los escombros",
        caption:
            "Los vecinos cargan a un hombre rescatado del derrumbe, un día después del terremoto.",
        credit: "Pedro Mattey / AP",
        creditUrl: nprDeathToll,
    },
    {
        image: "venezuela-earthquake-2026-catia-la-mar-rubble",
        widths: [720, 1080, 1440, 1800],
        alt: "Una mujer camina entre los escombros de un edificio dañado, con la mano en la cabeza.",
        width: 2000,
        height: 1333,
        place: "Catia La Mar",
        title: "Volver a lo que ya no está",
        caption:
            "Residentes caminan entre los restos de un edificio dañado por el sismo.",
        credit: "Pedro Mattey / AP",
        creditUrl: nprDeathToll,
    },
    {
        image: "venezuela-earthquake-2026-los-palos-grandes-tower",
        widths: [720, 1080, 1440, 1800],
        alt: "Un edificio residencial de Los Palos Grandes quedó parcialmente colapsado tras el terremoto en Caracas.",
        width: 2000,
        height: 1333,
        place: "Los Palos Grandes, Caracas",
        title: "Torres partidas por el sismo",
        caption:
            "Un edificio residencial quedó severamente dañado tras el primer terremoto de magnitud 7,2.",
        credit: "Jesús Vargas / Getty Images",
        creditUrl: nprDayOf,
    },
    {
        image: "venezuela-earthquake-2026-caracas-evacuees",
        widths: [720, 1080, 1440, 1800],
        alt: "Familias evacuadas esperan en la acera, una mujer habla por teléfono junto a sus hijos.",
        width: 2000,
        height: 1333,
        place: "Caracas",
        title: "Familias a la espera",
        caption:
            "Personas evacuadas aguardan a la intemperie, sin saber cuándo podrán volver a casa.",
        credit: "Jesús Vargas / Getty Images",
        creditUrl: nprDeathToll,
    },
] as const;

export type DevastationSlide = (typeof devastationSlides)[number];
export type DevastationImageFormat = "avif" | "webp" | "jpg";

export const devastationImageSizes = "100vw";
export const devastationFallbackImageWidth = 720;

export const devastationImageSrc = (
    name: string,
    width: number,
    format: DevastationImageFormat,
) => `/images/optimized/${name}-${width}.${format}`;

export const devastationFallbackImageSrc = (name: string) =>
    devastationImageSrc(name, devastationFallbackImageWidth, "jpg");

export const devastationImageSrcSet = (
    slide: DevastationSlide,
    format: DevastationImageFormat,
) =>
    slide.widths
        .map((width) => `${devastationImageSrc(slide.image, width, format)} ${width}w`)
        .join(", ");
