import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useContent } from '@/contexts/ContentContext'
import { useSite } from '@/contexts/SiteContext'
import { useToast } from '@/contexts/ToastContext'
import { toUserMessage } from '@/lib/errors'
import { submitInquiry } from '@/services/travelService'
import { toWhatsAppLink } from '@/utils/phone'

export function InquiryForm({
  compact = false,
  onSuccess,
}: {
  compact?: boolean
  onSuccess?: () => void
}) {
  const { site, siteId, usingFallback } = useSite()
  const { content } = useContent()
  const toast = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [destination, setDestination] = useState('')
  const [travelDates, setTravelDates] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!siteId || usingFallback) {
      toast.error('Inquiries need Supabase connected. Please message us on WhatsApp instead.')
      return
    }

    setSubmitting(true)
    try {
      await submitInquiry(siteId, {
        full_name: fullName,
        email,
        phone: phone || null,
        destination: destination || null,
        travel_dates: travelDates || null,
        message,
      })
      setFullName('')
      setEmail('')
      setPhone('')
      setDestination('')
      setTravelDates('')
      setMessage('')
      toast.success('Inquiry sent. We will get back to you shortly.')
      onSuccess?.()
    } catch (error) {
      toast.error(toUserMessage(error, 'Unable to send your inquiry.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      className={
        compact
          ? 'space-y-4'
          : 'space-y-4 rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-36px_rgba(0,27,77,0.4)] sm:p-8'
      }
      onSubmit={(event) => void handleSubmit(event)}
    >
      <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Bali, Phuket…"
        />
        <Input
          label="Travel dates"
          value={travelDates}
          onChange={(event) => setTravelDates(event.target.value)}
          placeholder="e.g. Dec 12–19"
        />
      </div>
      <Textarea
        label="Tell us about the trip"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
        placeholder="Who is traveling, what you want the days to feel like, and any must-haves."
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send inquiry'}
        </Button>
        <a href={toWhatsAppLink(content.whatsapp_number || site?.phone)}>
          <Button variant="outline" type="button">
            WhatsApp us
          </Button>
        </a>
      </div>
    </form>
  )
}
