import { supabase } from '@/lib/supabase'
import { throwIfError } from '@/lib/errors'
import type {
  InquiryStatus,
  TravelContent,
  TravelContentUpdate,
  TravelGalleryItem,
  TravelHeroFrame,
  TravelInquiry,
  TravelInquiryInput,
  TravelPromotion,
  TravelService,
  TravelTestimonial,
} from '@/types/database'

export async function fetchTravelContent(siteId: string): Promise<TravelContent | null> {
  const { data, error } = await supabase
    .from('travel_content')
    .select('*')
    .eq('site_id', siteId)
    .maybeSingle()

  if (error) {
    console.error('Failed to load travel content', error.message)
    throw new Error('Unable to load page content.')
  }

  return data as TravelContent | null
}

export async function updateTravelContent(
  siteId: string,
  updates: TravelContentUpdate,
): Promise<TravelContent> {
  const { data, error } = await supabase
    .from('travel_content')
    .update(updates)
    .eq('site_id', siteId)
    .select('*')
    .single()

  return throwIfError(data as TravelContent | null, error, 'Unable to save page content.')
}

export async function fetchHeroFrames(siteId: string, publishedOnly = true): Promise<TravelHeroFrame[]> {
  let query = supabase
    .from('travel_hero_frames')
    .select('*')
    .eq('site_id', siteId)
    .order('sort_order', { ascending: true })

  if (publishedOnly) query = query.eq('is_published', true)

  const { data, error } = await query
  if (error) {
    console.error('Failed to load hero frames', error.message)
    throw new Error('Unable to load hero images.')
  }
  return (data ?? []) as TravelHeroFrame[]
}

export async function upsertHeroFrame(
  payload: Partial<TravelHeroFrame> & { site_id: string; title: string; image_url: string },
): Promise<TravelHeroFrame> {
  const { data, error } = await supabase
    .from('travel_hero_frames')
    .upsert(payload)
    .select('*')
    .single()

  return throwIfError(data as TravelHeroFrame | null, error, 'Unable to save this hero frame.')
}

export async function deleteHeroFrame(id: string): Promise<void> {
  const { error } = await supabase.from('travel_hero_frames').delete().eq('id', id)
  if (error) throw new Error('Unable to delete this hero frame.')
}

export async function fetchServices(siteId: string, publishedOnly = true): Promise<TravelService[]> {
  let query = supabase
    .from('travel_services')
    .select('*')
    .eq('site_id', siteId)
    .order('sort_order', { ascending: true })

  if (publishedOnly) query = query.eq('is_published', true)

  const { data, error } = await query
  if (error) {
    console.error('Failed to load services', error.message)
    throw new Error('Unable to load services.')
  }
  return (data ?? []) as TravelService[]
}

export async function upsertService(
  payload: Partial<TravelService> & { site_id: string; title: string; slug: string },
): Promise<TravelService> {
  const { data, error } = await supabase.from('travel_services').upsert(payload).select('*').single()
  return throwIfError(data as TravelService | null, error, 'Unable to save this service.')
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('travel_services').delete().eq('id', id)
  if (error) throw new Error('Unable to delete this service.')
}

export async function fetchPromotions(siteId: string, publishedOnly = true): Promise<TravelPromotion[]> {
  let query = supabase
    .from('travel_promotions')
    .select('*')
    .eq('site_id', siteId)
    .order('sort_order', { ascending: true })

  if (publishedOnly) query = query.eq('is_published', true)

  const { data, error } = await query
  if (error) {
    console.error('Failed to load promotions', error.message)
    throw new Error('Unable to load featured stays.')
  }
  return (data ?? []) as TravelPromotion[]
}

export async function upsertPromotion(
  payload: Partial<TravelPromotion> & { site_id: string; title: string; external_url: string },
): Promise<TravelPromotion> {
  const { data, error } = await supabase.from('travel_promotions').upsert(payload).select('*').single()
  return throwIfError(data as TravelPromotion | null, error, 'Unable to save this promotion.')
}

export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase.from('travel_promotions').delete().eq('id', id)
  if (error) throw new Error('Unable to delete this promotion.')
}

export async function fetchGallery(siteId: string, publishedOnly = true): Promise<TravelGalleryItem[]> {
  let query = supabase
    .from('travel_gallery')
    .select('*')
    .eq('site_id', siteId)
    .order('sort_order', { ascending: true })

  if (publishedOnly) query = query.eq('is_published', true)

  const { data, error } = await query
  if (error) {
    console.error('Failed to load gallery', error.message)
    throw new Error('Unable to load the gallery.')
  }
  return (data ?? []) as TravelGalleryItem[]
}

export async function upsertGalleryItem(
  payload: Partial<TravelGalleryItem> & { site_id: string; image_url: string },
): Promise<TravelGalleryItem> {
  const { data, error } = await supabase.from('travel_gallery').upsert(payload).select('*').single()
  return throwIfError(data as TravelGalleryItem | null, error, 'Unable to save this gallery item.')
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from('travel_gallery').delete().eq('id', id)
  if (error) throw new Error('Unable to delete this gallery item.')
}

export async function fetchTestimonials(
  siteId: string,
  publishedOnly = true,
): Promise<TravelTestimonial[]> {
  let query = supabase
    .from('travel_testimonials')
    .select('*')
    .eq('site_id', siteId)
    .order('sort_order', { ascending: true })

  if (publishedOnly) query = query.eq('is_published', true)

  const { data, error } = await query
  if (error) {
    console.error('Failed to load testimonials', error.message)
    throw new Error('Unable to load reviews.')
  }
  return (data ?? []) as TravelTestimonial[]
}

export async function upsertTestimonial(
  payload: Partial<TravelTestimonial> & { site_id: string; author_name: string; quote: string },
): Promise<TravelTestimonial> {
  const { data, error } = await supabase.from('travel_testimonials').upsert(payload).select('*').single()
  return throwIfError(data as TravelTestimonial | null, error, 'Unable to save this review.')
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('travel_testimonials').delete().eq('id', id)
  if (error) throw new Error('Unable to delete this review.')
}

export async function submitInquiry(siteId: string, input: TravelInquiryInput): Promise<void> {
  const { error } = await supabase.from('travel_inquiries').insert({
    site_id: siteId,
    ...input,
  })

  if (error) {
    console.error('Failed to submit inquiry', error.message)
    throw new Error('Unable to send your inquiry right now. Please try WhatsApp or call us.')
  }
}

export async function fetchInquiries(siteId: string): Promise<TravelInquiry[]> {
  const { data, error } = await supabase
    .from('travel_inquiries')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load inquiries', error.message)
    throw new Error('Unable to load inquiries.')
  }

  return (data ?? []) as TravelInquiry[]
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  const { error } = await supabase.from('travel_inquiries').update({ status }).eq('id', id)
  if (error) throw new Error('Unable to update this inquiry.')
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase.from('travel_inquiries').delete().eq('id', id)
  if (error) throw new Error('Unable to delete this inquiry.')
}
