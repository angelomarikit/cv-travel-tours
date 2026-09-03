import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_CONTENT,
  DEFAULT_FRAMES,
  DEFAULT_GALLERY,
  DEFAULT_PROMOTIONS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
} from '@/data/defaults'
import { useSite } from '@/contexts/SiteContext'
import {
  fetchGallery,
  fetchHeroFrames,
  fetchPromotions,
  fetchServices,
  fetchTestimonials,
  fetchTravelContent,
} from '@/services/travelService'
import type {
  TravelContent,
  TravelGalleryItem,
  TravelHeroFrame,
  TravelPromotion,
  TravelService,
  TravelTestimonial,
} from '@/types/database'

interface ContentContextValue {
  content: TravelContent
  frames: TravelHeroFrame[]
  services: TravelService[]
  promotions: TravelPromotion[]
  gallery: TravelGalleryItem[]
  testimonials: TravelTestimonial[]
  loading: boolean
  refreshContent: () => Promise<void>
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const { site, siteId, usingFallback, loading: siteLoading } = useSite()
  const [content, setContent] = useState<TravelContent>(DEFAULT_CONTENT)
  const [frames, setFrames] = useState<TravelHeroFrame[]>(DEFAULT_FRAMES)
  const [services, setServices] = useState<TravelService[]>(DEFAULT_SERVICES)
  const [promotions, setPromotions] = useState<TravelPromotion[]>(DEFAULT_PROMOTIONS)
  const [gallery, setGallery] = useState<TravelGalleryItem[]>(DEFAULT_GALLERY)
  const [testimonials, setTestimonials] = useState<TravelTestimonial[]>(DEFAULT_TESTIMONIALS)
  const [loading, setLoading] = useState(true)

  const loadContent = useCallback(async () => {
    if (siteLoading) return

    if (!siteId || usingFallback) {
      setContent({
        ...DEFAULT_CONTENT,
        site_id: site?.id ?? DEFAULT_CONTENT.site_id,
      })
      setFrames(DEFAULT_FRAMES)
      setServices(DEFAULT_SERVICES)
      setPromotions(DEFAULT_PROMOTIONS)
      setGallery(DEFAULT_GALLERY)
      setTestimonials(DEFAULT_TESTIMONIALS)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [nextContent, nextFrames, nextServices, nextPromotions, nextGallery, nextReviews] =
        await Promise.all([
          fetchTravelContent(siteId),
          fetchHeroFrames(siteId, true),
          fetchServices(siteId, true),
          fetchPromotions(siteId, true),
          fetchGallery(siteId, true),
          fetchTestimonials(siteId, true),
        ])

      setContent({
        ...DEFAULT_CONTENT,
        ...nextContent,
        site_id: siteId,
      })
      setFrames(nextFrames.length ? nextFrames : DEFAULT_FRAMES)
      setServices(nextServices.length ? nextServices : DEFAULT_SERVICES)
      setPromotions(nextPromotions.length ? nextPromotions : DEFAULT_PROMOTIONS)
      setGallery(nextGallery.length ? nextGallery : DEFAULT_GALLERY)
      setTestimonials(nextReviews.length ? nextReviews : DEFAULT_TESTIMONIALS)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [site, siteId, siteLoading, usingFallback])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      frames,
      services,
      promotions,
      gallery,
      testimonials,
      loading,
      refreshContent: loadContent,
    }),
    [content, frames, services, promotions, gallery, testimonials, loading, loadContent],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}
