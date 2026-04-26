import type { AnchorHTMLAttributes } from 'react'

type CallButtonVariant = 'primary' | 'secondary'

type CallButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & {
  phoneNumber: string
  phoneDisplay?: string
  label?: string
  variant?: CallButtonVariant
}

const baseClass = 'notranslate inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-black uppercase tracking-[0.16em] transition duration-300 hover:-translate-y-0.5'
const variantClass: Record<CallButtonVariant, string> = {
  primary: 'bg-accent-blue text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] hover:brightness-110',
  secondary: 'border border-white/18 bg-white/[0.075] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl hover:border-accent-gold/45 hover:bg-accent-gold/12',
}

export default function CallButton({ phoneNumber, phoneDisplay, label = 'Call', variant = 'primary', className = '', ...props }: CallButtonProps) {
  const ariaLabel = props['aria-label'] || `${label}${phoneDisplay ? ` ${phoneDisplay}` : ''}`

  return (
    <a {...props} href={`tel:${phoneNumber}`} className={`${baseClass} ${variantClass[variant]} ${className}`.trim()} translate="no" aria-label={ariaLabel}>
      {label}
    </a>
  )
}
