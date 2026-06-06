import type { AnchorHTMLAttributes } from 'react'

type CallButtonVariant = 'primary' | 'secondary'

type CallButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & {
  phoneNumber: string
  phoneDisplay?: string
  label?: string
  variant?: CallButtonVariant
}

const baseClass = 'notranslate group inline-flex min-h-12 min-w-12 items-center justify-center rounded-full px-4 py-3 text-xl font-black transition duration-300 ease-out hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B1F4D]/18'
const variantClass: Record<CallButtonVariant, string> = {
  primary: 'border border-[#0B1F4D]/10 bg-[#0B1F4D] text-white shadow-[0_16px_42px_rgba(11,31,77,0.24)] hover:shadow-[0_24px_60px_rgba(11,31,77,0.30)]',
  secondary: 'border border-[#0B1F4D]/22 bg-white text-[#0B1F4D] shadow-[0_14px_36px_rgba(11,31,77,0.10)] hover:border-[#0B1F4D]/42 hover:bg-[#F3F7FF] hover:shadow-[0_20px_52px_rgba(11,31,77,0.16)]',
}

export default function CallButton({ phoneNumber, phoneDisplay, label = 'Call', variant = 'primary', className = '', ...props }: CallButtonProps) {
  const ariaLabel = props['aria-label'] || `${label}${phoneDisplay ? ` ${phoneDisplay}` : ''}`

  return (
    <a {...props} href={`tel:${phoneNumber}`} className={`${baseClass} ${variantClass[variant]} ${className}`.trim()} translate="no" aria-label={ariaLabel} title={ariaLabel}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 transition duration-300 group-hover:-rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.62 2.65a2 2 0 0 1-.45 2.11L8.01 9.75a16 16 0 0 0 6.24 6.24l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.74.5 2.65.62A2 2 0 0 1 22 16.92z" />
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </a>
  )
}
