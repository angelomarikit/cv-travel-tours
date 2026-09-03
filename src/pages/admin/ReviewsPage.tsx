import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/Spinner'
import { useSite } from '@/contexts/SiteContext'
import { useToast } from '@/contexts/ToastContext'
import { toUserMessage } from '@/lib/errors'
import { deleteTestimonial, fetchTestimonials, fetchTravelContent, updateTravelContent, upsertTestimonial } from '@/services/travelService'
import type { TravelTestimonial } from '@/types/database'

const emptyReview = {
  author_name: '',
  author_title: '',
  quote: '',
  rating: 5,
  sort_order: 1,
  is_published: true,
}

export default function ReviewsPage() {
  const { siteId } = useSite()
  const toast = useToast()
  const [heading, setHeading] = useState('')
  const [subheading, setSubheading] = useState('')
  const [items, setItems] = useState<TravelTestimonial[]>([])
  const [draft, setDraft] = useState(emptyReview)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    if (!siteId) return
    const [content, next] = await Promise.all([fetchTravelContent(siteId), fetchTestimonials(siteId, false)])
    setHeading(content?.reviews_heading ?? '')
    setSubheading(content?.reviews_subheading ?? '')
    setItems(next)
  }

  useEffect(() => {
    void load().finally(() => setLoading(false))
  }, [siteId])

  if (loading) return <PageLoader label="Loading reviews…" />

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="section-kicker">Social proof</p>
        <h1 className="font-display text-4xl">Reviews</h1>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-line bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (!siteId) return
          setSaving(true)
          void updateTravelContent(siteId, { reviews_heading: heading, reviews_subheading: subheading })
            .then(() => toast.success('Headings saved'))
            .catch((error) => toast.error(toUserMessage(error, 'Unable to save headings.')))
            .finally(() => setSaving(false))
        }}
      >
        <Input label="Section heading" value={heading} onChange={(event) => setHeading(event.target.value)} />
        <Textarea label="Section subheading" value={subheading} onChange={(event) => setSubheading(event.target.value)} />
        <Button type="submit" disabled={saving}>Save headings</Button>
      </form>

      <form
        className="space-y-4 rounded-2xl border border-line bg-white p-5"
        onSubmit={(event: FormEvent) => {
          event.preventDefault()
          if (!siteId) return
          setSaving(true)
          void upsertTestimonial({ id: editingId ?? undefined, site_id: siteId, ...draft })
            .then(async () => {
              setDraft(emptyReview)
              setEditingId(null)
              await load()
              toast.success('Review saved')
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to save this review.')))
            .finally(() => setSaving(false))
        }}
      >
        <h2 className="font-display text-2xl">{editingId ? 'Edit review' : 'Add review'}</h2>
        <Input label="Name" value={draft.author_name} onChange={(event) => setDraft({ ...draft, author_name: event.target.value })} required />
        <Input label="Trip or title" value={draft.author_title} onChange={(event) => setDraft({ ...draft, author_title: event.target.value })} />
        <Textarea label="Quote" value={draft.quote} onChange={(event) => setDraft({ ...draft, quote: event.target.value })} required />
        <Input
          label="Rating"
          type="number"
          min={1}
          max={5}
          value={draft.rating}
          onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })}
        />
        <Input
          label="Sort order"
          type="number"
          value={draft.sort_order}
          onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })}
        />
        <Switch label="Published" checked={draft.is_published} onChange={(checked) => setDraft({ ...draft, is_published: checked })} />
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save review'}</Button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="font-medium">{item.author_name}</p>
            <p className="mt-2 text-sm text-muted">“{item.quote}”</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" onClick={() => {
                setEditingId(item.id)
                setDraft({
                  author_name: item.author_name,
                  author_title: item.author_title ?? '',
                  quote: item.quote,
                  rating: item.rating,
                  sort_order: item.sort_order,
                  is_published: item.is_published,
                })
              }}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setDeleteId(item.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete this review?"
        description="It will leave the public testimonials section."
        busy={saving}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          setSaving(true)
          void deleteTestimonial(deleteId)
            .then(() => {
              setDeleteId(null)
              return load()
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to delete this review.')))
            .finally(() => setSaving(false))
        }}
      />
    </div>
  )
}
