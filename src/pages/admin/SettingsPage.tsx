import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/Spinner'
import { useSite } from '@/contexts/SiteContext'
import { useToast } from '@/contexts/ToastContext'
import { toUserMessage } from '@/lib/errors'
import { updateSite } from '@/services/siteService'
import { uploadSiteAsset } from '@/services/storageService'
import { fetchTravelContent, updateTravelContent } from '@/services/travelService'

export default function SettingsPage() {
  const { site, siteId, refreshSite } = useSite()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [name, setName] = useState(site?.name ?? '')
  const [phone, setPhone] = useState(site?.phone ?? '')
  const [email, setEmail] = useState(site?.email ?? '')
  const [address, setAddress] = useState(site?.address ?? '')
  const [shortDescription, setShortDescription] = useState(site?.short_description ?? '')
  const [logoUrl, setLogoUrl] = useState(site?.logo_url ?? '/logo.png')
  const [heroUrl, setHeroUrl] = useState(site?.hero_image_url ?? '')
  const [buildingUrl, setBuildingUrl] = useState(site?.building_image_url ?? '')
  const [facebookUrl, setFacebookUrl] = useState(site?.facebook_url ?? '')
  const [messengerUrl, setMessengerUrl] = useState(site?.messenger_url ?? '')
  const [mapsEmbed, setMapsEmbed] = useState(site?.google_maps_embed_url ?? '')
  const [mapsDirections, setMapsDirections] = useState(site?.google_maps_directions_url ?? '')
  const [instagramHandle, setInstagramHandle] = useState('@cvtravelandtours')
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/cvtravelandtours')
  const [whatsappNumber, setWhatsappNumber] = useState('09669887477')
  const [contactHeading, setContactHeading] = useState('')
  const [contactSubheading, setContactSubheading] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [ogImageUrl, setOgImageUrl] = useState('')

  useEffect(() => {
    if (!siteId) {
      setLoading(false)
      return
    }
    void fetchTravelContent(siteId)
      .then((content) => {
        if (!content) return
        setInstagramHandle(content.instagram_handle ?? '')
        setInstagramUrl(content.instagram_url ?? '')
        setWhatsappNumber(content.whatsapp_number ?? '')
        setContactHeading(content.contact_heading ?? '')
        setContactSubheading(content.contact_subheading ?? '')
        setSeoTitle(content.seo_title ?? '')
        setSeoDescription(content.seo_description ?? '')
        setOgImageUrl(content.og_image_url ?? '')
      })
      .finally(() => setLoading(false))
  }, [siteId])

  async function upload(kind: 'logo' | 'hero' | 'building' | 'og', file: File) {
    if (!siteId) return
    setUploading(kind)
    try {
      const url = await uploadSiteAsset(siteId, kind, file)
      if (kind === 'logo') setLogoUrl(url)
      if (kind === 'hero') setHeroUrl(url)
      if (kind === 'building') setBuildingUrl(url)
      if (kind === 'og') setOgImageUrl(url)
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to upload this image.'))
    } finally {
      setUploading(null)
    }
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (!siteId) return
    setSaving(true)
    try {
      await updateSite(siteId, {
        name,
        phone,
        email: email || null,
        address,
        short_description: shortDescription,
        logo_url: logoUrl || null,
        hero_image_url: heroUrl || null,
        building_image_url: buildingUrl || null,
        facebook_url: facebookUrl || null,
        messenger_url: messengerUrl || null,
        google_maps_embed_url: mapsEmbed || null,
        google_maps_directions_url: mapsDirections || null,
      })
      await updateTravelContent(siteId, {
        instagram_handle: instagramHandle,
        instagram_url: instagramUrl,
        whatsapp_number: whatsappNumber,
        contact_heading: contactHeading,
        contact_subheading: contactSubheading,
        seo_title: seoTitle,
        seo_description: seoDescription,
        og_image_url: ogImageUrl || null,
      })
      await refreshSite()
      toast.success('Settings saved')
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to save settings.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader label="Loading settings…" />

  return (
    <form className="mx-auto max-w-3xl space-y-6" onSubmit={(event) => void handleSave(event)}>
      <div>
        <p className="section-kicker">Site</p>
        <h1 className="font-display text-4xl">Settings</h1>
      </div>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-2xl">Business</h2>
        <Input label="Business name" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input label="Address" value={address} onChange={(event) => setAddress(event.target.value)} />
        <Textarea label="Short description" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} />
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-2xl">Brand images</h2>
        <ImageUpload label="Logo" value={logoUrl} fit="contain" uploading={uploading === 'logo'} onSelect={(file) => void upload('logo', file)} />
        <ImageUpload label="About image" value={buildingUrl} uploading={uploading === 'building'} onSelect={(file) => void upload('building', file)} />
        <ImageUpload label="Fallback hero image" value={heroUrl} uploading={uploading === 'hero'} onSelect={(file) => void upload('hero', file)} />
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-2xl">Social & chat</h2>
        <Input label="WhatsApp number" value={whatsappNumber} onChange={(event) => setWhatsappNumber(event.target.value)} />
        <Input label="Instagram handle" value={instagramHandle} onChange={(event) => setInstagramHandle(event.target.value)} />
        <Input label="Instagram URL" value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} />
        <Input label="Facebook URL" value={facebookUrl} onChange={(event) => setFacebookUrl(event.target.value)} />
        <Input label="Messenger URL" value={messengerUrl} onChange={(event) => setMessengerUrl(event.target.value)} placeholder="https://m.me/yourpage" />
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-2xl">Maps & contact copy</h2>
        <Input label="Google Maps embed URL" value={mapsEmbed} onChange={(event) => setMapsEmbed(event.target.value)} />
        <Input label="Google Maps directions URL" value={mapsDirections} onChange={(event) => setMapsDirections(event.target.value)} />
        <Input label="Contact heading" value={contactHeading} onChange={(event) => setContactHeading(event.target.value)} />
        <Textarea label="Contact subheading" value={contactSubheading} onChange={(event) => setContactSubheading(event.target.value)} />
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-2xl">SEO & sharing preview</h2>
        <Input label="SEO title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
        <Textarea label="SEO description" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} />
        <ImageUpload label="Social share image" value={ogImageUrl} uploading={uploading === 'og'} onSelect={(file) => void upload('og', file)} />
      </section>

      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
    </form>
  )
}
