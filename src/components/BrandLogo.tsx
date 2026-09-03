import { cn } from '@/utils/cn'
import { useSite } from '@/contexts/SiteContext'

export function BrandLogo({
  size = 'header',
  light = false,
}: {
  size?: 'header' | 'footer' | 'admin'
  light?: boolean
}) {
  const { site } = useSite()
  const src = site?.logo_url || '/logo.png'
  const sizes = {
    header: 'h-12 w-12 sm:h-14 sm:w-14',
    footer: 'h-16 w-16',
    admin: 'h-12 w-12',
  }

  return (
    <div className="flex items-center gap-3">
      <img src={src} alt={site?.name ?? 'CV Travel & Tours'} className={cn(sizes[size], 'object-contain')} />
      <div className="min-w-0">
        <p className={cn('font-display text-xl leading-none tracking-tight sm:text-2xl', light ? 'text-white' : 'text-royal')}>
          CV Travel
        </p>
        <p className={cn('text-[11px] tracking-[0.22em] uppercase', light ? 'text-white/70' : 'text-muted')}>
          & Tours
        </p>
      </div>
    </div>
  )
}
