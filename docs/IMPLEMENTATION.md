# CV Travel & Tours — implementation notes

Stack: **React + TypeScript + Vite + Tailwind + React Router + Lucide + `@supabase/supabase-js`**. Same stack as HM Dormitory and NJMRF.

Slug: **`cv-travel-tours`**  
Address: Studio 3, Le Grand 3, Bagumbayan, Quezon City, Philippines  
Phone: 0966 988 7477  
Instagram: [@cvtravelandtours](https://instagram.com/cvtravelandtours)

Featured stays:

- [Marriott’s Bali Nusa Dua Gardens](https://www.marriott.com/en-us/hotels/dpsmv-marriotts-bali-nusa-dua-gardens/overview/)
- [Marriott’s Mai Khao Resort Phuket](https://www.marriott.com/en-us/hotels/hktpa-marriotts-mai-khao-resort-phuket/overview/)

## How the frontend finds this tenant

1. Read `VITE_SITE_SLUG`
2. Load `sites` where `slug = VITE_SITE_SLUG` and `is_active = true`
3. Use that row’s `id` as `site_id` on every query

Never hardcode a site UUID.

If Supabase is missing, the public homepage still renders fallback copy and photos so the design can be reviewed locally.

## Admin

`/admin` signs in with Supabase Auth, then checks `site_members` for this slug. Each public section has an editor:

| Admin page | Public section |
| --- | --- |
| Hero | Scroll-linked image sequence + fallback heading |
| About & story | About, years in business, mission, vision |
| Services | Products & services cards |
| Featured stays | Marriott / promotion cards |
| Gallery | Photo grid |
| Reviews | Testimonials |
| Inquiries | Contact form inbox |
| Settings | Logo, address, WhatsApp, Instagram, Messenger, maps, SEO |

## Public features

- Parallax about image and sticky scroll-linked hero frames
- WhatsApp floating button (`wa.me` from the phone number)
- Messenger button when a Messenger URL is saved
- Google Maps embed + directions
- Contact / inquiry form
- SEO title, description, Open Graph, Twitter card, and LocalBusiness JSON-LD
