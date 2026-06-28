import type { CampaignContent } from "./types";
import {
  joinEnglishList,
  organizationLogo,
  sharedChurchAffiliations,
  sharedOrganizers,
  sharedSocialImage,
} from "./shared";

export const enContent: CampaignContent = {
    siteName: "Everyone for Venezuela",
    language: "en-US",
    locale: "en_US",
    pageTitle: "Everyone for Venezuela | Donate urgent earthquake relief",
    pageDescription:
      "Donate to send medical supplies, food, and hydration to families affected by the earthquake in Venezuela. A campaign coordinated by young Venezuelans with daily reports.",
    socialTitle: "Everyone for Venezuela | Urgent earthquake relief",
    socialDescription:
      "Your donation buys medical supplies, food, and hydration for affected families in Venezuela.",
    campaignKeywords: [
      "Everyone for Venezuela",
      "Todos por Venezuela",
      "donate Venezuela",
      "Venezuela relief",
      "Venezuela earthquake",
      "Venezuela donations",
      "medical supplies Venezuela",
      "humanitarian aid Venezuela",
      "PayPal Venezuela",
      "Binance Pay Venezuela",
      "Pago Movil",
    ],
    socialImage: {
      ...sharedSocialImage,
      alt: "Everyone for Venezuela: urgent earthquake relief. Donate medical supplies, food, and hydration.",
    },
    organizationLogo,
    organizers: sharedOrganizers,
    churchAffiliations: sharedChurchAffiliations,
    header: {
      brandAriaLabel: "Everyone for Venezuela",
      brandText: {
        line1: "Everyone for",
        line2: "Venezuela",
      },
      menuOpenLabel: "Open navigation menu",
      menuCloseLabel: "Close navigation menu",
      navLabel: "Primary navigation",
      nav: {
        impact: "Impact",
        organizers: "Organizers",
        transparency: "Transparency",
        faq: "FAQ",
      },
      donateAriaLabel: "Donate now",
      donateCompact: "Donate",
      languageSwitchLabel: "Change language",
    },
    hero: {
      eyebrow: "Earthquake emergency",
      titlePrefix: "Everyone for",
      titleStrong: "Venezuela",
      lede: "Relief for affected areas",
      copy:
        "Young Venezuelans are bringing medical supplies, food, and hydration to families hit by the earthquake, including remote communities that are hard to reach.",
      videoCta: "Watch the organizers' video",
      donateCta: "Donate now",
      paymentNote: "Fast, secure donation with",
      videoModalEyebrow: "Organizers",
      videoModalTitle: "Why this campaign began",
      videoCloseLabel: "Close video",
      videoSourceLabel: "Open original video",
    },
    progress: {
      raisedLabel: "Raised",
      percentLabel: "Of goal",
      goalLabel: "Goal",
      ariaTemplate: "{raised} raised of {goal}, {percent}% of the goal",
    },
    devastation: {
      eyebrow: "What is happening",
      titlePrefix: "A country",
      titleStrong: "under rubble",
      lede:
        "These are press images from the days after the earthquake. Behind every pile of rubble are entire communities that need water, medicine, and a place to sleep.",
      facts: {
        magnitude: "Magnitude",
        depth: "Depth",
        date: "Jun 24",
        epicenter: "Epicenter",
        source: "Data: USGS",
      },
      controlsLabel: "Visual record controls",
      previousLabel: "View previous image",
      nextLabel: "View next image",
      progressLabel: "Select image",
      dotLabel: "View image {index}: {title}",
    },
    organizersSection: {
      eyebrow: "Local coordination",
      titlePrefix: "The human",
      titleStrong: "team",
      bodyPrefix:
        "Four volunteers coordinate purchases, deliveries, and reports from Venezuela. They are part of",
      affiliationText: joinEnglishList(sharedChurchAffiliations),
      callout:
        "We work together to turn every donation into verifiable aid for affected families.",
      photoAlt: "Profile photo of {name}",
      instagramLabel: "{name} on Instagram",
      tiktokLabel: "{name} on TikTok",
      socialsLabel: "{name}'s social links",
    },
    faqSection: {
      eyebrow: "Donate with confidence",
      titlePrefix: "Frequently asked",
      titleStrong: "questions",
      donateCta: "Donate now",
    },
    transparency: {
      title: "Transparency | Everyone for Venezuela",
      description:
        "Reports from the Everyone for Venezuela campaign: funds raised, purchases, and deliveries. No reports have been published yet; they will appear here when the response begins.",
      eyebrow: "Daily report",
      heading: "Transparency",
      lede:
        "We publish each day's work: what came in, what we purchased, and what we delivered.",
      dayLabel: "Day {day}",
      emptyTitle: "No reports yet",
      emptyText:
        "The first report will be published as soon as activity begins. From there, a new report will follow each day.",
      fieldsLabel: "What each report includes",
      fields: [
        {
          icon: "tabler:cash",
          label: "What came in",
          body: "How much arrived that day and through which method.",
        },
        {
          icon: "tabler:receipt",
          label: "What was purchased",
          body: "Every purchase made that day.",
        },
        {
          icon: "tabler:truck-delivery",
          label: "What was delivered",
          body: "What reached whom.",
        },
      ],
      closing:
        "In the meantime, meet the people behind the campaign and see how it works.",
      faqLink: "Frequently asked questions",
      homeLink: "Back to home",
    },
    notFound: {
      title: "Page not found | Everyone for Venezuela",
      description:
        "We could not find this page. Go back home to follow the Everyone for Venezuela campaign.",
      eyebrow: "Error 404",
      heading: "This page does not exist",
      copy:
        "The link may be broken or the page may have moved. Go back home to follow the campaign and see how the relief effort is progressing.",
      homeLink: "Back to home",
      usefulPagesLabel: "Useful pages",
      transparencyLink: "Transparency",
      faqLink: "Frequently asked questions",
    },
    footer: {
      ariaLabel: "Site credits",
      madeWithLove: "Made with love on June 26, 2026.",
      costNote:
        "The costs of this page were covered by Mateo, its designer, as a fully voluntary contribution to the project.",
    },
    donationModal: {
      backLabel: "Back",
      closeLabel: "Close",
      amountEyebrow: "Make your contribution",
      amountTitle: "How much would you like to give?",
      amountLead:
        "Your contribution helps buy medical supplies, food, and hydration for people in need, including remote areas.",
      amountGroupLabel: "Choose an amount",
      popularAmountLabel: "Most chosen",
      customAmountLabel: "Other amount in dollars",
      customAmountPlaceholder: "Enter a whole amount",
      continueLabel: "Continue",
      amountChipLabel: "Your contribution",
      methodEyebrow: "Payment method",
      methodTitle: "How would you like to pay?",
      methodLead: "Choose the method that works best for you.",
      internationalGroupLabel: "From any country",
      localGroupLabel: "Local payment",
      countryName: "Venezuela",
      doneEyebrow: "Contribution sent",
      doneTitle: "Thank you for your contribution!",
      doneLead:
        "Your contribution matters in a difficult moment for Venezuela. We will publish transparent reports every day.",
      doneCloseLabel: "Close",
      paypalItemName:
        "Aid for medical supplies, food, and hydration in Venezuela.",
      amounts: [
        { value: 5, note: "Hydration for someone who needs it" },
        { value: 10, note: "Basic food support", popular: true },
        { value: 20, note: "Medical supplies and first aid" },
        { value: 35, note: "Support for remote areas" },
      ],
      methods: {
        paypal: {
          name: "Card or PayPal",
          desc: "Pay by card or with your PayPal account.",
          lead:
            "We will take you to PayPal's secure window. You can pay with your credit or debit card, or with your PayPal account if you already have one.",
          steps: [
            "Tap the button to open PayPal's secure window.",
            "Choose card payment or log in to PayPal.",
            "Confirm the amount and complete the payment.",
          ],
          actionLabel: "Go to PayPal",
        },
        binance: {
          name: "Binance Pay",
          desc: "{coin}, no bank fees",
          lead:
            "Send your contribution in {coin} through Binance Pay. It is a direct option for donating from Venezuela or abroad.",
          fields: {
            binancePayId: "Binance Pay ID",
            coin: "Currency",
            bank: "Bank",
            phone: "Phone",
            document: "ID or RIF",
            holder: "Account holder",
            contact: "Contact",
          },
          steps: [
            "Open Binance and go to Pay.",
            "Tap Send and paste the Pay ID.",
            "Send the amount in {coin} and keep your receipt.",
          ],
          actionLabel: "I made my payment",
        },
        pagoMovil: {
          name: "Pago Movil",
          desc: "Transfer in bolivares",
          lead:
            "Contribute in bolivares from your bank app. This is the local option for people in Venezuela.",
          fields: {
            binancePayId: "Binance Pay ID",
            coin: "Currency",
            bank: "Bank",
            phone: "Phone",
            document: "ID or RIF",
            holder: "Account holder",
            contact: "Contact",
          },
          steps: [
            "Open your bank app and go to Pago Movil.",
            "Enter the bank, phone number, and ID/RIF shown above.",
            "Send the equivalent amount in bolivares and keep your receipt.",
          ],
          contactStep:
            "Use the contact if you need to ask a question or confirm the payment.",
          actionLabel: "I made my payment",
        },
      },
      methodItem: {
        vesAmountLabel: "Amount in bolivares",
        copyVesAmountLabel: "Copy amount in bolivares",
        calculatingLabel: "Calculating...",
        queryingRateLabel: "Checking official rate",
        copyFieldLabel: "Copy {field}",
        pendingLabel: "Available very soon",
      },
      client: {
        minAmount: "Enter an amount of at least $1.",
        integerAmount: "Use a whole dollar amount, without cents.",
        chooseAmount: "Choose an amount or enter a whole amount.",
        calculating: "Calculating...",
        queryingRate: "Checking official rate",
        unavailable: "Unavailable",
        rateUnavailable: "Official rate is unavailable right now",
        officialRatePrefix: "Official rate:",
        rateUnit: "per $1",
        rateDatePrefix: "Date:",
        copied: "Copied",
      },
    },
    structuredData: {
      knowsAbout: [
        "humanitarian aid",
        "donations for Venezuela",
        "medical supplies",
        "emergency response",
      ],
      donateActionName: "Donate to Everyone for Venezuela",
      donateObjectName:
        "Medical supplies, food, and hydration for families affected by the earthquake",
      faqPageName: "Frequently asked questions about Everyone for Venezuela",
    },
  };
