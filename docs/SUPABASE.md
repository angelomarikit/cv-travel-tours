# Supabase setup — CV Travel & Tours

This app is a **new frontend tenant** on the **same Supabase project** already used by HM Dormitory and NJMRF. It does not create a second database.

Isolation is `site_id` + Row Level Security. The frontend finds its row with `VITE_SITE_SLUG`.

```text
ONE Supabase project
├── sites.slug = hm-dormitory      → HM Dormitory app
├── sites.slug = njmrf-pharmacy    → NJMRF pharmacy app
└── sites.slug = cv-travel-tours   → this travel app
```

If a slug was already created for this client, keep that slug and set `VITE_SITE_SLUG` to match. The default in this repo is `cv-travel-tours`.

## 1. Confirm you are in the shared project

Supabase Dashboard → the same project used by the other sites.

You will reuse:

| Existing object | Purpose |
| --- | --- |
| `sites` | One row per client website |
| `site_members` | Admin / owner / editor users for a site |
| `is_site_member(site_id)` | RLS helper |
| Storage bucket `site-assets` | Public images. Path must start with `{site_id}/...` |

Do **not** put the service role key in this frontend, Vercel, or git.

## 2. Run the travel migration

1. SQL Editor → **New query**
2. Paste all of `supabase/migrations/001_travel_schema.sql`
3. Click **Run**

Confirm the site row:

```sql
select id, name, slug, phone, app_kind, is_active
from public.sites
order by created_at;
```

You should see `cv-travel-tours` with `app_kind = travel`.

Confirm these tables exist:

- `travel_content`
- `travel_hero_frames`
- `travel_services`
- `travel_promotions`
- `travel_gallery`
- `travel_testimonials`
- `travel_inquiries`

## 3. Create the admin user

1. Authentication → Users → **Add user** (email + password). Confirm the email if needed.
2. Open `supabase/assign-admin.sql`
3. Replace `REPLACE_WITH_ADMIN_EMAIL@example.com`
4. Run it

```sql
insert into public.site_members (site_id, user_id, role)
select s.id, u.id, 'owner'
from public.sites s
join auth.users u on lower(u.email) = lower('REPLACE_WITH_ADMIN_EMAIL@example.com')
where s.slug = 'cv-travel-tours'
on conflict (site_id, user_id) do update
set role = excluded.role;
```

This admin can only manage CV Travel & Tours. They cannot see HM Dormitory or pharmacy data.

Public sign-up is **not** required. Visitors send inquiries without an account.

## 4. Environment variables

Copy `.env.example` to `.env.local`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SITE_SLUG=cv-travel-tours
```

| Variable | Where it comes from | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Same value as HM Dormitory / NJMRF | Project Settings → Data API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same publishable / anon key | Never the service role key |
| `VITE_SITE_SLUG` | `cv-travel-tours` | Change only if the ready slug is different |

Vite inlines `VITE_*` at build time. Restart `npm run dev` or redeploy after changing env vars.

## 5. Storage

Reuse the existing public bucket `site-assets`. Uploads from this app go to `{site_id}/logo`, `{site_id}/hero`, `{site_id}/gallery`, and similar folders.

If image upload fails, confirm the bucket exists and that existing storage policies still allow `is_site_member` to write paths that start with that site UUID.

## 6. After go-live

Use `/admin` to replace seed Unsplash photos with the client’s own images, set the logo, Messenger URL, and Open Graph image, then check inquiries on the Inquiries page.
