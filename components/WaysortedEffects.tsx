'use client'
import { useEffect } from 'react'

// Client-side behaviour for the Waysorted case study: scroll-reveal and the
// autoplaying demo video with an Apple-style glass scrubber + mute toggle.
export function WaysortedEffects() {
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

    // In Motion video — autoplay (muted, looped) + glass scrubber/mute toggle
    const frame = document.getElementById('motion-frame')
    const v = document.getElementById('demo-video') as HTMLVideoElement | null
    let hideTimer: ReturnType<typeof setTimeout> | null = null
    if (frame && v) {
      v.muted = true; v.loop = true; v.controls = false; v.playsInline = true; v.preload = 'auto'; v.autoplay = true

      const bar = document.createElement('div')
      bar.className = 'afp-scrub is-muted'
      bar.innerHTML =
        '<button class="afp-scrub-mute" type="button" aria-label="Unmute"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9v6h3.5L13 19V5L7.5 9H4z"/></svg></button>'
        + '<div class="afp-scrub-track"><div class="afp-scrub-fill"></div><div class="afp-scrub-knob"></div></div>'
      frame.appendChild(bar)
      const fill = bar.querySelector<HTMLElement>('.afp-scrub-fill')!
      const knob = bar.querySelector<HTMLElement>('.afp-scrub-knob')!
      const track = bar.querySelector<HTMLElement>('.afp-scrub-track')!
      const muteBtn = bar.querySelector<HTMLElement>('.afp-scrub-mute')!
      let drag = false
      const apply = (p: number) => { const pct = (p * 100) + '%'; fill.style.width = pct; knob.style.left = pct }
      const seek = (x: number) => { const r = track.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (x - r.left) / r.width)); apply(p); if (v.duration) v.currentTime = p * v.duration }
      v.addEventListener('timeupdate', () => { if (v.duration && !drag) apply(v.currentTime / v.duration) })
      const end = () => { drag = false; bar.classList.remove('is-dragging') }
      track.addEventListener('pointerdown', e => { drag = true; bar.classList.add('is-dragging'); try { track.setPointerCapture(e.pointerId) } catch { } seek(e.clientX) })
      track.addEventListener('pointermove', e => { if (drag) seek(e.clientX) })
      track.addEventListener('pointerup', end)
      window.addEventListener('pointerup', end)
      muteBtn.addEventListener('click', () => { v.muted = !v.muted; bar.classList.toggle('is-muted', v.muted); muteBtn.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute') })

      const showBar = () => { bar.classList.add('afp-scrub-visible'); if (hideTimer) clearTimeout(hideTimer); hideTimer = setTimeout(() => { if (!drag) bar.classList.remove('afp-scrub-visible') }, 2500) }
      frame.addEventListener('pointermove', showBar)
      frame.addEventListener('pointerenter', showBar)
      frame.addEventListener('pointerleave', () => { if (hideTimer) clearTimeout(hideTimer); if (!drag) bar.classList.remove('afp-scrub-visible') })

      const forcePlay = () => { v.play().catch(() => setTimeout(() => v.play().catch(() => { }), 500)) }
      v.addEventListener('canplay', forcePlay, { once: true })
      v.addEventListener('loadeddata', forcePlay, { once: true })
      new IntersectionObserver((es, obs2) => { if (es[0].isIntersecting) { forcePlay(); obs2.disconnect() } }, { threshold: 0.2 }).observe(frame)
      setTimeout(forcePlay, 1200)
    }

    return () => {
      revealObs?.disconnect()
      if (hideTimer) clearTimeout(hideTimer)
      if (v) v.pause()
    }
  }, [])

  return null
}
