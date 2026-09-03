import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { marriottCategories, marriottGallery } from '@/data/marriottGallery'
import { phuketCategories, phuketGallery } from '@/data/phuketGallery'
import { cn } from '@/utils/cn'

type ResortKey = 'bali' | 'phuket'

const resorts = {
  bali: {
    label: 'Bali Nusa Dua Gardens',
    eyebrow: 'Nusa Dua, Bali',
    title: 'Marriott’s Bali',
    accent: 'Nusa Dua Gardens.',
    description: 'Step through the apartments, pools, dining, activities, spa, and beach before you book.',
    url: 'https://www.marriott.com/en-us/hotels/dpsmv-marriotts-bali-nusa-dua-gardens/overview/',
    gallery: marriottGallery,
    categories: marriottCategories,
  },
  phuket: {
    label: 'Mai Khao Resort – Phuket',
    eyebrow: 'Mai Khao, Phuket',
    title: 'Marriott’s Mai Khao',
    accent: 'Resort – Phuket.',
    description: 'Explore apartment-style villas, private plunge pools, family activities, dining, and tropical resort grounds.',
    url: 'https://www.marriott.com/en-us/hotels/hktpa-marriotts-mai-khao-resort-phuket/overview/',
    gallery: phuketGallery,
    categories: phuketCategories,
  },
}

export function MarriottGallerySection() {
  const [resortKey, setResortKey] = useState<ResortKey>('bali')
  const [category, setCategory] = useState('Hotel')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const resort = resorts[resortKey]
  const images = useMemo(
    () => resort.gallery.filter((image) => image.category === category),
    [category, resort],
  )
  const selected = activeIndex === null ? null : images[activeIndex]

  function move(direction: -1 | 1) {
    if (activeIndex === null) return
    setActiveIndex((activeIndex + direction + images.length) % images.length)
  }

  return (
    <section id="marriott-gallery" className="overflow-hidden bg-[#f7f8fa] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-12 grid gap-3 rounded-[1.5rem] bg-white p-2 shadow-[0_18px_50px_-38px_rgba(0,21,51,0.45)] sm:grid-cols-2">
            {(Object.keys(resorts) as ResortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setResortKey(key)
                  setCategory('Hotel')
                  setActiveIndex(null)
                }}
                className={cn(
                  'rounded-[1.15rem] px-5 py-4 text-left transition',
                  resortKey === key ? 'bg-royal text-white' : 'text-ink hover:bg-mist',
                )}
              >
                <span className={cn('block text-[10px] tracking-[0.18em] uppercase', resortKey === key ? 'text-white/65' : 'text-royal')}>
                  {resorts[key].eyebrow}
                </span>
                <span className="mt-1 block font-display text-xl">{resorts[key].label}</span>
              </button>
            ))}
          </div>
          <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="section-kicker">Inside the resort</p>
              <h2 className="mt-3 max-w-4xl font-display text-4xl leading-tight text-ink sm:text-6xl">
                Explore {resort.title}
                <span className="block italic text-royal">{resort.accent}</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
                {resort.description} Every image below is from the property’s official gallery.
              </p>
            </div>
            <a href={resort.url} target="_blank" rel="noreferrer">
              <Button variant="outline">
                View Marriott details
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </Reveal>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {resort.categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setCategory(item)
                setActiveIndex(null)
              }}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
                category === item
                  ? 'border-royal bg-royal text-white'
                  : 'border-line bg-white text-muted hover:border-royal/40 hover:text-royal',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-7 grid auto-rows-[12rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <Reveal
              key={image.src}
              delay={(index % 8) * 45}
              className={cn(
                index === 0 && 'sm:col-span-2 sm:row-span-2',
                index === 5 && 'lg:col-span-2',
                index === 8 && 'lg:row-span-2',
              )}
            >
              <button
                type="button"
                className="group relative h-full min-h-48 w-full overflow-hidden rounded-[1.4rem] bg-silver/20 text-left"
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={image.src}
                  alt={`${image.title} at ${resort.label}`}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-80" />
                <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="block text-[10px] tracking-[0.2em] text-white/65 uppercase">{image.category}</span>
                  <span className="mt-1 block font-display text-xl">{image.title}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/90 p-4">
          <button type="button" className="absolute inset-0" aria-label="Close image" onClick={() => setActiveIndex(null)} />
          <div className="relative z-10 w-full max-w-6xl">
            <img
              src={selected.src}
              alt={selected.title}
              className="max-h-[82vh] w-full rounded-2xl bg-black object-contain"
            />
            <div className="mt-4 flex items-center justify-between text-white">
              <div>
                <p className="text-xs tracking-[0.18em] text-white/60 uppercase">{selected.category}</p>
                <p className="font-display text-2xl">{selected.title}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-full border border-white/25 p-3" aria-label="Previous image" onClick={() => move(-1)}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button type="button" className="rounded-full border border-white/25 p-3" aria-label="Next image" onClick={() => move(1)}>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button type="button" className="rounded-full bg-white p-3 text-navy" aria-label="Close" onClick={() => setActiveIndex(null)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
