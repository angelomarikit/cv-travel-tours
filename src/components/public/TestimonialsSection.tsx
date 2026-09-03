import { Star } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useContent } from '@/contexts/ContentContext'

export function TestimonialsSection() {
  const { content, testimonials } = useContent()

  return (
    <section id="reviews" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="section-kicker">Reviews</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-5xl">{content.reviews_heading}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">{content.reviews_subheading}</p>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((review, index) => (
            <Reveal key={review.id} delay={index * 80}>
              <article className="flex h-full flex-col rounded-[1.75rem] border border-line bg-mist p-7">
                <div className="flex gap-1 text-royal">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 flex-1 font-display text-2xl leading-snug text-ink">“{review.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-ink">{review.author_name}</p>
                  {review.author_title ? <p className="text-sm text-muted">{review.author_title}</p> : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
