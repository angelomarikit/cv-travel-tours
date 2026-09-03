import { ArrowDownRight, Compass, Eye } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useContent } from '@/contexts/ContentContext'
import { phuketGallery } from '@/data/phuketGallery'

export function MissionVision() {
  const { content } = useContent()

  return (
    <section id="mission" className="bg-white py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <img
                src={phuketGallery[28]?.src ?? '/logo.png'}
                alt="Pool and tropical gardens at Marriott's Mai Khao Resort Phuket"
                className="h-[34rem] w-full rounded-[2rem] object-cover sm:h-[42rem]"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] bg-white/92 p-5 shadow-xl backdrop-blur-md sm:inset-x-8 sm:bottom-8">
                <p className="font-display text-2xl leading-tight text-ink">
                  “Good travel should feel clear before it feels exciting.”
                </p>
                <p className="mt-2 text-xs tracking-[0.17em] text-royal uppercase">Our promise to every traveler</p>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="section-kicker">What guides us</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-6xl">
                Thoughtful journeys,
                <span className="block italic text-royal">made personal.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Our direction is simple: give every traveler honest guidance, responsive care, and a trip worth remembering.
              </p>
            </Reveal>
            <div className="mt-10 divide-y divide-line border-y border-line">
              <Reveal>
                <article className="grid gap-5 py-8 sm:grid-cols-[3rem_1fr_auto]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-royal/8 text-royal">
                    <Compass className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-royal uppercase">01 · {content.mission_heading}</p>
                    <p className="mt-3 text-lg leading-relaxed text-muted">{content.mission_body}</p>
                  </div>
                  <ArrowDownRight className="hidden h-5 w-5 text-silver sm:block" />
                </article>
              </Reveal>
              <Reveal delay={80}>
                <article className="grid gap-5 py-8 sm:grid-cols-[3rem_1fr_auto]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-royal/8 text-royal">
                    <Eye className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-royal uppercase">02 · {content.vision_heading}</p>
                    <p className="mt-3 text-lg leading-relaxed text-muted">{content.vision_body}</p>
                  </div>
                  <ArrowDownRight className="hidden h-5 w-5 text-silver sm:block" />
                </article>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
