'use client'
import { useEffect } from 'react'

// Client-side behaviour for the Mazout case study: scroll-reveal, self-wiring
// placeholder images, and the website carousel. Runs after mount so the
// server-rendered DOM is guaranteed present.
export function MazoutEffects() {
  useEffect(() => {
    // Section scroll-in reveal
    const targets = document.querySelectorAll('.reveal')
    let revealObs: IntersectionObserver | null = null
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(el => el.classList.add('is-visible'))
    } else {
      revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObs!.unobserve(entry.target)
          }
        })
      }, { threshold: 0.12 })
      targets.forEach(el => revealObs!.observe(el))
    }

    // Self-wiring placeholder images
    document.querySelectorAll('.ph[data-label]').forEach(ph => {
      if (ph.querySelector('img')) return
      const label = ph.getAttribute('data-label')
      if (!label || !/\.(png|jpe?g|webp|gif|avif)$/i.test(label)) return
      const src = label.includes('/') ? '/work/mazout/' + label : '/work/mazout/assets/' + label
      const probe = new Image()
      probe.onload = () => {
        const img = document.createElement('img')
        img.src = src
        img.alt = ph.getAttribute('data-alt') || ''
        img.loading = 'lazy'
        ph.classList.remove('is-empty')
        ph.appendChild(img)
      }
      probe.src = src
    })

    // Website carousel — clickable dots + swipe sync
    const carouselCleanups: (() => void)[] = []
    document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(car => {
      const track = car.querySelector<HTMLElement>('.web-track')
      const slides = Array.from(car.querySelectorAll('.web-slide'))
      const dots = Array.from(car.querySelectorAll<HTMLButtonElement>('.web-dot'))
      if (!track || !slides.length || !dots.length) return
      const setActive = (i: number) => dots.forEach((d, di) => d.classList.toggle('is-active', di === i))
      dots.forEach((dot, i) => {
        const onClick = () => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
        dot.addEventListener('click', onClick)
        carouselCleanups.push(() => dot.removeEventListener('click', onClick))
      })
      let raf = 0
      const onScroll = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const i = Math.round(track.scrollLeft / track.clientWidth)
          setActive(Math.max(0, Math.min(slides.length - 1, i)))
        })
      }
      track.addEventListener('scroll', onScroll, { passive: true })
      carouselCleanups.push(() => track.removeEventListener('scroll', onScroll))
    })

    return () => {
      revealObs?.disconnect()
      carouselCleanups.forEach(fn => fn())
    }
  }, [])

  return null
}
