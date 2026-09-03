import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Select } from '@/components/ui/Select'
import { PageLoader } from '@/components/ui/Spinner'
import { useSite } from '@/contexts/SiteContext'
import { useToast } from '@/contexts/ToastContext'
import { toUserMessage } from '@/lib/errors'
import { deleteInquiry, fetchInquiries, updateInquiryStatus } from '@/services/travelService'
import type { InquiryStatus, TravelInquiry } from '@/types/database'

const statuses: InquiryStatus[] = ['new', 'read', 'replied', 'archived']

export default function InquiriesPage() {
  const { siteId } = useSite()
  const toast = useToast()
  const [items, setItems] = useState<TravelInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    if (!siteId) return
    setItems(await fetchInquiries(siteId))
  }

  useEffect(() => {
    void load().finally(() => setLoading(false))
  }, [siteId])

  if (loading) return <PageLoader label="Loading inquiries…" />

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="section-kicker">Inbox</p>
        <h1 className="font-display text-4xl">Inquiries</h1>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-8 text-muted">No inquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{item.full_name}</p>
                  <p className="text-sm text-muted">{item.email}{item.phone ? ` · ${item.phone}` : ''}</p>
                </div>
                <Select
                  label="Status"
                  value={item.status}
                  onChange={(event) => {
                    const status = event.target.value as InquiryStatus
                    void updateInquiryStatus(item.id, status)
                      .then(() => load())
                      .catch((error) => toast.error(toUserMessage(error, 'Unable to update status.')))
                  }}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
              <p className="mt-3 text-sm text-ink">
                <span className="font-medium">Destination:</span> {item.destination || '—'}
                {item.travel_dates ? ` · ${item.travel_dates}` : ''}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.message}</p>
              <div className="mt-4 flex justify-between text-xs text-muted">
                <span>{new Date(item.created_at).toLocaleString()}</span>
                <Button variant="ghost" onClick={() => setDeleteId(item.id)}>Delete</Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete this inquiry?"
        description="This cannot be undone."
        busy={busy}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          setBusy(true)
          void deleteInquiry(deleteId)
            .then(() => {
              setDeleteId(null)
              return load()
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to delete this inquiry.')))
            .finally(() => setBusy(false))
        }}
      />
    </div>
  )
}
