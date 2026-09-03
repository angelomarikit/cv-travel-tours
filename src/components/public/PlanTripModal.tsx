import { useEffect } from 'react'
import { X } from 'lucide-react'
import { InquiryForm } from '@/components/public/InquiryForm'
import { useInquiry } from '@/contexts/InquiryContext'

export function PlanTripModal() {
  const { open, closeInquiry } = useInquiry()

  useEffect(() => {
    if (!open) return

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeInquiry()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, closeInquiry])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-navy/55 backdrop-blur-[2px]" aria-label="Close plan a trip" onClick={closeInquiry} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-trip-title"
        className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(0,21,51,0.55)] sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Plan a trip</p>
            <h2 id="plan-trip-title" className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              Tell us where you want to go.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Share a few details and we will prepare options that fit your dates, budget, and company.
            </p>
          </div>
          <button type="button" className="rounded-full border border-line p-2 text-ink" aria-label="Close" onClick={closeInquiry}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <InquiryForm compact onSuccess={closeInquiry} />
      </div>
    </div>
  )
}
