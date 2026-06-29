'use client'
import { useEffect } from 'react'

const ASSET = '/work/airpods-pro-film/assets/'

// Client-side behaviour for the AirPods Pro motion case study: scroll-reveal,
// scroll-progress hairline, the canvas/Lottie soundtrack wave, self-wiring
// media (images + videos), the cinema scrubber, and the GSAP block wipes.
export function AirpodsEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: (() => void)[] = []

    document.querySelectorAll<HTMLElement>('.afp-mood-tile').forEach((m, i) => { m.style.transitionDelay = (i * 0.06) + 's' })

    // Reveal observer
    const targets = document.querySelectorAll('.afp-reveal, .afp-subhead, .afp-media')
    if (!('IntersectionObserver' in window) || reduce) {
      targets.forEach(el => el.classList.add('in'))
    } else {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
      }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' })
      targets.forEach(el => obs.observe(el))
      cleanups.push(() => obs.disconnect())
      const onLoad = () => setTimeout(() => {
        document.querySelectorAll('.afp-reveal:not(.in), .afp-subhead:not(.in)').forEach(el => {
          const r = el.getBoundingClientRect()
          if (r.top < (window.innerHeight || 0) * 0.95 && r.bottom > 0) el.classList.add('in')
        })
      }, 500)
      window.addEventListener('load', onLoad)
      cleanups.push(() => window.removeEventListener('load', onLoad))
    }

    // Scroll-progress hairline
    const bar = document.querySelector<HTMLElement>('.afp-progress')
    if (bar) {
      const onScroll = () => {
        const d = document.documentElement
        const max = d.scrollHeight - d.clientHeight
        bar.style.width = (max > 0 ? (d.scrollTop / max) * 100 : 0) + '%'
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      cleanups.push(() => window.removeEventListener('scroll', onScroll))
    }

    // Soundtrack wave: Lottie if assets/wave.json exists, else canvas
    const waveHost = document.getElementById('afp-wave')
    if (waveHost) {
      fetch(ASSET + 'wave.json', { method: 'HEAD' })
        .then(r => { if (r.ok) mountLottieWave(waveHost); else mountCanvasWave(waveHost) })
        .catch(() => mountCanvasWave(waveHost))
    }
    function mountLottieWave(host: HTMLElement) {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js'
      s.onload = () => {
        const lottie = (window as unknown as { lottie?: { loadAnimation: (o: object) => void } }).lottie
        if (lottie) lottie.loadAnimation({ container: host, renderer: 'svg', loop: true, autoplay: !reduce, path: ASSET + 'wave.json' })
        else mountCanvasWave(host)
      }
      s.onerror = () => mountCanvasWave(host)
      document.head.appendChild(s)
    }
    function mountCanvasWave(host: HTMLElement) {
      const canvas = document.createElement('canvas')
      host.appendChild(canvas)
      const ctx = canvas.getContext('2d')!
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      let W = 0, H = 0, ink = '#1a1a1a', accent = '#3d4f3a'
      const readColors = () => {
        const cs = getComputedStyle(document.documentElement)
        ink = (cs.getPropertyValue('--ink') || ink).trim()
        accent = (cs.getPropertyValue('--accent') || accent).trim()
      }
      const resize = () => {
        const r = host.getBoundingClientRect(); W = r.width; H = r.height
        canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr)
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      readColors(); resize()
      window.addEventListener('resize', resize)
      cleanups.push(() => window.removeEventListener('resize', resize))
      const mo = new MutationObserver(readColors)
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      cleanups.push(() => mo.disconnect())
      const mouse = { x: 0.5, tx: 0.5, infl: 0, tinfl: 0 }
      host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); mouse.tx = (e.clientX - r.left) / r.width; mouse.tinfl = 1 })
      host.addEventListener('pointerleave', () => { mouse.tinfl = 0 })
      const toRGB = (c: string): number[] => {
        c = (c || '').trim()
        if (c[0] === '#') { const h = c.slice(1); const n = h.length === 3 ? h.replace(/./g, '$&$&') : h; return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)] }
        const m = c.match(/\d+/g); return m ? m.slice(0, 3).map(Number) : [128, 128, 128]
      }
      const frame = (t: number) => {
        ctx.clearRect(0, 0, W, H)
        mouse.x += (mouse.tx - mouse.x) * 0.06
        mouse.infl += (mouse.tinfl - mouse.infl) * 0.05
        const mx = mouse.x * W
        const iRGB = toRGB(ink), aRGB = toRGB(accent)
        const N = Math.max(26, Math.min(64, Math.round(W / 26)))
        const slot = W / N, bw = slot * 0.44, cy = H / 2, maxH = H * 0.44
        ctx.strokeStyle = ink; ctx.globalAlpha = 0.08; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke(); ctx.globalAlpha = 1
        ctx.lineCap = 'round'
        for (let i = 0; i < N; i++) {
          const cx = (i + 0.5) * slot
          let h = 0.30 + 0.32 * Math.sin(t + i * 0.45) + 0.18 * Math.sin(t * 0.7 + i * 0.9) + 0.12 * Math.sin(t * 1.5 + i * 0.2)
          h = 0.16 + Math.abs(h) * 0.6
          const dn = (cx - mx) / (W * 0.13)
          const near = mouse.infl * Math.exp(-dn * dn)
          h = Math.min(1, h + 0.7 * near)
          const bh = maxH * h
          const mix = Math.min(1, Math.max(0, (h - 0.42) * 1.3) + near)
          const r = Math.round(iRGB[0] + (aRGB[0] - iRGB[0]) * mix)
          const g2 = Math.round(iRGB[1] + (aRGB[1] - iRGB[1]) * mix)
          const b = Math.round(iRGB[2] + (aRGB[2] - iRGB[2]) * mix)
          ctx.strokeStyle = 'rgb(' + r + ',' + g2 + ',' + b + ')'
          ctx.lineWidth = bw
          ctx.globalAlpha = 0.55 + 0.4 * mix
          ctx.shadowBlur = 22 * near; ctx.shadowColor = accent
          ctx.beginPath(); ctx.moveTo(cx, cy - bh + bw / 2); ctx.lineTo(cx, cy + bh - bw / 2); ctx.stroke()
          ctx.shadowBlur = 0; ctx.globalAlpha = 1
        }
      }
      if (reduce) { frame(0.6); return }
      let running = false, t = 0
      const io = new IntersectionObserver(e => { const was = running; running = e[0].isIntersecting; if (running && !was) requestAnimationFrame(loop) }, { threshold: 0.1 })
      io.observe(host)
      cleanups.push(() => io.disconnect())
      function loop() { if (!running) return; t += 0.012; frame(t); requestAnimationFrame(loop) }
    }

    // Self-wiring mood images
    document.querySelectorAll<HTMLElement>('[data-img]').forEach(el => {
      if (el.querySelector('img')) return
      const src = el.getAttribute('data-img')!
      const probe = new Image()
      probe.onload = () => {
        const img = document.createElement('img')
        img.src = src; img.alt = el.getAttribute('data-alt') || ''; img.loading = 'lazy'
        el.appendChild(img); el.classList.add('has-media')
      }
      probe.src = src
    })

    // Cinema scrubber
    function wireCinema(container: HTMLElement, v: HTMLVideoElement) {
      v.muted = true; v.loop = true; v.controls = false; v.preload = 'auto'; v.autoplay = true; v.playsInline = true
      const cbar = document.createElement('div')
      cbar.className = 'afp-scrub is-muted'
      cbar.innerHTML =
        '<button class="afp-scrub-mute" type="button" aria-label="Unmute"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9v6h3.5L13 19V5L7.5 9H4z"/></svg></button><div class="afp-scrub-track"><div class="afp-scrub-fill"></div><div class="afp-scrub-knob"></div></div>'
      container.appendChild(cbar)
      const fill = cbar.querySelector<HTMLElement>('.afp-scrub-fill')!
      const knob = cbar.querySelector<HTMLElement>('.afp-scrub-knob')!
      const track = cbar.querySelector<HTMLElement>('.afp-scrub-track')!
      const muteBtn = cbar.querySelector<HTMLElement>('.afp-scrub-mute')!
      let drag = false
      const apply = (p: number) => { const pct = (p * 100) + '%'; fill.style.width = pct; knob.style.left = pct }
      const seek = (x: number) => { const r = track.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (x - r.left) / r.width)); apply(p); if (v.duration) v.currentTime = p * v.duration }
      v.addEventListener('timeupdate', () => { if (v.duration && !drag) apply(v.currentTime / v.duration) })
      const end = () => { drag = false; cbar.classList.remove('is-dragging') }
      track.addEventListener('pointerdown', e => { drag = true; cbar.classList.add('is-dragging'); try { track.setPointerCapture(e.pointerId) } catch { } seek(e.clientX) })
      track.addEventListener('pointermove', e => { if (drag) seek(e.clientX) })
      track.addEventListener('pointerup', end); window.addEventListener('pointerup', end)
      muteBtn.addEventListener('click', () => { v.muted = !v.muted; cbar.classList.toggle('is-muted', v.muted); muteBtn.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute') })
      let hideTimer: ReturnType<typeof setTimeout> | null = null
      const showBar = () => { cbar.classList.add('afp-scrub-visible'); if (hideTimer) clearTimeout(hideTimer); hideTimer = setTimeout(() => { if (!drag) cbar.classList.remove('afp-scrub-visible') }, 2500) }
      container.addEventListener('pointermove', showBar)
      container.addEventListener('pointerenter', showBar)
      container.addEventListener('pointerleave', () => { if (hideTimer) clearTimeout(hideTimer); if (!drag) cbar.classList.remove('afp-scrub-visible') })
      const forcePlay = () => { v.play().catch(() => setTimeout(() => v.play().catch(() => { }), 500)) }
      v.addEventListener('canplay', forcePlay, { once: true })
      v.addEventListener('loadeddata', forcePlay, { once: true })
      new IntersectionObserver((es, obs2) => { if (es[0].isIntersecting) { forcePlay(); obs2.disconnect() } }, { threshold: 0.01 }).observe(container)
      setTimeout(forcePlay, 1500)
    }

    // Self-wiring videos
    document.querySelectorAll<HTMLElement>('[data-video]').forEach(el => {
      if (el.querySelector('video')) return
      const src = el.getAttribute('data-video')!
      fetch(src, { method: 'HEAD' }).then(r => {
        if (!r.ok) return
        const poster = el.getAttribute('data-poster')
        const v = document.createElement('video')
        v.src = src; v.playsInline = true; if (poster) v.poster = poster
        el.appendChild(v); el.classList.add('has-media')
        if (el.getAttribute('data-player') === 'cinema') { wireCinema(el, v) }
        else { v.autoplay = true; v.muted = true; v.loop = true }
      }).catch(() => { })
    })

    // GSAP stage block wipes — wait for the CDN GSAP + ScrollTrigger.
    // Skipped on phones, where the stages are normal 16:9 players (no scroll-pin)
    // and the block wipe is hidden.
    let tries = 0
    const wireStages = () => {
      if (reduce || window.matchMedia('(max-width: 700px)').matches) return
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger as unknown
      if (!gsap || !ScrollTrigger) { if (tries++ < 40) setTimeout(wireStages, 50); return }
      gsap.registerPlugin(ScrollTrigger)
      document.querySelectorAll('.afp-stage').forEach(stage => {
        gsap.fromTo(stage.querySelectorAll('.afp-stage-blocks span'), { yPercent: -101 }, { yPercent: 0, stagger: 0.14, ease: 'none', scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.7 } })
      })
    }
    const stageTimer = setTimeout(wireStages, 0)
    cleanups.push(() => clearTimeout(stageTimer))

    return () => cleanups.forEach(fn => fn())
  }, [])

  return null
}
