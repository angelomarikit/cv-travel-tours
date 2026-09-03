import { ArrowUpRight, MapPin } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { useContent } from '@/contexts/ContentContext'
import { marriottGallery } from '@/data/marriottGallery'
import { phuketGallery } from '@/data/phuketGallery'

export function PromotionsSection() {
  const { content, promotions } = useContent()
  const baliPromotion =
    promotions.find((promo) => promo.title.toLowerCase().includes('bali nusa dua gardens')) ?? promotions[0]
  const phuketPromotion = promotions.find((promo) => promo.title.toLowerCase().includes('mai khao')) ?? {
    id: 'featured-phuket',
    title: 'Marriott’s Mai Khao Resort – Phuket',
    location: 'Mai Khao, Phuket',
    summary:
      'Spacious apartment living, private plunge-pool options, family activities, and a peaceful setting near Mai Khao Beach.',
    image_url: phuketGallery[2]?.src ?? null,
    external_url: 'https://www.marriott.com/en-us/hotels/hktpa-marriotts-mai-khao-resort-phuket/overview/',
  }
  const featuredPromotions = [baliPromotion, phuketPromotion].filter(Boolean)

  return (
    <section id="stays" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="section-kicker">Our featured stays</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">{content.promotions_heading}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Two thoughtfully selected Marriott escapes with apartment-style space, family-friendly amenities,
            and a slower resort rhythm in Bali and Phuket.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {featuredPromotions.map((promotion, index) => {
            if (!promotion) return null
            const isPhuket = promotion.title.toLowerCase().includes('mai khao')
            const gallery = isPhuket ? phuketGallery : marriottGallery
            const imageIndexes = isPhuket ? [28, 17, 38] : [20, 8, 30]

            return (
              <Reveal key={promotion.id} delay={index * 90}>
                <article className="h-full overflow-hidden rounded-[2rem] border border-line bg-[#f7f8fa]">
                  <div className="group relative h-80 overflow-hidden sm:h-96">
                    <img
                      src={gallery[isPhuket ? 2 : 1]?.src ?? promotion.image_url ?? '/logo.png'}
                      alt={promotion.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-5 left-5 rounded-full bg-white/92 px-4 py-2 text-[10px] font-semibold tracking-[0.14em] text-royal uppercase shadow-sm backdrop-blur">
                      {index === 0 ? 'Bali collection' : 'Phuket collection'}
                    </div>
                  </div>
                  <div className="p-7 sm:p-9">
                    {promotion.location ? (
                      <p className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] text-royal uppercase">
                        <MapPin className="h-3.5 w-3.5" />
                        {promotion.location}
                      </p>
                    ) : null}
                    <h3 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">{promotion.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-muted">{promotion.summary}</p>
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {imageIndexes.map((imageIndex) => (
                        <img
                          key={imageIndex}
                          src={gallery[imageIndex]?.src ?? '/logo.png'}
                          alt=""
                          className="h-20 w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <a href={promotion.external_url} target="_blank" rel="noreferrer">
                        <Button>
                          View Marriott details
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button variant="outline" onClick={() => (window.location.hash = 'contact')}>
                        Ask us to book it
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
