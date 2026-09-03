import { HeartHandshake, MapPinned, ShieldCheck } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useContent } from '@/contexts/ContentContext'
import { useSite } from '@/contexts/SiteContext'
import { marriottGallery } from '@/data/marriottGallery'
import { phuketGallery } from '@/data/phuketGallery'

export function AboutSection() {
  const { site } = useSite()
  const { content } = useContent()
  const mainImage =
    site?.building_image_url && !site.building_image_url.includes('images.unsplash.com')
      ? site.building_image_url
      : (marriottGallery[1]?.src ?? '/logo.png')

  return (
    <section id="about" className="relative overflow-hidden bg-white py-24 sm:py-36">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-[#f7f8fa]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="relative">
          <div className="relative pr-5 pb-16 sm:pr-20">
            <img
              src={mainImage}
              alt="Marriott's Bali Nusa Dua Gardens exterior"
              className="h-[30rem] w-full rounded-[2rem] object-cover shadow-[0_30px_80px_-45px_rgba(0,21,51,0.5)] sm:h-[39rem]"
            />
            <img
              src={phuketGallery[2]?.src ?? '/logo.png'}
              alt="Aerial view of Marriott's Mai Khao Resort Phuket"
              className="absolute right-0 bottom-0 h-48 w-52 rounded-[1.5rem] border-[7px] border-white object-cover shadow-2xl sm:h-64 sm:w-72"
            />
            <div className="absolute right-3 bottom-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-royal uppercase shadow sm:right-5 sm:bottom-5">
              Mai Khao · Phuket
            </div>
            <div className="absolute top-7 -left-3 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-center shadow-xl sm:-left-10">
              <p className="font-display text-4xl leading-none text-royal">{content.years_in_business}+</p>
              <p className="mt-1 text-[9px] font-semibold tracking-[0.16em] text-muted uppercase">Years of care</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="section-kicker">About the agency</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-6xl">{content.about_heading}</h2>
          <p className="mt-7 text-lg leading-relaxed text-muted">{content.about_body}</p>
          <div className="mt-9 space-y-5 border-t border-line pt-7">
            <div className="flex gap-4">
              <HeartHandshake className="mt-1 h-6 w-6 shrink-0 text-royal" />
              <div>
                <p className="font-semibold text-ink">Personal from inquiry to homecoming</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">One responsive travel desk, not a faceless booking engine.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-royal" />
              <div>
                <p className="font-semibold text-ink">A decade of trusted arrangements</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">Thoughtful recommendations and clear guidance built over ten years.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPinned className="mt-1 h-6 w-6 shrink-0 text-royal" />
              <div>
                <p className="font-semibold text-ink">A local team you can visit</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{site?.address}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
