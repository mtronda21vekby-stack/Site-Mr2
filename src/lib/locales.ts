export const ACTIVE_LOCALES = ['en', 'es'] as const
export const FROZEN_LOCALES = ['ru'] as const
export const ALL_LOCALES = ['en', 'es', 'ru'] as const

export type ActiveLocale = (typeof ACTIVE_LOCALES)[number]
export type FrozenLocale = (typeof FROZEN_LOCALES)[number]
export type AppLocale = (typeof ALL_LOCALES)[number]

export function isValidLocale(value: string): value is AppLocale {
  return (ALL_LOCALES as readonly string[]).includes(value)
}

export function isActiveLocale(value: string): value is ActiveLocale {
  return (ACTIVE_LOCALES as readonly string[]).includes(value)
}
