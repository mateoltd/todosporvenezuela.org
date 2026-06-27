export const siteName = "Todos por Venezuela";
export const siteUrlFallback = "https://todosporvenezuela.org";

export const pageTitle =
  "Todos por Venezuela | Dona ayuda urgente tras el terremoto";
export const pageDescription =
  "Dona para enviar insumos médicos, alimentos e hidratación a familias afectadas por el terremoto en Venezuela. Campaña coordinada por jóvenes venezolanos con reportes diarios.";
export const socialTitle = "Todos por Venezuela | Ayuda urgente tras el terremoto";
export const socialDescription =
  "Tu donación compra insumos médicos, alimentos e hidratación para familias afectadas en Venezuela.";

export const publishedDate = "2026-06-27";
export const modifiedDate = "2026-06-27";
export const locale = "es_VE";
export const language = "es-VE";

export const campaignKeywords = [
  "Todos por Venezuela",
  "donar Venezuela",
  "ayuda Venezuela",
  "terremoto Venezuela",
  "donaciones Venezuela",
  "insumos médicos Venezuela",
  "ayuda humanitaria Venezuela",
  "PayPal Venezuela",
  "Binance Pay Venezuela",
  "Pago Móvil"
];

export const socialImage = {
  path: "/images/todos-por-venezuela-social-card-v2.jpg",
  width: 1200,
  height: 630,
  alt: "Todos por Venezuela: ayuda urgente tras el terremoto. Dona insumos médicos, alimentos e hidratación."
};

export const organizationLogo = {
  path: "/images/tpv-emblem.png",
  width: 256,
  height: 256
};

export const organizers = [
  {
    name: "Valentina Muriel",
    image: "/images/organizers/valentina-muriel",
    accent: "var(--yellow)",
    instagram: "https://www.instagram.com/valentina.muriell/",
    tiktok: "https://www.tiktok.com/@memukkita"
  },
  {
    name: "Cristal Navas",
    image: "/images/organizers/cristal-navas",
    accent: "var(--blue)",
    instagram: "https://www.instagram.com/zahara_cristal/",
    tiktok: "https://www.tiktok.com/@zahara_cristal"
  },
  {
    name: "Abraham Barrios",
    image: "/images/organizers/abraham-barrios",
    accent: "var(--red)",
    instagram: "https://www.instagram.com/eyyabraham_/",
    tiktok: "https://www.tiktok.com/@eyy_abraham"
  },
  {
    name: "Marlon Amarista",
    image: "/images/organizers/marlon-amarista",
    accent: "var(--blue)",
    instagram: "https://www.instagram.com/marlonamaristaoficial/",
    tiktok: "https://www.tiktok.com/@marlonamarista_"
  }
];

export const churchAffiliations = [
  "Ministerio Internacional Agua Viva",
  "Iglesia Oasis Internacional",
  "Ministerio Internacional Centro de Esperanza",
  "Nueva Jerusalén Cuadrangular"
];

export const affiliationText = `${churchAffiliations.slice(0, -1).join(", ")} y ${
  churchAffiliations[churchAffiliations.length - 1]
}`;

export const faqs = [
  {
    question: "¿Qué se compra con mi donación?",
    answer:
      "Insumos médicos, alimentación, hidratación y apoyo básico para familias afectadas por el terremoto en Venezuela, incluyendo comunidades con acceso limitado a ayuda inmediata."
  },
  {
    question: "¿Quiénes están detrás de la campaña?",
    answer:
      "La campaña la coordinan jóvenes cristianos venezolanos que viven en el país y están respondiendo a necesidades que ven de cerca. Valentina Muriel, Cristal Navas, Abraham Barrios y Marlon Amarista organizan las compras, entregas y reportes.",
    link: {
      href: "https://www.instagram.com/p/DaD7tL_vjyc/",
      label: "Ver el video de presentación del proyecto"
    }
  },
  {
    question: "¿Cómo sé que es confiable?",
    answer:
      "Los organizadores son miembros reconocidos de sus comunidades y tienen responsabilidades en ministerios e iglesias locales. Publicarán reportes diarios para mostrar el avance de la recaudación, las compras y las entregas realizadas."
  },
  {
    question: "¿Cómo dono desde el exterior?",
    answer:
      "Si estás fuera de Venezuela, puedes donar con PayPal usando tarjeta o cuenta PayPal, o enviar USDT por Binance Pay desde cualquier país donde tengas acceso a esos servicios."
  },
  {
    question: "¿Cómo dono desde Venezuela?",
    answer:
      "Si estás en Venezuela, puedes aportar con Pago Móvil en bolívares. También puedes usar Binance Pay si prefieres donar en USDT."
  },
  {
    question: "¿Publicarán reportes?",
    answer:
      "Sí. Publicaremos reportes transparentes todos los días con el avance de la recaudación, el uso de los fondos y las entregas realizadas conforme avance la respuesta."
  },
  {
    question: "¿Y si no puedo donar dinero?",
    answer:
      "También puedes ayudar compartiendo la campaña, enviándola a más personas y orando por las familias afectadas. Cada gesto ayuda a que la ayuda llegue más lejos."
  },
  {
    question: "¿Cómo confirmo Binance Pay o Pago Móvil?",
    answer:
      "Conserva tu comprobante y pulsa Ya hice mi pago en el modal para cerrar el flujo de confirmación. Si el equipo necesita validar algún dato, usará la información del comprobante."
  },
  {
    question: "¿Hay un monto mínimo?",
    answer:
      "Puedes elegir uno de los montos sugeridos o escribir otro monto desde 1 dólar. Cada aporte suma para cubrir necesidades urgentes."
  }
];
