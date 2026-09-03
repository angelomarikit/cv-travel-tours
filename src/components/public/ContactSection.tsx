import { MapPin, Phone } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { InquiryForm } from '@/components/public/InquiryForm'
import { useContent } from '@/contexts/ContentContext'
import { useSite } from '@/contexts/SiteContext'
import { formatPhoneDisplay } from '@/utils/phone'

export function ContactSection() {
  const { site } = useSite()
  const { content } = useContent()

  return (
    <section id="contact" className="bg-mist py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <p className="section-kicker">Contact</p>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{content.contact_heading}</h2>
          <p className="mt-4 text-lg text-muted">{content.contact_subheading}</p>
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-start gap-3 text-ink">
              <MapPin className="mt-0.5 h-4 w-4 text-royal" />
              {site?.address}
            </p>
            <a className="flex items-center gap-3 text-ink" href={`tel:${site?.phone ?? ''}`}>
              <Phone className="h-4 w-4 text-royal" />
              {formatPhoneDisplay(site?.phone)}
            </a>
          </div>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-line bg-white">
            <iframe
              title="CV Travel & Tours location"
              src={site?.google_maps_embed_url ?? ''}
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {site?.google_maps_directions_url ? (
            <a
              href={site.google_maps_directions_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-royal"
            >
              Open directions in Google Maps
            </a>
          ) : null}
        </Reveal>

        <Reveal delay={100}>
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  )
}
