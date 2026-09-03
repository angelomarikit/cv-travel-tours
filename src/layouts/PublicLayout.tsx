import { Outlet } from 'react-router-dom'
import { FaqChatbot } from '@/components/public/FaqChatbot'
import { Footer } from '@/components/public/Footer'
import { Navbar } from '@/components/public/Navbar'
import { PlanTripModal } from '@/components/public/PlanTripModal'
import { Seo } from '@/components/Seo'
import { InquiryProvider } from '@/contexts/InquiryContext'

export function PublicLayout() {
  return (
    <InquiryProvider>
      <div className="min-h-screen bg-white">
        <Seo />
        <Navbar />
        <Outlet />
        <Footer />
        <FaqChatbot />
        <PlanTripModal />
      </div>
    </InquiryProvider>
  )
}
