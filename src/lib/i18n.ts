import type { Locale } from '@/types/common';

export const locales: Locale[] = ['en', 'es', 'ru'];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleLabel(locale: Locale): string {
  return { en: 'EN', es: 'ES', ru: 'RU' }[locale];
}
