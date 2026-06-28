import { defaultLocale, type SupportedLocale } from "../../i18n/config";
import type { CampaignFaq } from "./types";

export const buildFaqs = (
  binanceCoin = "USDT",
  locale: SupportedLocale = defaultLocale,
): CampaignFaq[] => {
  const coin = binanceCoin.trim().toUpperCase() || "USDT";

  if (locale === "en") {
    return [
      {
        question: "What does my donation buy?",
        answer:
          "Medical supplies, food, hydration, and basic support for families affected by the earthquake in Venezuela, including communities with limited access to immediate help.",
      },
      {
        question: "Who is behind the campaign?",
        answer:
          "The campaign is coordinated by young Venezuelan Christians who live in the country and are responding to needs they see up close. Valentina Muriel, Cristal Navas, Abraham Barrios, and Marlon Amarista organize the purchases, deliveries, and reports.",
        link: {
          href: "https://www.instagram.com/p/DaD7tL_vjyc/",
          label: "Watch the project introduction video",
        },
      },
      {
        question: "How do I know this is trustworthy?",
        answer:
          "The organizers are recognized members of their communities and have responsibilities in local ministries and churches. They will publish daily reports showing fundraising progress, purchases, and deliveries. The people helping build this campaign have also contributed: this is not just a page asking for help, but a shared effort to respond with action.",
      },
      {
        question: "How can I donate from outside Venezuela?",
        answer: `If you are outside Venezuela, you can donate through PayPal using a card or PayPal account, or send ${coin} through Binance Pay from any country where you can access those services.`,
      },
      {
        question: "Can I pay with a debit or credit card?",
        answer:
          "Yes. You can pay with a debit or credit card through PayPal, depending on availability in your country. We are also evaluating other providers to enable more payment options without funds being held as long as they can be with Stripe.",
      },
      {
        question: "How can I donate from Venezuela?",
        answer: `If you are in Venezuela, you can contribute in bolivares through Pago Movil. You can also use Binance Pay if you prefer to donate in ${coin}.`,
      },
      {
        question: "Will you publish reports?",
        answer:
          "Yes. We will publish transparent daily reports with fundraising progress, how funds are used, and the deliveries completed as the response moves forward.",
      },
      {
        question: "What if I cannot donate money?",
        answer:
          "You can also help by sharing the campaign, sending it to more people, and praying for the affected families. Every gesture helps the aid reach farther.",
      },
      {
        question: "How do I confirm Binance Pay or Pago Movil?",
        answer:
          "Keep your receipt and tap I made my payment in the modal to close the confirmation flow. If the team needs to validate any details, they will use the information on the receipt.",
      },
      {
        question: "Is there a minimum amount?",
        answer:
          "You can choose one of the suggested amounts or enter another amount starting at 1 dollar. Every contribution helps cover urgent needs.",
      },
    ];
  }

  return [
    {
      question: "¿Qué se compra con mi donación?",
      answer:
        "Insumos médicos, alimentación, hidratación y apoyo básico para familias afectadas por el terremoto en Venezuela, incluyendo comunidades con acceso limitado a ayuda inmediata.",
    },
    {
      question: "¿Quiénes están detrás de la campaña?",
      answer:
        "La campaña la coordinan jóvenes cristianos venezolanos que viven en el país y están respondiendo a necesidades que ven de cerca. Valentina Muriel, Cristal Navas, Abraham Barrios y Marlon Amarista organizan las compras, entregas y reportes.",
      link: {
        href: "https://www.instagram.com/p/DaD7tL_vjyc/",
        label: "Ver el video de presentación del proyecto",
      },
    },
    {
      question: "¿Cómo sé que es confiable?",
      answer:
        "Los organizadores son miembros reconocidos de sus comunidades y tienen responsabilidades en ministerios e iglesias locales. Publicarán reportes diarios para mostrar el avance de la recaudación, las compras y las entregas realizadas. Además, las personas que están ayudando a levantar esta campaña también han aportado: esto no es solo una página para pedir, sino un esfuerzo compartido para responder con hechos.",
    },
    {
      question: "¿Cómo dono desde el exterior?",
      answer: `Si estás fuera de Venezuela, puedes donar con PayPal usando tarjeta o cuenta PayPal, o enviar ${coin} por Binance Pay desde cualquier país donde tengas acceso a esos servicios.`,
    },
    {
      question: "¿Puedo pagar con tarjeta de débito o crédito?",
      answer:
        "Sí. Puedes pagar con tarjeta de débito o crédito a través de PayPal, según la disponibilidad en tu país. También estamos evaluando otros proveedores para habilitar más opciones de pago sin que los fondos queden retenidos tanto tiempo como ocurre con Stripe.",
    },
    {
      question: "¿Cómo dono desde Venezuela?",
      answer: `Si estás en Venezuela, puedes aportar con Pago Móvil en bolívares. También puedes usar Binance Pay si prefieres donar en ${coin}.`,
    },
    {
      question: "¿Publicarán reportes?",
      answer:
        "Sí. Publicaremos reportes transparentes todos los días con el avance de la recaudación, el uso de los fondos y las entregas realizadas conforme avance la respuesta.",
    },
    {
      question: "¿Y si no puedo donar dinero?",
      answer:
        "También puedes ayudar compartiendo la campaña, enviándola a más personas y orando por las familias afectadas. Cada gesto ayuda a que la ayuda llegue más lejos.",
    },
    {
      question: "¿Cómo confirmo Binance Pay o Pago Móvil?",
      answer:
        "Conserva tu comprobante y pulsa Ya hice mi pago en el modal para cerrar el flujo de confirmación. Si el equipo necesita validar algún dato, usará la información del comprobante.",
    },
    {
      question: "¿Hay un monto mínimo?",
      answer:
        "Puedes elegir uno de los montos sugeridos o escribir otro monto desde 1 dólar. Cada aporte suma para cubrir necesidades urgentes.",
    },
  ];
};
