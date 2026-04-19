import type { Locale } from './common';

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

export type ServiceSummary = {
  title: string;
  excerpt: string;
  slug: string;
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroBadges: string[];
  heroOrbitWords: string[];
  featuredServices: ServiceSummary[];
  whyChoose: string[];
  emergencyTitle: string;
  emergencyText: string;
  reviewsTitle: string;
  faqTitle: string;
};

export type ServicePage = {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
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
  faq: { question: string; answer: string }[];
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
