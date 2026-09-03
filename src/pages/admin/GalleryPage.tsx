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
import { deleteGalleryItem, fetchGallery, fetchTravelContent, updateTravelContent, upsertGalleryItem } from '@/services/travelService'
import type { TravelGalleryItem } from '@/types/database'

const emptyItem = {
  title: '',
  caption: '',
  image_url: '',
  sort_order: 1,
  is_published: true,
}

export default function GalleryPage() {
  const { siteId } = useSite()
  const toast = useToast()
  const [heading, setHeading] = useState('')
  const [subheading, setSubheading] = useState('')
  const [items, setItems] = useState<TravelGalleryItem[]>([])
  const [draft, setDraft] = useState(emptyItem)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    if (!siteId) return
    const [content, next] = await Promise.all([fetchTravelContent(siteId), fetchGallery(siteId, false)])
    setHeading(content?.gallery_heading ?? '')
    setSubheading(content?.gallery_subheading ?? '')
    setItems(next)
  }

  useEffect(() => {
    void load().finally(() => setLoading(false))
  }, [siteId])

  if (loading) return <PageLoader label="Loading gallery…" />

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="section-kicker">Photos</p>
        <h1 className="font-display text-4xl">Gallery</h1>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-line bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (!siteId) return
          setSaving(true)
          void updateTravelContent(siteId, { gallery_heading: heading, gallery_subheading: subheading })
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
          if (!siteId || !draft.image_url) {
            toast.error('Upload a photo first.')
            return
          }
          setSaving(true)
          void upsertGalleryItem({ id: editingId ?? undefined, site_id: siteId, ...draft })
            .then(async () => {
              setDraft(emptyItem)
              setEditingId(null)
              await load()
              toast.success('Photo saved')
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to save this photo.')))
            .finally(() => setSaving(false))
        }}
      >
        <h2 className="font-display text-2xl">{editingId ? 'Edit photo' : 'Add photo'}</h2>
        <Input label="Title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        <Input label="Caption" value={draft.caption} onChange={(event) => setDraft({ ...draft, caption: event.target.value })} />
        <Input
          label="Sort order"
          type="number"
          value={draft.sort_order}
          onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })}
        />
        <ImageUpload
          label="Photo"
          value={draft.image_url}
          uploading={uploading}
          onSelect={async (file) => {
            if (!siteId) return
            setUploading(true)
            try {
              setDraft({ ...draft, image_url: await uploadSiteAsset(siteId, 'gallery', file) })
            } catch (error) {
              toast.error(toUserMessage(error, 'Unable to upload this image.'))
            } finally {
              setUploading(false)
            }
          }}
          onRemove={() => setDraft({ ...draft, image_url: '' })}
        />
        <Switch label="Published" checked={draft.is_published} onChange={(checked) => setDraft({ ...draft, is_published: checked })} />
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save photo'}</Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            <img src={item.image_url} alt="" className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between p-3">
              <p className="text-sm font-medium">{item.title || 'Untitled'}</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setEditingId(item.id)
                  setDraft({
                    title: item.title ?? '',
                    caption: item.caption ?? '',
                    image_url: item.image_url,
                    sort_order: item.sort_order,
                    is_published: item.is_published,
                  })
                }}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => setDeleteId(item.id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete this photo?"
        description="It will leave the public gallery."
        busy={saving}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          setSaving(true)
          void deleteGalleryItem(deleteId)
            .then(() => {
              setDeleteId(null)
              return load()
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to delete this photo.')))
            .finally(() => setSaving(false))
        }}
      />
    </div>
  )
}
