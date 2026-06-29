'use client'
import { useEffect } from 'react'

export function AmbientGlow() {
  useEffect(() => {
    const glow = document.querySelector<HTMLElement>('.ambient-glow')
    if (!glow) return
    const onMove = (e: MouseEvent) => {
      // Use GSAP if available, otherwise direct style
      const g = (window as unknown as { gsap?: { to: (el: Element, opts: object) => void } }).gsap
      if (g) {
        g.to(glow, { x: e.clientX, y: e.clientY, duration: 1.5, ease: 'power3.out' })
      } else {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return <div className="ambient-glow"></div>
}
