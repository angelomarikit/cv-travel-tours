import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/Spinner'
import { useSite } from '@/contexts/SiteContext'
import { useToast } from '@/contexts/ToastContext'
import { toUserMessage } from '@/lib/errors'
import { uploadSiteAsset } from '@/services/storageService'
import { deletePromotion, fetchPromotions, fetchTravelContent, updateTravelContent, upsertPromotion } from '@/services/travelService'
import type { TravelPromotion } from '@/types/database'

const emptyPromo = {
  title: '',
  location: '',
  summary: '',
  image_url: '',
  external_url: '',
  sort_order: 1,
  is_published: true,
}

export default function PromotionsPage() {
  const { siteId } = useSite()
  const toast = useToast()
  const [heading, setHeading] = useState('')
  const [subheading, setSubheading] = useState('')
  const [items, setItems] = useState<TravelPromotion[]>([])
  const [draft, setDraft] = useState(emptyPromo)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    if (!siteId) return
    const [content, next] = await Promise.all([fetchTravelContent(siteId), fetchPromotions(siteId, false)])
    setHeading(content?.promotions_heading ?? '')
    setSubheading(content?.promotions_subheading ?? '')
    setItems(next)
  }

  useEffect(() => {
    void load().finally(() => setLoading(false))
  }, [siteId])

  if (loading) return <PageLoader label="Loading stays…" />

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="section-kicker">Promotions</p>
        <h1 className="font-display text-4xl">Featured stays</h1>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-line bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (!siteId) return
          setSaving(true)
          void updateTravelContent(siteId, { promotions_heading: heading, promotions_subheading: subheading })
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
          void upsertPromotion({ id: editingId ?? undefined, site_id: siteId, ...draft })
            .then(async () => {
              setDraft(emptyPromo)
              setEditingId(null)
              await load()
              toast.success('Stay saved')
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to save this stay.')))
            .finally(() => setSaving(false))
        }}
      >
        <h2 className="font-display text-2xl">{editingId ? 'Edit stay' : 'Add stay'}</h2>
        <Input label="Title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
        <Input label="Location" value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
        <Textarea label="Summary" value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} />
        <Input label="External URL" value={draft.external_url} onChange={(event) => setDraft({ ...draft, external_url: event.target.value })} required />
        <Input
          label="Sort order"
          type="number"
          value={draft.sort_order}
          onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })}
        />
        <ImageUpload
          label="Image"
          value={draft.image_url}
          uploading={uploading}
          onSelect={async (file) => {
            if (!siteId) return
            setUploading(true)
            try {
              setDraft({ ...draft, image_url: await uploadSiteAsset(siteId, 'promotions', file) })
            } catch (error) {
              toast.error(toUserMessage(error, 'Unable to upload this image.'))
            } finally {
              setUploading(false)
            }
          }}
          onRemove={() => setDraft({ ...draft, image_url: '' })}
        />
        <Switch label="Published" checked={draft.is_published} onChange={(checked) => setDraft({ ...draft, is_published: checked })} />
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save stay'}</Button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
            <img src={item.image_url || '/logo.png'} alt="" className="h-16 w-24 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="truncate text-sm text-muted">{item.external_url}</p>
            </div>
            <Button variant="outline" onClick={() => {
              setEditingId(item.id)
              setDraft({
                title: item.title,
                location: item.location ?? '',
                summary: item.summary ?? '',
                image_url: item.image_url ?? '',
                external_url: item.external_url,
                sort_order: item.sort_order,
                is_published: item.is_published,
              })
            }}>
              Edit
            </Button>
            <Button variant="ghost" onClick={() => setDeleteId(item.id)}>Delete</Button>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete this stay?"
        description="The featured card will leave the homepage."
        busy={saving}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          setSaving(true)
          void deletePromotion(deleteId)
            .then(() => {
              setDeleteId(null)
              return load()
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to delete this stay.')))
            .finally(() => setSaving(false))
        }}
      />
    </div>
  )
}
