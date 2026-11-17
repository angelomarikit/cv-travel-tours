-- =============================================================================
-- CV Travel & Tours — tenant schema
-- Run this on the SAME Supabase project as HM Dormitory and NJMRF.
-- Safe to re-run. Does not change dormitory or pharmacy tables.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Sites: allow a travel tenant beside landing and store
-- -----------------------------------------------------------------------------

alter table public.sites
  add column if not exists app_kind text not null default 'landing';

alter table public.sites
  drop constraint if exists sites_app_kind_check;

alter table public.sites
  add constraint sites_app_kind_check
  check (app_kind in ('landing', 'store', 'travel'));

insert into public.sites (
  name,
  slug,
  logo_url,
  short_description,
  hero_heading,
  hero_subheading,
  address,
  phone,
  facebook_url,
  messenger_url,
  google_maps_embed_url,
  google_maps_directions_url,
  app_kind,
  is_active
)
values (
  'CV Travel & Tours',
  'cv-travel-tours',
  null,
  'A decade of trusted journeys from Quezon City — resort stays, international packages, and personal travel care.',
  'Journeys shaped with care.',
  'Ten years of helping Filipino families and friends reach the places they have been waiting to see.',
  'Studio 3, Le Grand 3, Bagumbayan, Quezon City, Philippines',
  '09669887477',
  null,
  null,
  'https://maps.google.com/maps?q=Studio%203%2C%20Le%20Grand%203%2C%20Bagumbayan%2C%20Quezon%20City%2C%20Philippines&z=16&output=embed',
  'https://www.google.com/maps/dir/?api=1&destination=Studio+3,+Le+Grand+3,+Bagumbayan,+Quezon+City,+Philippines',
  'travel',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  short_description = excluded.short_description,
  hero_heading = excluded.hero_heading,
  hero_subheading = excluded.hero_subheading,
  address = excluded.address,
  phone = excluded.phone,
  google_maps_embed_url = excluded.google_maps_embed_url,
  google_maps_directions_url = excluded.google_maps_directions_url,
  app_kind = 'travel',
  is_active = true;

-- -----------------------------------------------------------------------------
-- Travel content (one row per site)
-- -----------------------------------------------------------------------------

create table if not exists public.travel_content (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  about_heading text,
  about_body text,
  years_in_business integer not null default 10,
  mission_heading text,
  mission_body text,
  vision_heading text,
  vision_body text,
  services_heading text,
  services_subheading text,
  promotions_heading text,
  promotions_subheading text,
  gallery_heading text,
  gallery_subheading text,
  reviews_heading text,
  reviews_subheading text,
  contact_heading text,
  contact_subheading text,
  instagram_handle text,
  instagram_url text,
  whatsapp_number text,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint travel_content_one_per_site unique (site_id)
);

create table if not exists public.travel_hero_frames (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  title text not null,
  caption text,
  image_url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.travel_services (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  description text,
  image_url text,
  cta_label text,
  cta_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint travel_services_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint travel_services_site_slug_unique unique (site_id, slug)
);

create table if not exists public.travel_promotions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  title text not null,
  location text,
  summary text,
  image_url text,
  external_url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.travel_gallery (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  title text,
  caption text,
  image_url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.travel_testimonials (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  author_name text not null,
  author_title text,
  quote text not null,
  rating integer not null default 5,
  photo_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint travel_testimonials_rating_check check (rating between 1 and 5)
);

create table if not exists public.travel_inquiries (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  destination text,
  travel_dates text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  constraint travel_inquiries_status_check
    check (status in ('new', 'read', 'replied', 'archived'))
);

-- -----------------------------------------------------------------------------
-- Seed content (only when a table is still empty for this site)
-- -----------------------------------------------------------------------------

insert into public.travel_content (
  site_id,
  about_heading,
  about_body,
  years_in_business,
  mission_heading,
  mission_body,
  vision_heading,
  vision_body,
  services_heading,
  services_subheading,
  promotions_heading,
  promotions_subheading,
  gallery_heading,
  gallery_subheading,
  reviews_heading,
  reviews_subheading,
  contact_heading,
  contact_subheading,
  instagram_handle,
  instagram_url,
  whatsapp_number,
  seo_title,
  seo_description
)
select
  s.id,
  'A travel desk that still knows your name.',
  'CV Travel & Tours has spent ten years turning plans into arrivals — from first inquiry to the ride home. From our studio in Bagumbayan, Quezon City, we arrange resort stays, international packages, and custom itineraries with the same care we would give our own family. We stay close, answer quickly, and choose partners we would book ourselves.',
  10,
  'Mission',
  'To craft seamless, trustworthy journeys for Filipino travelers — pairing a decade of destination expertise with personal care from the first conversation to a safe return home.',
  'Vision',
  'To be the Philippines'' most relied-on travel partner for resort stays and international getaways, known for honest guidance, curated Marriott and luxury stays, and trips that feel effortless.',
  'Travel, arranged with intention.',
  'Packages, resorts, flights, and custom plans — built around how you actually like to travel.',
  'Featured stays',
  'Two Marriott destinations we are proud to recommend this season.',
  'Places we love sending people.',
  'A glimpse of the coasts, villas, and city lights our guests return talking about.',
  'Travelers who came back smiling.',
  'A decade of trips, measured in thank-you messages and next bookings.',
  'Tell us where you want to go.',
  'Share a few details and we will prepare options that fit your dates, budget, and company.',
  '@cvtravelandtours',
  'https://www.instagram.com/cvtravelandtours/',
  '09669887477',
  'CV Travel & Tours | A decade of trusted journeys',
  'CV Travel & Tours in Quezon City — 10 years of resort bookings, international packages, and personal travel care. Inquire for Bali, Phuket, and custom trips.'
from public.sites s
where s.slug = 'cv-travel-tours'
on conflict (site_id) do nothing;

insert into public.travel_hero_frames (site_id, title, caption, image_url, sort_order)
select s.id, f.title, f.caption, f.image_url, f.sort_order
from public.sites s
cross join (
  values
    ('Bali, waiting in the light', 'Marriott''s Nusa Dua Gardens — villas, gardens, and unhurried mornings.', '/marriott-bali-nusa-dua/hotel-view/dpsmv-exterior-5844_classic-hor.jpg', 1),
    ('A pool made for slow afternoons', 'The 1,072-square-meter West Pool at Marriott''s Bali Nusa Dua Gardens.', '/marriott-bali-nusa-dua/recreation-and-fitness/dpsmv-pool-0009-hor-clsc.webp', 2),
    ('Room to settle in', 'Contemporary apartments with living, dining, and kitchenette spaces.', '/marriott-bali-nusa-dua/villas/dpsmv-apartment-0017-hor-clsc.webp', 3),
    ('Nusa Dua, just beyond the gardens', 'Resort ease, family-friendly activities, and Bali''s southern coast nearby.', '/marriott-bali-nusa-dua/nearby-attraction/dpsmv-nusadua-beach-5850-hor-clsc.avif', 4),
    ('Phuket, surrounded by green', 'Marriott''s Mai Khao Resort — tropical gardens, generous pools, and room for the whole family.', '/marriott-mai-khao-phuket/view/mv-hktpa-exterior-aerial24135-63745_classic-hor.jpg', 5),
    ('Your own corner of Mai Khao', 'Apartment-style living and private plunge-pool stays near Phuket''s quieter northern coast.', '/marriott-mai-khao-phuket/villas/mv-hktpa-apartment-plunge-pool-33745_classic-hor.jpg', 6)
) as f(title, caption, image_url, sort_order)
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1 from public.travel_hero_frames x where x.site_id = s.id
  );

insert into public.travel_hero_frames (site_id, title, caption, image_url, sort_order)
select
  s.id,
  'Phuket, surrounded by green',
  'Marriott''s Mai Khao Resort — tropical gardens, generous pools, and room for the whole family.',
  '/marriott-mai-khao-phuket/view/mv-hktpa-exterior-aerial24135-63745_classic-hor.jpg',
  5
from public.sites s
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1
    from public.travel_hero_frames x
    where x.site_id = s.id and x.title = 'Phuket, surrounded by green'
  );

insert into public.travel_hero_frames (site_id, title, caption, image_url, sort_order)
select
  s.id,
  'Your own corner of Mai Khao',
  'Apartment-style living and private plunge-pool stays near Phuket''s quieter northern coast.',
  '/marriott-mai-khao-phuket/villas/mv-hktpa-apartment-plunge-pool-33745_classic-hor.jpg',
  6
from public.sites s
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1
    from public.travel_hero_frames x
    where x.site_id = s.id and x.title = 'Your own corner of Mai Khao'
  );

