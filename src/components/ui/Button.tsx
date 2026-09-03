import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'light'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-royal text-white hover:bg-royal-deep disabled:bg-royal/40',
  secondary: 'bg-royal/10 text-royal hover:bg-royal/15 disabled:bg-royal/5',
  ghost: 'bg-transparent text-ink hover:bg-mist disabled:text-muted',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50',
  outline: 'border border-line bg-white text-ink hover:border-royal hover:text-royal disabled:opacity-50',
  light: 'bg-white text-royal hover:bg-mist disabled:bg-white/60',
}

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'btn-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
