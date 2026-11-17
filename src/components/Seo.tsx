import { useEffect } from 'react'
import { useContent } from '@/contexts/ContentContext'
import { useSite } from '@/contexts/SiteContext'

export function Seo() {
  const { site } = useSite()
  const { content } = useContent()

  useEffect(() => {
    const title = content.seo_title || site?.name || 'CV Travel & Tours'
    const description =
      content.seo_description ||
      site?.short_description ||
      'CV Travel & Tours — a decade of trusted journeys from Quezon City.'
    const image = content.og_image_url || site?.logo_url || '/logo.png'

    document.title = title
    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: site?.name ?? 'CV Travel & Tours',
      description,
      image,
      telephone: site?.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site?.address,
        addressLocality: 'Quezon City',
        addressCountry: 'PH',
      },
      sameAs: [
        site?.facebook_url || 'https://www.facebook.com/profile.php?id=61594024377319',
        content.instagram_url || 'https://www.instagram.com/cvtravelandtours/',
      ].filter(Boolean),
    }

    let script = document.getElementById('cv-jsonld')
    if (!script) {
      script = document.createElement('script')
      script.id = 'cv-jsonld'
      script.setAttribute('type', 'application/ld+json')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
  }, [site, content])

  return null
}

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}
