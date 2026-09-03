export type SiteRole = 'owner' | 'admin' | 'editor'

export type AppKind = 'landing' | 'store' | 'travel'

export type InquiryStatus = 'new' | 'read' | 'replied' | 'archived'

export interface Site {
  id: string
  name: string
  slug: string
  logo_url: string | null
  hero_image_url: string | null
  building_image_url: string | null
  short_description: string | null
  hero_heading: string | null
  hero_subheading: string | null
  address: string | null
  phone: string | null
  email: string | null
  facebook_url: string | null
  messenger_url: string | null
  registration_url: string | null
  google_maps_embed_url: string | null
  google_maps_directions_url: string | null
  is_active: boolean
  app_kind?: AppKind
  created_at: string
  updated_at: string
}

export type SiteUpdate = Partial<
  Pick<
    Site,
    | 'name'
    | 'logo_url'
    | 'hero_image_url'
    | 'building_image_url'
    | 'short_description'
    | 'hero_heading'
    | 'hero_subheading'
    | 'address'
    | 'phone'
    | 'email'
    | 'facebook_url'
    | 'messenger_url'
    | 'google_maps_embed_url'
    | 'google_maps_directions_url'
  >
>

export interface SiteMember {
  id: string
  site_id: string
  user_id: string
  role: SiteRole
  created_at: string
}

export interface TravelContent {
  id: string
  site_id: string
  about_heading: string | null
  about_body: string | null
  years_in_business: number
  mission_heading: string | null
  mission_body: string | null
  vision_heading: string | null
  vision_body: string | null
  services_heading: string | null
  services_subheading: string | null
  promotions_heading: string | null
  promotions_subheading: string | null
  gallery_heading: string | null
  gallery_subheading: string | null
  reviews_heading: string | null
  reviews_subheading: string | null
  contact_heading: string | null
  contact_subheading: string | null
  instagram_handle: string | null
  instagram_url: string | null
  whatsapp_number: string | null
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
}

export type TravelContentUpdate = Partial<
  Omit<TravelContent, 'id' | 'site_id' | 'created_at' | 'updated_at'>
>

export interface TravelHeroFrame {
  id: string
  site_id: string
  title: string
  caption: string | null
  image_url: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TravelService {
  id: string
  site_id: string
  title: string
  slug: string
  summary: string | null
  description: string | null
  image_url: string | null
  cta_label: string | null
  cta_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TravelPromotion {
  id: string
  site_id: string
  title: string
  location: string | null
  summary: string | null
  image_url: string | null
  external_url: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TravelGalleryItem {
  id: string
  site_id: string
  title: string | null
  caption: string | null
  image_url: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TravelTestimonial {
  id: string
  site_id: string
  author_name: string
  author_title: string | null
  quote: string
  rating: number
  photo_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TravelInquiry {
  id: string
  site_id: string
  full_name: string
  email: string
  phone: string | null
  destination: string | null
  travel_dates: string | null
  message: string
  status: InquiryStatus
  created_at: string
}

export type TravelInquiryInput = Pick<
  TravelInquiry,
  'full_name' | 'email' | 'phone' | 'destination' | 'travel_dates' | 'message'
>
