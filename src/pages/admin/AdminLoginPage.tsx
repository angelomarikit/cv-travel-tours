import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Images,
  Lock,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageLoader, Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/contexts/AuthContext'
import { useSite } from '@/contexts/SiteContext'
import { marriottHeroImages } from '@/data/marriottGallery'
import { supabase } from '@/lib/supabase'
import { fetchSiteMembership, signOut } from '@/services/authService'
import { toUserMessage } from '@/lib/errors'

const highlights = [
  { icon: Sparkles, label: 'Hero frames & storytelling' },
  { icon: Images, label: 'Resort gallery and stays' },
  { icon: MessageSquare, label: 'Guest inquiries in one inbox' },
]

export default function AdminLoginPage() {
  const { siteId, loading: siteLoading, usingFallback } = useSite()
  const { user, isSiteAdmin, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (siteLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <PageLoader label="Preparing the admin desk…" />
      </div>
    )
  }

  if (user && isSiteAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!siteId) {
      setError('Connect Supabase and confirm VITE_SITE_SLUG before signing in.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email, password)
      const { data } = await supabase.auth.getUser()
      const membership = data.user ? await fetchSiteMembership(data.user.id, siteId) : null
      if (!membership) {
        await signOut()
        setError('This account is not an administrator for CV Travel & Tours.')
        return
      }
      navigate('/admin/dashboard')
    } catch (submitError) {
      setError(toUserMessage(submitError, 'Unable to sign in.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src={marriottHeroImages[0] ?? '/logo.png'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/92 via-navy/70 to-royal/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(0,59,149,0.55),transparent_55%)]" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <BrandLogo size="header" light />

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-white/85 uppercase backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Staff access only
            </p>
            <h1 className="mt-6 max-w-lg font-display text-5xl leading-[1.05] text-white xl:text-6xl">
              The desk behind the journeys.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">
              Sign in to manage everything guests see — from hero frames and resort galleries to the inquiries
              waiting for a reply.
            </p>

            <ul className="mt-10 space-y-3.5">
              {highlights.map((item) => (
                <li key={item.label} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
            CV Travel &amp; Tours · Content management
          </p>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="pointer-events-none absolute inset-0 swoosh" />

        <div className="relative w-full max-w-md">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-royal"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </a>

          <div className="mt-8 lg:hidden">
            <BrandLogo size="header" />
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_28px_70px_-45px_rgba(0,27,77,0.5)] sm:p-8">
            <p className="section-kicker">Admin portal</p>
            <h2 className="mt-3 font-display text-4xl text-ink">Welcome back</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Enter your administrator credentials to open the dashboard.
            </p>

            {usingFallback ? (
              <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-mist px-4 py-3 text-sm text-muted">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
                <p className="leading-relaxed">
                  This slug is not live in Supabase yet. Run{' '}
                  <code className="rounded bg-white px-1 py-0.5 text-[0.8em] text-ink">
                    supabase/migrations/001_travel_schema.sql
                  </code>{' '}
                  on the shared project, confirm{' '}
                  <code className="rounded bg-white px-1 py-0.5 text-[0.8em] text-ink">
                    VITE_SITE_SLUG=cv-travel-tours
                  </code>
                  , then refresh.
                </p>
              </div>
            ) : null}

            <form className="mt-7 space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              <div className="relative">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@cvtravelandtours.com"
                  className="pl-11"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <Mail className="pointer-events-none absolute bottom-3.5 left-4 h-4 w-4 text-muted" />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-11 pr-12"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Lock className="pointer-events-none absolute bottom-3.5 left-4 h-4 w-4 text-muted" />
                <button
                  type="button"
                  className="absolute right-2 bottom-1.5 rounded-xl p-2 text-muted transition hover:bg-mist hover:text-royal"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              ) : null}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-royal" />
            Protected area. Access is limited to CV Travel &amp; Tours administrators.
          </p>
        </div>
      </section>
    </main>
  )
}
