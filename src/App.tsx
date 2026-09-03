import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'
import { PageLoader } from '@/components/ui/Spinner'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import HomePage from '@/pages/public/HomePage'
import NotFoundPage from '@/pages/public/NotFoundPage'
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const HeroPage = lazy(() => import('@/pages/admin/HeroPage'))
const AboutPage = lazy(() => import('@/pages/admin/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/admin/ServicesPage'))
const PromotionsPage = lazy(() => import('@/pages/admin/PromotionsPage'))
const GalleryPage = lazy(() => import('@/pages/admin/GalleryPage'))
const ReviewsPage = lazy(() => import('@/pages/admin/ReviewsPage'))
const InquiriesPage = lazy(() => import('@/pages/admin/InquiriesPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))

function Fallback() {
  return <PageLoader label="Loading page…" />
}

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/hero" element={<HeroPage />} />
            <Route path="/admin/about" element={<AboutPage />} />
            <Route path="/admin/services" element={<ServicesPage />} />
            <Route path="/admin/promotions" element={<PromotionsPage />} />
            <Route path="/admin/gallery" element={<GalleryPage />} />
            <Route path="/admin/reviews" element={<ReviewsPage />} />
            <Route path="/admin/inquiries" element={<InquiriesPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
