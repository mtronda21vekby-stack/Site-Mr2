import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

type PremiumRevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  delay?: number
}

export default function PremiumReveal({
  children,
  delay = 0,
  className = '',
  style,
  ...props
}: PremiumRevealProps) {
  return (
    <div
      {...props}
      className={`premium-reveal ${className}`}
      style={{
        ...style,
        '--premium-reveal-delay': `${delay}s`,
      } as CSSProperties}
    >
      {children}
    </div>
  )
}
