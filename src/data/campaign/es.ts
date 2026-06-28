import type { CampaignContent } from "./types";
import {
  joinSpanishList,
  organizationLogo,
  sharedChurchAffiliations,
  sharedOrganizers,
  sharedSocialImage,
} from "./shared";

export const esContent: CampaignContent = {
    siteName: "Todos por Venezuela",
    language: "es-VE",
    locale: "es_VE",
    pageTitle: "Todos por Venezuela | Dona ayuda urgente tras el terremoto",
    pageDescription:
      "Dona para enviar insumos médicos, alimentos e hidratación a familias afectadas por el terremoto en Venezuela. Campaña coordinada por jóvenes venezolanos con reportes diarios.",
    socialTitle: "Todos por Venezuela | Ayuda urgente tras el terremoto",
    socialDescription:
      "Tu donación compra insumos médicos, alimentos e hidratación para familias afectadas en Venezuela.",
    campaignKeywords: [
      "Todos por Venezuela",
      "donar Venezuela",
      "ayuda Venezuela",
      "terremoto Venezuela",
      "donaciones Venezuela",
      "insumos médicos Venezuela",
      "ayuda humanitaria Venezuela",
      "PayPal Venezuela",
      "Binance Pay Venezuela",
      "Pago Móvil",
    ],
    socialImage: {
      ...sharedSocialImage,
      alt: "Todos por Venezuela: ayuda urgente tras el terremoto. Dona insumos médicos, alimentos e hidratación.",
    },
    organizationLogo,
    organizers: sharedOrganizers,
    churchAffiliations: sharedChurchAffiliations,
    header: {
      brandAriaLabel: "Todos por Venezuela",
      brandText: {
        line1: "Todos por",
        line2: "Venezuela",
      },
      menuOpenLabel: "Abrir menú de navegación",
      menuCloseLabel: "Cerrar menú de navegación",
      navLabel: "Navegación principal",
      nav: {
        impact: "Devastación",
        organizers: "Organizadores",
        transparency: "Transparencia",
        faq: "FAQ",
      },
      donateAriaLabel: "Donar ahora",
      donateCompact: "Donar",
      languageSwitchLabel: "Cambiar idioma",
    },
    hero: {
      eyebrow: "Emergencia por terremoto",
      titlePrefix: "Todos por",
      titleStrong: "Venezuela",
      lede: "Ayuda para las zonas afectadas",
      copy:
        "Jóvenes venezolanos llevan insumos médicos, alimentos e hidratación a las familias golpeadas por el terremoto, hasta en las comunidades más remotas.",
      videoCta: "Ver video de los organizadores",
      donateCta: "Donar ahora",
      paymentNote: "Donación rápida y segura con",
      videoModalEyebrow: "Organizadores",
      videoModalTitle: "Por qué nace esta campaña",
      videoCloseLabel: "Cerrar video",
      videoSourceLabel: "Abrir video original",
    },
    progress: {
      raisedLabel: "Recaudado",
      percentLabel: "De la meta",
      goalLabel: "Meta",
      ariaTemplate: "{raised} recaudados de {goal}, {percent}% de la meta",
    },
    devastation: {
      eyebrow: "Lo que está pasando",
      titlePrefix: "El país",
      titleStrong: "bajo escombros",
      lede:
        "Estas son imágenes de prensa de los días posteriores al terremoto. Detrás de cada escombro hay comunidades enteras que hoy necesitan agua, medicinas y un lugar donde dormir.",
      facts: {
        magnitude: "Magnitud",
        depth: "Profundidad",
        date: "24 jun",
        epicenter: "Epicentro",
        source: "Datos: USGS",
      },
      controlsLabel: "Controles del registro visual",
      previousLabel: "Ver imagen anterior",
      nextLabel: "Ver imagen siguiente",
      progressLabel: "Seleccionar imagen",
      dotLabel: "Ver imagen {index}: {title}",
    },
    organizersSection: {
      eyebrow: "Coordinación local",
      titlePrefix: "Equipo",
      titleStrong: "humano",
      bodyPrefix:
        "Cuatro voluntarios coordinan compras, entregas y reportes desde Venezuela. Forman parte de",
      affiliationText: joinSpanishList(sharedChurchAffiliations),
      callout:
        "Trabajamos en conjunto para convertir cada donación en ayuda verificable para familias afectadas.",
      photoAlt: "Foto de perfil de {name}",
      instagramLabel: "Instagram de {name}",
      tiktokLabel: "TikTok de {name}",
      socialsLabel: "Redes sociales de {name}",
    },
    faqSection: {
      eyebrow: "Dona con confianza",
      titlePrefix: "Preguntas",
      titleStrong: "frecuentes",
      donateCta: "Donar ahora",
    },
    transparency: {
      title: "Transparencia | Todos por Venezuela",
      description:
        "Reportes de la campaña Todos por Venezuela: recaudación, compras y entregas. Aún no hay reportes publicados; aparecerán aquí en cuanto comience la respuesta.",
      eyebrow: "Reporte diario",
      heading: "Transparencia",
      lede:
        "Publicamos el trabajo de cada día: lo que recibimos, lo que compramos y lo que entregamos.",
      dayLabel: "Día {day}",
      emptyTitle: "Aún no hay reportes",
      emptyText:
        "El primer reporte se publicará en cuanto comience la actividad. A partir de ahí, uno nuevo cada día.",
      fieldsLabel: "Qué incluye cada reporte",
      fields: [
        {
          icon: "tabler:cash",
          label: "Lo recibido",
          body: "Cuánto entró ese día y por qué medio.",
        },
        {
          icon: "tabler:receipt",
          label: "Lo comprado",
          body: "Cada compra del día.",
        },
        {
          icon: "tabler:truck-delivery",
          label: "Lo entregado",
          body: "Qué llegó a quién.",
        },
      ],
      closing:
        "Mientras tanto, conoce a quiénes están detrás y cómo funciona la campaña.",
      faqLink: "Preguntas frecuentes",
      homeLink: "Volver al inicio",
    },
    notFound: {
      title: "Página no encontrada | Todos por Venezuela",
      description:
        "No encontramos esta página. Vuelve al inicio para seguir la campaña Todos por Venezuela.",
      eyebrow: "Error 404",
      heading: "Esta página no existe",
      copy:
        "El enlace puede estar roto o la página se movió. Vuelve al inicio para seguir la campaña y ver cómo avanza la ayuda.",
      homeLink: "Volver al inicio",
      usefulPagesLabel: "Páginas útiles",
      transparencyLink: "Transparencia",
      faqLink: "Preguntas frecuentes",
    },
    footer: {
      ariaLabel: "Créditos del sitio",
      madeWithLove: "Hecho con amor el 26 de junio de 2026.",
      costNote:
        "Los costos de esta página fueron cubiertos por Mateo, su diseñador, como aporte completamente voluntario al proyecto.",
    },
    donationModal: {
      backLabel: "Volver",
      closeLabel: "Cerrar",
      amountEyebrow: "Haz tu aporte",
      amountTitle: "¿Cuánto quieres aportar?",
      amountLead:
        "Tu aporte ayuda a comprar insumos médicos, alimentación e hidratación para personas necesitadas, incluso en zonas remotas.",
      amountGroupLabel: "Elige un monto",
      popularAmountLabel: "Más elegido",
      customAmountLabel: "Otro monto en dólares",
      customAmountPlaceholder: "Escribe un monto entero",
      continueLabel: "Continuar",
      amountChipLabel: "Tu aporte",
      methodEyebrow: "Método de pago",
      methodTitle: "¿Cómo quieres pagar?",
      methodLead: "Elige el método que te quede más fácil.",
      internationalGroupLabel: "Desde cualquier país",
      localGroupLabel: "Pago local",
      countryName: "Venezuela",
      doneEyebrow: "Aporte enviado",
      doneTitle: "¡Gracias por tu aporte!",
      doneLead:
        "Tu aporte suma en un momento difícil para Venezuela. Publicaremos reportes transparentes todos los días.",
      doneCloseLabel: "Cerrar",
      paypalItemName:
        "Ayuda para insumos médicos, alimentación e hidratación en Venezuela.",
      amounts: [
        { value: 5, note: "Hidratación para quien lo necesita" },
        { value: 10, note: "Alimentación básica", popular: true },
        { value: 20, note: "Insumos médicos y primeros auxilios" },
        { value: 35, note: "Apoyo para zonas remotas" },
      ],
      methods: {
        paypal: {
          name: "Tarjeta o PayPal",
          desc: "Paga con tarjeta o con tu cuenta PayPal.",
          lead:
            "Te llevamos a la ventana segura de PayPal. Puedes pagar con tu tarjeta de crédito o débito, o con tu cuenta PayPal si ya tienes una.",
          steps: [
            "Toca el botón para abrir la ventana segura de PayPal.",
            "Elige pagar con tarjeta o inicia sesión en PayPal.",
            "Confirma el monto y completa el pago.",
          ],
          actionLabel: "Ir a PayPal",
        },
        binance: {
          name: "Binance Pay",
          desc: "{coin}, sin comisiones bancarias",
          lead:
            "Envía tu aporte en {coin} por Binance Pay. Es una opción directa para donar desde Venezuela o desde el exterior.",
          fields: {
            binancePayId: "Binance Pay ID",
            coin: "Moneda",
            bank: "Banco",
            phone: "Teléfono",
            document: "Cédula o RIF",
            holder: "Titular",
            contact: "Contacto",
          },
          steps: [
            "Abre Binance y entra a la sección Pay.",
            "Toca Enviar y pega el Pay ID.",
            "Envía el monto en {coin} y conserva tu comprobante.",
          ],
          actionLabel: "Ya hice mi pago",
        },
        pagoMovil: {
          name: "Pago Móvil",
          desc: "Transferencia en bolívares",
          lead:
            "Aporta en bolívares desde la app de tu banco. Es la opción local para quienes están en Venezuela.",
          fields: {
            binancePayId: "Binance Pay ID",
            coin: "Moneda",
            bank: "Banco",
            phone: "Teléfono",
            document: "Cédula o RIF",
            holder: "Titular",
            contact: "Contacto",
          },
          steps: [
            "Abre la app de tu banco y entra a Pago Móvil.",
            "Ingresa el banco, teléfono y Cédula/RIF de arriba.",
            "Envía el monto equivalente en bolívares y conserva tu comprobante.",
          ],
          contactStep:
            "Usa el contacto si necesitas consultar o confirmar el pago.",
          actionLabel: "Ya hice mi pago",
        },
      },
      methodItem: {
        vesAmountLabel: "Monto en bolívares",
        copyVesAmountLabel: "Copiar monto en bolívares",
        calculatingLabel: "Calculando...",
        queryingRateLabel: "Consultando tasa oficial",
        copyFieldLabel: "Copiar {field}",
        pendingLabel: "Disponible muy pronto",
      },
      client: {
        minAmount: "Escribe un monto de al menos $1.",
        integerAmount: "Usa un monto entero en dólares, sin centavos.",
        chooseAmount: "Elige un monto o escribe un monto entero.",
        calculating: "Calculando...",
        queryingRate: "Consultando tasa oficial",
        unavailable: "No disponible",
        rateUnavailable: "Tasa oficial no disponible ahora",
        officialRatePrefix: "Tasa oficial:",
        rateUnit: "por $1",
        rateDatePrefix: "Fecha:",
        copied: "Copiado",
      },
    },
    structuredData: {
      knowsAbout: [
        "ayuda humanitaria",
        "donaciones para Venezuela",
        "insumos médicos",
        "respuesta a emergencias",
      ],
      donateActionName: "Donar a Todos por Venezuela",
      donateObjectName:
        "Insumos médicos, alimentos e hidratación para familias afectadas por el terremoto",
      faqPageName: "Preguntas frecuentes sobre Todos por Venezuela",
    },
  };
