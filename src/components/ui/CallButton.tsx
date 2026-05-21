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
      <span aria-hidden="true" className="block transition duration-300 group-hover:-rotate-12 group-hover:scale-110">📞</span>
      <span className="sr-only">{ariaLabel}</span>
    </a>
  )
}
