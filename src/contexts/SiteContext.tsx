import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_SITE } from '@/data/defaults'
import { getEnv, isSupabaseConfigured } from '@/lib/env'
import { fetchSiteBySlug } from '@/services/siteService'
import type { Site } from '@/types/database'

interface SiteContextValue {
  site: Site | null
  siteId: string | null
  siteSlug: string
  loading: boolean
  error: string | null
  usingFallback: boolean
  refreshSite: () => Promise<void>
}

const SiteContext = createContext<SiteContextValue | undefined>(undefined)

export function SiteProvider({ children }: { children: ReactNode }) {
  const { siteSlug } = getEnv()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const loadSite = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured()) {
      setSite(DEFAULT_SITE)
      setUsingFallback(true)
      setLoading(false)
      return
    }

    try {
      const nextSite = await fetchSiteBySlug(siteSlug)
      setSite(nextSite)
      setUsingFallback(false)
    } catch (loadError) {
      setSite(DEFAULT_SITE)
      setUsingFallback(true)
      setError(loadError instanceof Error ? loadError.message : 'Unable to load this website.')
    } finally {
      setLoading(false)
    }
  }, [siteSlug])

  useEffect(() => {
    void loadSite()
  }, [loadSite])

  const value = useMemo<SiteContextValue>(
    () => ({
      site,
      siteId: site && !usingFallback ? site.id : null,
      siteSlug,
      loading,
      error,
      usingFallback,
      refreshSite: loadSite,
    }),
    [site, siteSlug, loading, error, usingFallback, loadSite],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSite must be used within SiteProvider')
  }
  return context
}
