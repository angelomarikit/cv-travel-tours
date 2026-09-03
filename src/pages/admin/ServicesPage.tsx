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
import { deleteService, fetchServices, fetchTravelContent, updateTravelContent, upsertService } from '@/services/travelService'
import { slugify } from '@/utils/slug'
import type { TravelService } from '@/types/database'

const emptyService = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  image_url: '',
  cta_label: 'Inquire',
  cta_url: '#contact',
  sort_order: 1,
  is_published: true,
}

export default function ServicesPage() {
  const { siteId } = useSite()
  const toast = useToast()
  const [heading, setHeading] = useState('')
  const [subheading, setSubheading] = useState('')
  const [items, setItems] = useState<TravelService[]>([])
  const [draft, setDraft] = useState(emptyService)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    if (!siteId) return
    const [content, next] = await Promise.all([fetchTravelContent(siteId), fetchServices(siteId, false)])
    setHeading(content?.services_heading ?? '')
    setSubheading(content?.services_subheading ?? '')
    setItems(next)
  }

  useEffect(() => {
    void load().finally(() => setLoading(false))
  }, [siteId])

  async function saveHeadings(event: FormEvent) {
    event.preventDefault()
    if (!siteId) return
    setSaving(true)
    try {
      await updateTravelContent(siteId, { services_heading: heading, services_subheading: subheading })
      toast.success('Section headings saved')
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to save headings.'))
    } finally {
      setSaving(false)
    }
  }

  async function saveItem(event: FormEvent) {
    event.preventDefault()
    if (!siteId) return
    setSaving(true)
    try {
      await upsertService({
        id: editingId ?? undefined,
        site_id: siteId,
        ...draft,
        slug: draft.slug || slugify(draft.title),
      })
      setDraft(emptyService)
      setEditingId(null)
      await load()
      toast.success('Service saved')
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to save this service.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader label="Loading services…" />

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="section-kicker">Catalog</p>
        <h1 className="font-display text-4xl">Products & services</h1>
      </div>

      <form className="space-y-4 rounded-2xl border border-line bg-white p-5" onSubmit={(event) => void saveHeadings(event)}>
        <Input label="Section heading" value={heading} onChange={(event) => setHeading(event.target.value)} />
        <Textarea label="Section subheading" value={subheading} onChange={(event) => setSubheading(event.target.value)} />
        <Button type="submit" disabled={saving}>Save headings</Button>
      </form>

      <form className="space-y-4 rounded-2xl border border-line bg-white p-5" onSubmit={(event) => void saveItem(event)}>
        <h2 className="font-display text-2xl">{editingId ? 'Edit service' : 'Add service'}</h2>
        <Input
          label="Title"
          value={draft.title}
          onChange={(event) => setDraft({ ...draft, title: event.target.value, slug: slugify(event.target.value) })}
          required
        />
        <Input label="Slug" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} />
        <Textarea label="Summary" value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} />
        <Textarea label="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
        <Input label="Button label" value={draft.cta_label} onChange={(event) => setDraft({ ...draft, cta_label: event.target.value })} />
        <Input label="Button link" value={draft.cta_url} onChange={(event) => setDraft({ ...draft, cta_url: event.target.value })} />
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
              setDraft({ ...draft, image_url: await uploadSiteAsset(siteId, 'services', file) })
            } catch (error) {
              toast.error(toUserMessage(error, 'Unable to upload this image.'))
            } finally {
              setUploading(false)
            }
          }}
          onRemove={() => setDraft({ ...draft, image_url: '' })}
        />
        <Switch label="Published" checked={draft.is_published} onChange={(checked) => setDraft({ ...draft, is_published: checked })} />
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save service'}</Button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
            <img src={item.image_url || '/logo.png'} alt="" className="h-16 w-20 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="truncate text-sm text-muted">{item.summary}</p>
            </div>
            <Button variant="outline" onClick={() => {
              setEditingId(item.id)
              setDraft({
                title: item.title,
                slug: item.slug,
                summary: item.summary ?? '',
                description: item.description ?? '',
                image_url: item.image_url ?? '',
                cta_label: item.cta_label ?? 'Inquire',
                cta_url: item.cta_url ?? '#contact',
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
        title="Delete this service?"
        description="It will be removed from the public showcase."
        busy={saving}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          setSaving(true)
          void deleteService(deleteId)
            .then(() => {
              setDeleteId(null)
              return load()
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to delete this service.')))
            .finally(() => setSaving(false))
        }}
      />
    </div>
  )
}
