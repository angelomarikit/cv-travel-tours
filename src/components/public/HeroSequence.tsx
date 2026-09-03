import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useContent } from '@/contexts/ContentContext'
import { useInquiry } from '@/contexts/InquiryContext'
import { useSite } from '@/contexts/SiteContext'
import { marriottHeroImages } from '@/data/marriottGallery'
import { phuketHeroImages } from '@/data/phuketGallery'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { formatPhoneDisplay } from '@/utils/phone'

export function HeroSequence() {
  const { site } = useSite()
  const { frames, content } = useContent()
  const { openInquiry } = useInquiry()
  const { ref, progress } = useScrollProgress()
  const baseFrames = frames.map((frame, frameIndex) => {
    const isPhuket =
      frame.title.toLowerCase().includes('phuket') ||
      frame.title.toLowerCase().includes('mai khao') ||
      frame.image_url.includes('marriott-mai-khao')
    return {
      ...frame,
      image_url: frame.image_url.includes('images.unsplash.com')
        ? isPhuket
          ? (phuketHeroImages[0] ?? '/logo.png')
          : (marriottHeroImages[frameIndex % marriottHeroImages.length] ?? '/logo.png')
        : frame.image_url,
    }
  })
  const phuketFrameCount = baseFrames.filter(
    (frame) =>
      frame.title.toLowerCase().includes('phuket') ||
      frame.title.toLowerCase().includes('mai khao') ||
      frame.image_url.includes('marriott-mai-khao'),
  ).length
  const phuketFeatureFrames = [
    {
      ...baseFrames[0],
      id: 'phuket-hero-pool',
      title: 'Phuket, surrounded by green',
      caption: 'Marriott’s Mai Khao Resort — tropical gardens, generous pools, and room for the whole family.',
      image_url: phuketHeroImages[0] ?? '/logo.png',
    },
    {
      ...baseFrames[0],
      id: 'phuket-hero-villa',
      title: 'Your own corner of Mai Khao',
      caption: 'Apartment-style living and private plunge-pool stays near Phuket’s quieter northern coast.',
      image_url: phuketHeroImages[2] ?? '/logo.png',
    },
  ]
  const displayFrames = [
    ...baseFrames,
    ...phuketFeatureFrames.slice(Math.min(phuketFrameCount, phuketFeatureFrames.length)),
  ]
  const count = Math.max(displayFrames.length, 1)
  const index = Math.min(count - 1, Math.floor(progress * count * 0.999))
  const active = displayFrames[index] ?? displayFrames[0]

  return (
    <section ref={ref} id="top" className="relative" style={{ height: `${count * 92}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-navy">
        {displayFrames.map((frame, frameIndex) => (
          <img
            key={frame.id}
            src={frame.image_url}
            alt={frame.title}
            className="hero-kenburns absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: frameIndex === index ? 1 : 0,
              transition: 'opacity 700ms ease',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/25 to-navy/80" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy/50 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
          <p className="font-script text-3xl text-silver sm:text-4xl">A decade of journeys</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[0.95] text-white sm:text-7xl">
            {active?.title || site?.hero_heading || 'Journeys shaped with care.'}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {active?.caption || site?.hero_subheading}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="light" onClick={openInquiry}>
              Inquire now
            </Button>
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:border-white hover:text-white"
              onClick={() => (window.location.hash = 'marriott-gallery')}
            >
              Explore resorts
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <div className="flex gap-2">
              {displayFrames.map((frame, frameIndex) => (
                <span
                  key={frame.id}
                  className="h-1.5 w-10 rounded-full bg-white/25"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-white transition-all duration-300"
                    style={{ width: frameIndex === index ? '100%' : '0%' }}
                  />
                </span>
              ))}
            </div>
            <p className="text-xs tracking-[0.2em] text-white/70 uppercase">
              {content.years_in_business} years · {formatPhoneDisplay(site?.phone)}
            </p>
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-xs tracking-[0.22em] text-white/70 uppercase sm:flex"
        >
          Scroll
          <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  )
}
