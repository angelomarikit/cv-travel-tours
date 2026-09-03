import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="section-kicker">404</p>
      <h1 className="mt-3 font-display text-5xl text-ink">This page has wandered off.</h1>
      <p className="mt-3 max-w-md text-muted">The link may be old. Come back to the homepage and plan the next trip from there.</p>
      <Link to="/" className="mt-8">
        <Button>Back home</Button>
      </Link>
    </main>
  )
}
