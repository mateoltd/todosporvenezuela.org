export interface CampaignFaq {
  question: string;
  answer: string;
  link?: {
    href: string;
    label: string;
  };
}

export interface CampaignOrganizer {
  name: string;
  image: string;
  accent: string;
  instagram: string;
  tiktok: string;
}

export interface DonationAmountCopy {
  value: number;
  note: string;
  popular?: boolean;
}

export interface DonationMethodCopy {
  name: string;
  desc: string;
  lead: string;
  fields?: {
    binancePayId: string;
    coin: string;
    bank: string;
    phone: string;
    document: string;
    holder: string;
    contact: string;
  };
  steps: string[];
  contactStep?: string;
  actionLabel: string;
}

export interface DonationModalCopy {
  backLabel: string;
  closeLabel: string;
  amountEyebrow: string;
  amountTitle: string;
  amountLead: string;
  amountGroupLabel: string;
  popularAmountLabel: string;
  customAmountLabel: string;
  customAmountPlaceholder: string;
  continueLabel: string;
  amountChipLabel: string;
  methodEyebrow: string;
  methodTitle: string;
  methodLead: string;
  internationalGroupLabel: string;
  localGroupLabel: string;
  countryName: string;
  doneEyebrow: string;
  doneTitle: string;
  doneLead: string;
  doneCloseLabel: string;
  paypalItemName: string;
  amounts: DonationAmountCopy[];
  methods: {
    paypal: DonationMethodCopy;
    binance: DonationMethodCopy;
    pagoMovil: DonationMethodCopy;
  };
  methodItem: {
    vesAmountLabel: string;
    copyVesAmountLabel: string;
    calculatingLabel: string;
    queryingRateLabel: string;
    copyFieldLabel: string;
    pendingLabel: string;
  };
  client: {
    minAmount: string;
    integerAmount: string;
    chooseAmount: string;
    calculating: string;
    queryingRate: string;
    unavailable: string;
    rateUnavailable: string;
    officialRatePrefix: string;
    rateUnit: string;
    rateDatePrefix: string;
    copied: string;
  };
}

export interface CampaignContent {
  siteName: string;
  language: string;
  locale: string;
  pageTitle: string;
  pageDescription: string;
  socialTitle: string;
  socialDescription: string;
  campaignKeywords: string[];
  socialImage: {
    path: string;
    width: number;
    height: number;
    alt: string;
  };
  organizationLogo: {
    path: string;
    width: number;
    height: number;
  };
  organizers: CampaignOrganizer[];
  churchAffiliations: string[];
  header: {
    brandAriaLabel: string;
    brandText: {
      line1: string;
      line2: string;
    };
    menuOpenLabel: string;
    menuCloseLabel: string;
    navLabel: string;
    nav: {
      impact: string;
      organizers: string;
      transparency: string;
      faq: string;
    };
    donateAriaLabel: string;
    donateFull: string;
    donateCompact: string;
    languageSwitchLabel: string;
  };
  hero: {
    eyebrow: string;
    titlePrefix: string;
    titleStrong: string;
    lede: string;
    copy: string;
    videoCta: string;
    donateCta: string;
    paymentNote: string;
    videoModalEyebrow: string;
    videoModalTitle: string;
    videoCloseLabel: string;
    videoSourceLabel: string;
  };
  progress: {
    raisedLabel: string;
    percentLabel: string;
    goalLabel: string;
    ariaTemplate: string;
  };
  devastation: {
    eyebrow: string;
    titlePrefix: string;
    titleStrong: string;
    lede: string;
    facts: {
      magnitude: string;
      depth: string;
      date: string;
      epicenter: string;
      source: string;
    };
    controlsLabel: string;
    previousLabel: string;
    nextLabel: string;
    progressLabel: string;
    dotLabel: string;
  };
  organizersSection: {
    eyebrow: string;
    titlePrefix: string;
    titleStrong: string;
    bodyPrefix: string;
    affiliationText: string;
    callout: string;
    photoAlt: string;
    instagramLabel: string;
    tiktokLabel: string;
    socialsLabel: string;
  };
  faqSection: {
    eyebrow: string;
    titlePrefix: string;
    titleStrong: string;
    donateCta: string;
  };
  transparency: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lede: string;
    dayLabel: string;
    emptyTitle: string;
    emptyText: string;
    fieldsLabel: string;
    fields: {
      icon: string;
      label: string;
      body: string;
    }[];
    closing: string;
    faqLink: string;
    homeLink: string;
  };
  notFound: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    copy: string;
    homeLink: string;
    usefulPagesLabel: string;
    transparencyLink: string;
    faqLink: string;
  };
  footer: {
    ariaLabel: string;
    madeWithLove: string;
    costNote: string;
  };
  donationModal: DonationModalCopy;
  structuredData: {
    knowsAbout: string[];
    donateActionName: string;
    donateObjectName: string;
    faqPageName: string;
  };
}
