import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLoader } from '@/components/ui/Spinner'
import { useSite } from '@/contexts/SiteContext'
import { fetchInquiries } from '@/services/travelService'

export default function DashboardPage() {
  const { site, siteId } = useSite()
  const [newCount, setNewCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!siteId) {
      setLoading(false)
      return
    }
    void fetchInquiries(siteId)
      .then((items) => {
        setTotal(items.length)
        setNewCount(items.filter((item) => item.status === 'new').length)
      })
      .finally(() => setLoading(false))
  }, [siteId])

  if (loading) return <PageLoader label="Loading dashboard…" />

  return (
    <div className="space-y-6">
      <div>
        <p className="section-kicker">Overview</p>
        <h1 className="font-display text-4xl text-ink">{site?.name}</h1>
        <p className="mt-2 text-muted">Edit every public section from the left, then refresh the homepage to see it live.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-muted">New inquiries</p>
          <p className="mt-2 font-display text-4xl text-royal">{newCount}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-muted">All inquiries</p>
          <p className="mt-2 font-display text-4xl text-ink">{total}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link to="/admin/inquiries" className="rounded-full bg-royal px-4 py-2 font-semibold text-white">
          Review inquiries
        </Link>
        <Link to="/admin/hero" className="rounded-full border border-line bg-white px-4 py-2 font-semibold">
          Edit hero sequence
        </Link>
        <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-line bg-white px-4 py-2 font-semibold">
          View public site
        </a>
      </div>
    </div>
  )
}
