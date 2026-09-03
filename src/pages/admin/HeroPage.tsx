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
import { updateSite } from '@/services/siteService'
import { uploadSiteAsset } from '@/services/storageService'
import { deleteHeroFrame, fetchHeroFrames, upsertHeroFrame } from '@/services/travelService'
import type { TravelHeroFrame } from '@/types/database'

const emptyFrame = {
  title: '',
  caption: '',
  image_url: '',
  sort_order: 1,
  is_published: true,
}

export default function HeroPage() {
  const { site, siteId, refreshSite } = useSite()
  const toast = useToast()
  const [heading, setHeading] = useState(site?.hero_heading ?? '')
  const [subheading, setSubheading] = useState(site?.hero_subheading ?? '')
  const [frames, setFrames] = useState<TravelHeroFrame[]>([])
  const [draft, setDraft] = useState(emptyFrame)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    if (!siteId) return
    const next = await fetchHeroFrames(siteId, false)
    setFrames(next)
  }

  useEffect(() => {
    void load().finally(() => setLoading(false))
  }, [siteId])

  async function saveIntro(event: FormEvent) {
    event.preventDefault()
    if (!siteId) return
    setSaving(true)
    try {
      await updateSite(siteId, { hero_heading: heading, hero_subheading: subheading })
      await refreshSite()
      toast.success('Hero copy saved')
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to save hero copy.'))
    } finally {
      setSaving(false)
    }
  }

  async function saveFrame(event: FormEvent) {
    event.preventDefault()
    if (!siteId || !draft.image_url) {
      toast.error('Upload a frame image first.')
      return
    }
    setSaving(true)
    try {
      await upsertHeroFrame({
        id: editingId ?? undefined,
        site_id: siteId,
        ...draft,
      })
      setDraft(emptyFrame)
      setEditingId(null)
      await load()
      toast.success('Hero frame saved')
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to save this frame.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader label="Loading hero…" />

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="section-kicker">Hero</p>
        <h1 className="font-display text-4xl">Scroll-linked sequence</h1>
      </div>

      <form className="space-y-4 rounded-2xl border border-line bg-white p-5" onSubmit={(event) => void saveIntro(event)}>
        <Input label="Fallback heading" value={heading} onChange={(event) => setHeading(event.target.value)} />
        <Textarea label="Fallback subheading" value={subheading} onChange={(event) => setSubheading(event.target.value)} />
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save hero copy'}</Button>
      </form>

      <form className="space-y-4 rounded-2xl border border-line bg-white p-5" onSubmit={(event) => void saveFrame(event)}>
        <h2 className="font-display text-2xl">{editingId ? 'Edit frame' : 'Add frame'}</h2>
        <Input label="Title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
        <Textarea label="Caption" value={draft.caption} onChange={(event) => setDraft({ ...draft, caption: event.target.value })} />
        <Input
          label="Sort order"
          type="number"
          value={draft.sort_order}
          onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })}
        />
        <ImageUpload
          label="Frame image"
          value={draft.image_url}
          uploading={uploading}
          onSelect={async (file) => {
            if (!siteId) return
            setUploading(true)
            try {
              setDraft({ ...draft, image_url: await uploadSiteAsset(siteId, 'hero', file) })
            } catch (error) {
              toast.error(toUserMessage(error, 'Unable to upload this image.'))
            } finally {
              setUploading(false)
            }
          }}
          onRemove={() => setDraft({ ...draft, image_url: '' })}
        />
        <Switch
          label="Published"
          checked={draft.is_published}
          onChange={(checked) => setDraft({ ...draft, is_published: checked })}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save frame'}</Button>
          {editingId ? (
            <Button variant="ghost" onClick={() => {
              setEditingId(null)
              setDraft(emptyFrame)
            }}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {frames.map((frame) => (
          <div key={frame.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
            <img src={frame.image_url} alt="" className="h-16 w-24 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{frame.title}</p>
              <p className="truncate text-sm text-muted">{frame.caption}</p>
            </div>
            <Button variant="outline" onClick={() => {
              setEditingId(frame.id)
              setDraft({
                title: frame.title,
                caption: frame.caption ?? '',
                image_url: frame.image_url,
                sort_order: frame.sort_order,
                is_published: frame.is_published,
              })
            }}>
              Edit
            </Button>
            <Button variant="ghost" onClick={() => setDeleteId(frame.id)}>Delete</Button>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete this frame?"
        description="It will disappear from the homepage sequence."
        busy={saving}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          setSaving(true)
          void deleteHeroFrame(deleteId)
            .then(() => {
              setDeleteId(null)
              return load()
            })
            .catch((error) => toast.error(toUserMessage(error, 'Unable to delete this frame.')))
            .finally(() => setSaving(false))
        }}
      />
    </div>
  )
}
