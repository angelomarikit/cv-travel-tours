import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/ui/Button'
import { useInquiry } from '@/contexts/InquiryContext'
import { useScrolled } from '@/hooks/useScrolled'

const links = [
  { href: '#about', label: 'About' },
  { href: '#marriott-gallery', label: 'Resort Gallery' },
  { href: '#services', label: 'Services' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState(false)
  const { openInquiry } = useInquiry()

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-white transition-all duration-300',
        scrolled ? 'py-2 shadow-[0_12px_35px_-28px_rgba(0,27,77,0.45)]' : 'py-3',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="relative z-10">
          <BrandLogo />
        </a>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/75 transition hover:text-royal"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button onClick={openInquiry}>Plan a trip</Button>
        </div>
        <button
          type="button"
          className="rounded-full border border-line bg-white p-2 lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-navy/40 lg:hidden">
          <div className="absolute inset-y-0 right-0 w-80 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl text-royal">Menu</p>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <Button
              className="mt-8 w-full"
              onClick={() => {
                setOpen(false)
                openInquiry()
              }}
            >
              Plan a trip
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
