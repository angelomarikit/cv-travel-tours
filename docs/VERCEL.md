# Deploy CV Travel & Tours on Vercel

The public site is a Vite single-page app. `vercel.json` already rewrites all routes to `index.html` so `/admin` and deep links work.

## Before you deploy

1. The travel SQL has been run on the shared Supabase project. See [SUPABASE.md](SUPABASE.md).
2. The site slug exists and is active.
3. You have the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` used by the other sites.
4. The repo is on GitHub. See [GITHUB.md](GITHUB.md).

## First deploy

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New… → Project** and import this repository.
3. Framework preset should detect **Vite**.
4. Build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add environment variables (Production, Preview, and Development):

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SITE_SLUG=cv-travel-tours
```

6. Deploy.

Open:

- `https://your-domain.vercel.app/` — public site
- `https://your-domain.vercel.app/admin` — staff login

## Custom domain

Vercel → Project → Settings → Domains → add `cvtravelandtours.com` or the client’s domain.

Then update:

- `index.html` canonical URL
- Admin → Settings → SEO title, description, and social share image
- Supabase Auth → URL configuration:
  - **Site URL:** the production domain
  - **Redirect URLs:** `https://your-domain/` and `https://your-domain/admin`

## Social sharing preview

Facebook, Instagram, and iMessage read Open Graph tags. After deploy:

1. Upload a 1200×630 share image in Admin → Settings.
2. Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter/X Card Validator](https://cards-dev.twitter.com/validator).

## Redeploy

Push to the connected GitHub branch. Vercel builds automatically.

If you only changed environment variables: Project → Settings → Environment Variables → save → Deployments → Redeploy. Vite bakes `VITE_*` into the build, so a new deploy is required.

## Common issues

| Symptom | Fix |
| --- | --- |
| Blank page on `/admin` refresh | Confirm `vercel.json` rewrites are present |
| “Website is not configured” | Slug mismatch or SQL not run |
| Images fail to upload | Storage path / `site-assets` policy |
| Wrong site content | `VITE_SITE_SLUG` is not `cv-travel-tours` |
| Env change did nothing | Redeploy after changing `VITE_*` vars |
