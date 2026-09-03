# CV Travel & Tours

React + TypeScript website and admin for **CV Travel & Tours**. Uses the same Supabase project as HM Dormitory and NJMRF, isolated by `VITE_SITE_SLUG=cv-travel-tours`.

Public site: `/`  
Admin: `/admin`

## Local run

1. Run `supabase/migrations/001_travel_schema.sql` in the shared Supabase SQL Editor.
2. Create an admin user and run `supabase/assign-admin.sql`.
3. Copy `.env.example` to `.env.local` and fill in the same URL and publishable key used by the other sites. Keep the slug `cv-travel-tours` unless this tenant was created under a different slug.
4. Install and start:

```powershell
npm install
npm run dev
```

The homepage still previews with fallback content if Supabase is not connected yet.

## Docs

- [Supabase setup](docs/SUPABASE.md)
- [Vercel deployment](docs/VERCEL.md)
- [GitHub repository](docs/GITHUB.md)
- [Implementation notes](docs/IMPLEMENTATION.md)
