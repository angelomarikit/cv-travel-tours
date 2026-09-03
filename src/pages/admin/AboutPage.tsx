import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/Spinner'
import { useSite } from '@/contexts/SiteContext'
import { useToast } from '@/contexts/ToastContext'
import { toUserMessage } from '@/lib/errors'
import { fetchTravelContent, updateTravelContent } from '@/services/travelService'

export default function AboutPage() {
  const { siteId } = useSite()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aboutHeading, setAboutHeading] = useState('')
  const [aboutBody, setAboutBody] = useState('')
  const [years, setYears] = useState(10)
  const [missionHeading, setMissionHeading] = useState('Mission')
  const [missionBody, setMissionBody] = useState('')
  const [visionHeading, setVisionHeading] = useState('Vision')
  const [visionBody, setVisionBody] = useState('')

  useEffect(() => {
    if (!siteId) return
    void fetchTravelContent(siteId)
      .then((content) => {
        if (!content) return
        setAboutHeading(content.about_heading ?? '')
        setAboutBody(content.about_body ?? '')
        setYears(content.years_in_business)
        setMissionHeading(content.mission_heading ?? 'Mission')
        setMissionBody(content.mission_body ?? '')
        setVisionHeading(content.vision_heading ?? 'Vision')
        setVisionBody(content.vision_body ?? '')
      })
      .finally(() => setLoading(false))
  }, [siteId])

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (!siteId) return
    setSaving(true)
    try {
      await updateTravelContent(siteId, {
        about_heading: aboutHeading,
        about_body: aboutBody,
        years_in_business: years,
        mission_heading: missionHeading,
        mission_body: missionBody,
        vision_heading: visionHeading,
        vision_body: visionBody,
      })
      toast.success('About, mission, and vision saved')
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to save this section.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader label="Loading about…" />

  return (
    <form className="mx-auto max-w-3xl space-y-5" onSubmit={(event) => void handleSave(event)}>
      <div>
        <p className="section-kicker">Story</p>
        <h1 className="font-display text-4xl">About, mission, vision</h1>
      </div>
      <Input label="About heading" value={aboutHeading} onChange={(event) => setAboutHeading(event.target.value)} />
      <Textarea label="About body" value={aboutBody} onChange={(event) => setAboutBody(event.target.value)} />
      <Input
        label="Years in business"
        type="number"
        value={years}
        onChange={(event) => setYears(Number(event.target.value))}
      />
      <Input label="Mission heading" value={missionHeading} onChange={(event) => setMissionHeading(event.target.value)} />
      <Textarea label="Mission" value={missionBody} onChange={(event) => setMissionBody(event.target.value)} />
      <Input label="Vision heading" value={visionHeading} onChange={(event) => setVisionHeading(event.target.value)} />
      <Textarea label="Vision" value={visionBody} onChange={(event) => setVisionBody(event.target.value)} />
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save story'}</Button>
    </form>
  )
}
