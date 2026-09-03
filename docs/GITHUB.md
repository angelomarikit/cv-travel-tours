# Put CV Travel & Tours on GitHub

Use this when the folder is ready to become a remote repository.

## 1. Check git locally

In PowerShell, from this project folder:

```powershell
git status
```

If git is not initialized yet:

```powershell
git init
git add .
git commit -m "Add CV Travel & Tours site and admin"
```

Do **not** commit `.env.local`. It is already in `.gitignore`.

## 2. Create the GitHub repository

### Option A — GitHub website

1. Sign in at [github.com](https://github.com).
2. **New repository**.
3. Name it `cv-travel-tours` (or the client’s preferred name).
4. Leave it empty — no README, no `.gitignore`, no license.
5. Copy the repo URL.

Then:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR-USER/cv-travel-tours.git
git push -u origin main
```

### Option B — GitHub CLI

```powershell
gh auth login
gh repo create cv-travel-tours --private --source=. --remote=origin --push
```

Private is recommended until the client asks for a public marketing repo.

## 3. Connect GitHub to Vercel

1. Vercel → **Add New… → Project**
2. Import the GitHub repo
3. Add the env vars from [VERCEL.md](VERCEL.md)
4. Deploy

Later pushes to `main` deploy production. Pull requests get Preview URLs.

## 4. Team access

- GitHub: invite collaborators on the repo
- Vercel: invite the same people to the Vercel project
- Supabase: do **not** give staff the service role key. Create them as Auth users and add them with `supabase/assign-admin.sql`

## 5. Safe commit checklist

- [ ] `.env.local` is not staged
- [ ] Service role key is nowhere in the repo
- [ ] Logo and public assets are in `public/`
- [ ] `VITE_SITE_SLUG` in `.env.example` is `cv-travel-tours`
