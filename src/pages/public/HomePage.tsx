import { AboutSection } from '@/components/public/AboutSection'
import { ContactSection } from '@/components/public/ContactSection'
import { HeroSequence } from '@/components/public/HeroSequence'
import { MarriottGallerySection } from '@/components/public/MarriottGallerySection'
import { MissionVision } from '@/components/public/MissionVision'
import { ServicesSection } from '@/components/public/ServicesSection'
import { TestimonialsSection } from '@/components/public/TestimonialsSection'

export default function HomePage() {
  return (
    <main>
      <HeroSequence />
      <AboutSection />
      <MissionVision />
      <MarriottGallerySection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  )
}
