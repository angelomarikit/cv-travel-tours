import { ArrowUp, Instagram, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { useContent } from '@/contexts/ContentContext'
import { useSite } from '@/contexts/SiteContext'
import { formatPhoneDisplay } from '@/utils/phone'

export function Footer() {
  const { site } = useSite()
  const { content } = useContent()

  return (
    <footer className="border-t border-line bg-white text-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr_0.65fr]">
        <div>
          <BrandLogo />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            {site?.short_description}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-royal uppercase">Contact</p>
          <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
            {site?.address}
          </p>
          <a href={`tel:${site?.phone ?? ''}`} className="mt-3 flex items-center gap-3 text-sm text-muted hover:text-royal">
            <Phone className="h-4 w-4 text-royal" />
            {formatPhoneDisplay(site?.phone)}
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-royal uppercase">Follow</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {content.instagram_url ? (
              <a href={content.instagram_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-royal">
                <Instagram className="h-4 w-4" />
                {content.instagram_handle}
              </a>
            ) : null}
            {site?.facebook_url ? (
              <a href={site.facebook_url} target="_blank" rel="noreferrer" className="text-muted hover:text-royal">
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 text-xs text-muted sm:px-6">
          <p>© {new Date().getFullYear()} CV Travel & Tours. All rights reserved.</p>
          <a href="#top" className="inline-flex items-center gap-2 font-medium text-royal">
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
