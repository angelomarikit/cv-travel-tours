import { useEffect, useRef, useState } from 'react'

export function useScrollProgress() {
  const ref = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(0)
      return
    }

    let frame = 0
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!node) return
        const rect = node.getBoundingClientRect()
        const total = node.offsetHeight - window.innerHeight
        if (total <= 0) {
          setProgress(0)
          return
        }
        const next = Math.min(1, Math.max(0, -rect.top / total))
        setProgress(next)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, progress }
}
