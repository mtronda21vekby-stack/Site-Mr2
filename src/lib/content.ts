import globalSettings from '@/content/settings/global.json';
import homeEn from '@/content/home/en.json';
import homeEs from '@/content/home/es.json';
import homeRu from '@/content/home/ru.json';
import reviewsEn from '@/content/reviews/en.json';
import reviewsEs from '@/content/reviews/es.json';
import reviewsRu from '@/content/reviews/ru.json';
import faqEn from '@/content/faq/en.json';
import faqEs from '@/content/faq/es.json';
import faqRu from '@/content/faq/ru.json';
import type { AreaPage, GlobalSettings, HomeContent, ReviewItem, ServicePage } from '@/types/content';
import type { Locale } from '@/types/common';

const homeMap: Record<Locale, HomeContent> = { en: homeEn, es: homeEs, ru: homeRu };
const reviewsMap: Record<Locale, { items: ReviewItem[] }> = { en: reviewsEn, es: reviewsEs, ru: reviewsRu };
const faqMap: Record<Locale, { items: { question: string; answer: string }[] }> = { en: faqEn, es: faqEs, ru: faqRu };

export function getGlobalSettings(): GlobalSettings {
  return globalSettings as GlobalSettings;
}

export function getHomeContent(locale: Locale): HomeContent {
  return homeMap[locale];
}

export function getReviews(locale: Locale): ReviewItem[] {
  return reviewsMap[locale].items;
}

export function getFaq(locale: Locale) {
  return faqMap[locale].items;
}

export async function getService(locale: Locale, slug: string): Promise<ServicePage> {
  const mod = await import(`@/content/services/${locale}/${slug}.json`);
  return mod.default as ServicePage;
}

export async function getArea(locale: Locale, slug: string): Promise<AreaPage> {
  const mod = await import(`@/content/areas/${locale}/${slug}.json`);
  return mod.default as AreaPage;
}

export const serviceSlugs = [
  'automotive-locksmith',
  'car-lockout',
  'car-key-replacement',
  'key-programming',
  'key-fob-services',
  'ignition-key-issues'
];

export const areaSlugs = ['philadelphia'];
