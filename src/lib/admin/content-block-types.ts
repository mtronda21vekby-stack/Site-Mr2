export type AdminContentBlockLocale = 'en' | 'es'
export type AdminContentBlockPublishFilter = 'all' | 'published' | 'draft'

export type AdminContentBlockRow = {
  id: string
  locale: AdminContentBlockLocale
  pageKey: string
  slot: string
  eyebrow: string
  title: string
  body: string
  itemsText: string
  ctaLabel: string
  ctaHref: string
  sortOrder: number
  isPublished: boolean
}

export type AdminContentBlockPreset = {
  label: string
  group: string
  description: string
  usedOn: string
  fields: string
  pageKey: string
  slot: string
  eyebrow?: string
  title?: string
  body?: string
  itemsText?: string
  ctaLabel?: string
  ctaHref?: string
}
