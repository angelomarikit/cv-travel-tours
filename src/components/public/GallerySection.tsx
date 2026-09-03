import { useState } from 'react'
import { X } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useContent } from '@/contexts/ContentContext'
import { cn } from '@/utils/cn'

export function GallerySection() {
  const { content, gallery } = useContent()
  const [active, setActive] = useState<string | null>(null)
  const selected = gallery.find((item) => item.id === active)

  return (
    <section id="gallery" className="bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="section-kicker">Photo gallery</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">{content.gallery_heading}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">{content.gallery_subheading}</p>
        </Reveal>
        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {gallery.map((item, index) => (
            <Reveal key={item.id} delay={index * 50} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setActive(item.id)}
                className="group relative block w-full overflow-hidden rounded-[1.5rem]"
              >
                <img
                  src={item.image_url}
                  alt={item.title || 'Travel photo'}
                  className={cn(
                    'w-full object-cover transition duration-700 group-hover:scale-105',
                    index % 3 === 0 ? 'h-80' : 'h-64',
                  )}
                />
                <div className="absolute inset-0 bg-navy/0 transition group-hover:bg-navy/25" />
                {item.title ? (
                  <span className="absolute bottom-4 left-4 font-display text-xl text-white opacity-0 transition group-hover:opacity-100">
                    {item.title}
                  </span>
                ) : null}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/80 p-4">
          <button type="button" className="absolute inset-0" aria-label="Close photo" onClick={() => setActive(null)} />
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-black">
            <img src={selected.image_url} alt={selected.title || 'Travel photo'} className="max-h-[90vh] w-full object-contain" />
            <button
              type="button"
              className="absolute top-4 right-4 rounded-full bg-white/90 p-2"
              aria-label="Close"
              onClick={() => setActive(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
