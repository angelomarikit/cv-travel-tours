import type { MouseEvent } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useContent } from '@/contexts/ContentContext'
import { useInquiry } from '@/contexts/InquiryContext'

export function ServicesSection() {
  const { content, services } = useContent()
  const { openInquiry } = useInquiry()

  function handleCta(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (href === '#contact' || href === '/#contact') {
      event.preventDefault()
      openInquiry()
    }
  }

  return (
    <section id="services" className="bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="section-kicker">Products & services</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">{content.services_heading}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">{content.services_subheading}</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 70}>
              <article className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_50px_-32px_rgba(0,27,77,0.35)]">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image_url || '/logo.png'}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{service.summary}</p>
                  <a
                    href={service.cta_url || '#contact'}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-royal"
                    onClick={(event) => handleCta(event, service.cta_url || '#contact')}
                  >
                    {service.cta_label || 'Inquire'}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
