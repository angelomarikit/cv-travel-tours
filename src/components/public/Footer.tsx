import { ArrowUp, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { useSite } from '@/contexts/SiteContext'
import { formatPhoneDisplay, toViberLink } from '@/utils/phone'

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61594024377319'
const VIBER_NUMBER = '09669887477'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.64 9.13 8.4 9.93v-7.03H7.9v-2.9h2.36V9.84c0-2.33 1.38-3.62 3.5-3.62.99 0 2.03.18 2.03.18v2.24h-1.14c-1.13 0-1.48.7-1.48 1.42v1.7h2.52l-.4 2.9h-2.12V22c4.76-.8 8.4-4.94 8.4-9.93Z" />
    </svg>
  )
}

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M11.4 2.02C6.18 2.26 2.05 6.5 2 11.84v.16c0 2.12.68 4.08 1.84 5.68L2.7 21.3l3.76-1.1a9.7 9.7 0 0 0 4.94 1.34h.1c5.3 0 9.64-4.2 9.9-9.5.14-2.86-.9-5.56-2.92-7.6A9.7 9.7 0 0 0 11.4 2.02Zm4.96 13.28c-.2.56-1.16 1.04-1.62 1.1-.4.06-.9.08-1.46-.1-.34-.1-.78-.24-1.34-.46-2.36-.98-3.9-3.34-4.02-3.5-.12-.16-.98-1.3-.98-2.48s.62-1.76.84-2c.22-.24.48-.3.64-.3h.46c.14 0 .34-.06.54.4.2.48.68 1.66.74 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.26.32-.36.42-.12.12-.24.24-.1.48.14.24.62 1.02 1.34 1.66.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14Z" />
    </svg>
  )
}

export function Footer() {
  const { site } = useSite()
  const facebookUrl = site?.facebook_url || FACEBOOK_URL
  const viberNumber = site?.phone || VIBER_NUMBER

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
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-royal"
            >
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </a>
            <a
              href={toViberLink(viberNumber)}
              className="inline-flex items-center gap-2 text-muted hover:text-royal"
            >
              <ViberIcon className="h-4 w-4" />
              {formatPhoneDisplay(viberNumber)}
            </a>
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
