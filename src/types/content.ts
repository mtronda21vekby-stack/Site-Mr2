import type { Locale } from "./common";

export type GlobalSettings = {
  brandName: string;
  phonePrimary: string;
  phoneDisplay: string;
  email?: string;
  serviceHours: string;
  defaultLocale: Locale;
  supportedLocales: Locale[];
  primaryCity: string;
  primaryState: string;
  country: string;
  hasPhysicalLocation: boolean;
};

export type FeaturedService = {
  title: string;
  excerpt: string;
  slug: string;
  image: string;
};

export type HomeContent = {
  nav: {
    home: string;
    services: string;
    areas: string;
    reviews: string;
    faq: string;
    contact: string;
    callNow: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroBadges: string[];
  heroOrbitWords: string[];
  servicesTitle: string;
  servicesIntro: string;
  featuredServices: FeaturedService[];
  whyTitle: string;
  whyChoose: string[];
  emergencyTitle: string;
  emergencyText: string;
  areasTitle: string;
  areasText: string;
  reviewsTitle: string;
  faqTitle: string;
  contactTitle: string;
  contactText: string;
};

export type ServicePage = {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  sections: {
    heading: string;
    body: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  seoTitle: string;
  seoDescription: string;
};

export type AreaPage = {
  slug: string;
  city: string;
  state: string;
  title: string;
  intro: string;
  highlights: string[];
  supportedServices: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  seoTitle: string;
  seoDescription: string;
};

export type ReviewItem = {
  name: string;
  rating: number;
  quote: string;
  date?: string;
  city?: string;
};

export type ReviewsContent = {
  items: ReviewItem[];
};

export type FAQContent = {
  items: {
    question: string;
    answer: string;
  }[];
};