insert into public.travel_services (
  site_id, title, slug, summary, description, image_url, cta_label, cta_url, sort_order
)
select s.id, f.title, f.slug, f.summary, f.description, f.image_url, f.cta_label, f.cta_url, f.sort_order
from public.sites s
cross join (
  values
    ('Resort & hotel stays', 'resort-hotel-stays', 'Marriott and luxury properties chosen for rest, not just a photo.', 'We book resort and hotel stays with partners we trust — including Marriott''s Bali Nusa Dua Gardens and Mai Khao Resort Phuket.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80', 'Ask about a stay', '#contact', 1),
    ('International tour packages', 'international-tour-packages', 'Guided and independent itineraries across Asia and beyond.', 'Ready-made and tailored packages for couples, families, and small groups.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80', 'Plan a package', '#contact', 2),
    ('Custom itineraries', 'custom-itineraries', 'Dates, pace, and budget — built around how you like to travel.', 'Tell us who is coming and what you want the days to feel like. We handle the rest.', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80', 'Start a custom plan', '#contact', 3),
    ('Flights & transfers', 'flights-transfers', 'Airport-to-resort coordination so arrival day stays calm.', 'Flight options, meet-and-greet, and private transfers arranged with your stay.', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80', 'Arrange travel', '#contact', 4),
    ('Group & family travel', 'group-family-travel', 'Reunions, celebrations, and office trips without the logistics headache.', 'Room blocks, shared itineraries, and a single point of contact for the whole group.', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=80', 'Plan for a group', '#contact', 5),
    ('Visa guidance', 'visa-guidance', 'Clear document checklists and timing so the trip does not stall at paperwork.', 'We walk you through requirements and timelines for common leisure destinations.', 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=80', 'Ask about visas', '#contact', 6)
) as f(title, slug, summary, description, image_url, cta_label, cta_url, sort_order)
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1 from public.travel_services x where x.site_id = s.id
  );

insert into public.travel_promotions (
  site_id, title, location, summary, image_url, external_url, sort_order
)
select s.id, f.title, f.location, f.summary, f.image_url, f.external_url, f.sort_order
from public.sites s
cross join (
  values
    (
      'Marriott''s Bali Nusa Dua Gardens',
      'Nusa Dua, Bali',
      'Garden villas, a quiet Nusa Dua address, and the kind of stay that makes the flight feel worth it.',
      '/marriott-bali-nusa-dua/hotel-view/dpsmv-exterior-5844_classic-hor.jpg',
      'https://www.marriott.com/en-us/hotels/dpsmv-marriotts-bali-nusa-dua-gardens/overview/',
      1
    ),
    (
      'Marriott''s Mai Khao Resort – Phuket',
      'Mai Khao, Phuket',
      'Spacious apartment living, private plunge-pool options, family activities, and a peaceful setting near Mai Khao Beach.',
      '/marriott-mai-khao-phuket/view/mv-hktpa-exterior-aerial24135-63745_classic-hor.jpg',
      'https://www.marriott.com/en-us/hotels/hktpa-marriotts-mai-khao-resort-phuket/overview/',
      2
    )
) as f(title, location, summary, image_url, external_url, sort_order)
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1 from public.travel_promotions x where x.site_id = s.id
  );

insert into public.travel_promotions (
  site_id, title, location, summary, image_url, external_url, sort_order
)
select
  s.id,
  'Marriott''s Mai Khao Resort – Phuket',
  'Mai Khao, Phuket',
  'Spacious apartment living, private plunge-pool options, family activities, and a peaceful setting near Mai Khao Beach.',
  '/marriott-mai-khao-phuket/view/mv-hktpa-exterior-aerial24135-63745_classic-hor.jpg',
  'https://www.marriott.com/en-us/hotels/hktpa-marriotts-mai-khao-resort-phuket/overview/',
  2
from public.sites s
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1
    from public.travel_promotions x
    where x.site_id = s.id and x.title ilike '%Mai Khao%'
  );

insert into public.travel_gallery (site_id, title, caption, image_url, sort_order)
select s.id, f.title, f.caption, f.image_url, f.sort_order
from public.sites s
cross join (
  values
    ('Bali mornings', 'Nusa Dua light', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80', 1),
    ('Phuket coast', 'Mai Khao', 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=80', 2),
    ('Private pool', 'Villa days', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80', 3),
    ('Open water', 'The reason we go', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', 4),
    ('Temple paths', 'Bali', 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=80', 5),
    ('Evening stay', 'Resort lights', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80', 6)
) as f(title, caption, image_url, sort_order)
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1 from public.travel_gallery x where x.site_id = s.id
  );

insert into public.travel_testimonials (
  site_id, author_name, author_title, quote, rating, sort_order
)
select s.id, f.author_name, f.author_title, f.quote, f.rating, f.sort_order
from public.sites s
cross join (
  values
    ('Angela Reyes', 'Family trip to Bali', 'They handled the villa, the transfers, and every small question before we even thought to ask. Our kids still talk about the pool.', 5, 1),
    ('Miguel Santos', 'Phuket anniversary', 'We wanted Mai Khao without the stress of comparing ten sites. CV sent two clear options, booked it, and stayed reachable on WhatsApp the whole week.', 5, 2),
    ('The Cruz family', 'Three generations, one itinerary', 'Ten years of working with them and it still feels personal. They know who needs a ground-floor room and who wants the sunrise view.', 5, 3)
) as f(author_name, author_title, quote, rating, sort_order)
where s.slug = 'cv-travel-tours'
  and not exists (
    select 1 from public.travel_testimonials x where x.site_id = s.id
  );

-- -----------------------------------------------------------------------------
-- Updated-at trigger
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists travel_content_set_updated_at on public.travel_content;
create trigger travel_content_set_updated_at
before update on public.travel_content
for each row execute function public.set_updated_at();

drop trigger if exists travel_hero_frames_set_updated_at on public.travel_hero_frames;
create trigger travel_hero_frames_set_updated_at
before update on public.travel_hero_frames
for each row execute function public.set_updated_at();

drop trigger if exists travel_services_set_updated_at on public.travel_services;
create trigger travel_services_set_updated_at
before update on public.travel_services
for each row execute function public.set_updated_at();

drop trigger if exists travel_promotions_set_updated_at on public.travel_promotions;
create trigger travel_promotions_set_updated_at
before update on public.travel_promotions
for each row execute function public.set_updated_at();

drop trigger if exists travel_gallery_set_updated_at on public.travel_gallery;
create trigger travel_gallery_set_updated_at
before update on public.travel_gallery
for each row execute function public.set_updated_at();

drop trigger if exists travel_testimonials_set_updated_at on public.travel_testimonials;
create trigger travel_testimonials_set_updated_at
before update on public.travel_testimonials
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.travel_content enable row level security;
alter table public.travel_hero_frames enable row level security;
alter table public.travel_services enable row level security;
alter table public.travel_promotions enable row level security;
alter table public.travel_gallery enable row level security;
alter table public.travel_testimonials enable row level security;
alter table public.travel_inquiries enable row level security;

drop policy if exists "Anyone can read travel content" on public.travel_content;
create policy "Anyone can read travel content"
on public.travel_content
for select
to anon, authenticated
using (true);

drop policy if exists "Members can update travel content" on public.travel_content;
create policy "Members can update travel content"
on public.travel_content
for update
to authenticated
using (public.is_site_member(site_id))
with check (public.is_site_member(site_id));

drop policy if exists "Anyone can read published hero frames" on public.travel_hero_frames;
create policy "Anyone can read published hero frames"
on public.travel_hero_frames
for select
to anon, authenticated
using (is_published = true or public.is_site_member(site_id));

drop policy if exists "Members can write hero frames" on public.travel_hero_frames;
create policy "Members can write hero frames"
on public.travel_hero_frames
for all
to authenticated
using (public.is_site_member(site_id))
with check (public.is_site_member(site_id));

drop policy if exists "Anyone can read published services" on public.travel_services;
create policy "Anyone can read published services"
on public.travel_services
for select
to anon, authenticated
using (is_published = true or public.is_site_member(site_id));

drop policy if exists "Members can write services" on public.travel_services;
create policy "Members can write services"
on public.travel_services
for all
to authenticated
using (public.is_site_member(site_id))
with check (public.is_site_member(site_id));

drop policy if exists "Anyone can read published promotions" on public.travel_promotions;
create policy "Anyone can read published promotions"
on public.travel_promotions
for select
to anon, authenticated
using (is_published = true or public.is_site_member(site_id));

drop policy if exists "Members can write promotions" on public.travel_promotions;
create policy "Members can write promotions"
on public.travel_promotions
for all
to authenticated
using (public.is_site_member(site_id))
with check (public.is_site_member(site_id));

drop policy if exists "Anyone can read published gallery" on public.travel_gallery;
create policy "Anyone can read published gallery"
on public.travel_gallery
for select
to anon, authenticated
using (is_published = true or public.is_site_member(site_id));

drop policy if exists "Members can write gallery" on public.travel_gallery;
create policy "Members can write gallery"
on public.travel_gallery
for all
to authenticated
using (public.is_site_member(site_id))
with check (public.is_site_member(site_id));

drop policy if exists "Anyone can read published testimonials" on public.travel_testimonials;
create policy "Anyone can read published testimonials"
on public.travel_testimonials
for select
to anon, authenticated
using (is_published = true or public.is_site_member(site_id));

drop policy if exists "Members can write testimonials" on public.travel_testimonials;
create policy "Members can write testimonials"
on public.travel_testimonials
for all
to authenticated
using (public.is_site_member(site_id))
with check (public.is_site_member(site_id));

drop policy if exists "Anyone can submit inquiries" on public.travel_inquiries;
create policy "Anyone can submit inquiries"
on public.travel_inquiries
for insert
to anon, authenticated
with check (
  exists (
    select 1 from public.sites s
    where s.id = site_id and s.is_active = true
  )
);

drop policy if exists "Members can read inquiries" on public.travel_inquiries;
create policy "Members can read inquiries"
on public.travel_inquiries
for select
to authenticated
using (public.is_site_member(site_id));

drop policy if exists "Members can update inquiries" on public.travel_inquiries;
create policy "Members can update inquiries"
on public.travel_inquiries
for update
to authenticated
using (public.is_site_member(site_id))
with check (public.is_site_member(site_id));

drop policy if exists "Members can delete inquiries" on public.travel_inquiries;
create policy "Members can delete inquiries"
on public.travel_inquiries
for delete
to authenticated
using (public.is_site_member(site_id));

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

grant select on public.travel_content to anon, authenticated;
grant update on public.travel_content to authenticated;

grant select on public.travel_hero_frames to anon, authenticated;
grant insert, update, delete on public.travel_hero_frames to authenticated;

grant select on public.travel_services to anon, authenticated;
grant insert, update, delete on public.travel_services to authenticated;

grant select on public.travel_promotions to anon, authenticated;
grant insert, update, delete on public.travel_promotions to authenticated;

grant select on public.travel_gallery to anon, authenticated;
grant insert, update, delete on public.travel_gallery to authenticated;

grant select on public.travel_testimonials to anon, authenticated;
grant insert, update, delete on public.travel_testimonials to authenticated;

grant insert on public.travel_inquiries to anon, authenticated;
grant select, update, delete on public.travel_inquiries to authenticated;
