import globalSettings from '@/content/settings/global.json';
import homeEn from '@/content/home/en.json';
import homeEs from '@/content/home/es.json';
import homeRu from '@/content/home/ru.json';

export type Locale = 'en' | 'es' | 'ru';

export type GlobalSettings = {
  brandName: string;
  logoUrl?: string;
  logoAlt?: string;
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

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroBadges: string[];
  heroOrbitWords: string[];
  featuredServices: {
    title: string;
    excerpt: string;
    slug: string;
  }[];
  whyChoose: string[];
  emergencyTitle: string;
  emergencyText: string;
  reviewsTitle: string;
  faqTitle: string;
  contactTitle: string;
  contactText: string;
};

export type ReviewItem = {
  name: string;
  rating: number;
  quote: string;
  date?: string;
  city?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

// Import review and FAQ content for each locale. These imports are lazily
// evaluated when the respective accessor functions are called. The
// TypeScript compiler will tree‑shake unused locales during build.
import reviewsEn from '@/content/reviews/en.json';
import reviewsEs from '@/content/reviews/es.json';
import reviewsRu from '@/content/reviews/ru.json';
import faqEn from '@/content/faq/en.json';
import faqEs from '@/content/faq/es.json';
import faqRu from '@/content/faq/ru.json';

/**
 * Return the global site settings. These values come from a JSON file and can be
 * edited via a CMS in the future. Keeping this in a separate function makes it
 * easy to swap out the data source later.
 */
export function getGlobalSettings(): GlobalSettings {
  return globalSettings as GlobalSettings;
}

/**
 * Load the home page content for a given locale. Fallback to English if the
 * locale is unsupported.
 */
export function getHomeContent(locale: Locale): HomeContent {
  switch (locale) {
    case 'es':
      return homeEs as HomeContent;
    case 'ru':
      return homeRu as HomeContent;
    case 'en':
    default:
      return homeEn as HomeContent;
  }
}

/**
 * Return the customer reviews for a given locale. Reviews are stored in
 * separate JSON files under `/content/reviews` to allow easy editing via
 * CMS. If a locale is unsupported the English reviews are returned.
 */
export function getReviews(locale: Locale): ReviewItem[] {
  switch (locale) {
    case 'es':
      return reviewsEs as ReviewItem[];
    case 'ru':
      return reviewsRu as ReviewItem[];
    case 'en':
    default:
      return reviewsEn as ReviewItem[];
  }
}

/**
 * Return the frequently asked questions for a given locale. FAQ items are
 * stored in separate JSON files under `/content/faq` to allow easy editing
 * via CMS. If a locale is unsupported the English FAQ is returned.
 */
export function getFaq(locale: Locale): FaqItem[] {
  switch (locale) {
    case 'es':
      return faqEs as FaqItem[];
    case 'ru':
      return faqRu as FaqItem[];
    case 'en':
    default:
      return faqEn as FaqItem[];
  }
}