'use client'
import { useEffect, useRef } from 'react'
import { CursorFollower } from '@/components/CursorFollower'

export default function ThinkingPage() {
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Count-up
    if ('IntersectionObserver' in window) {
      const countTargets = document.querySelectorAll<HTMLElement>('.count-up')
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const end = Number(el.dataset.count || 0)
          const startedAt = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - startedAt) / 400, 1)
            el.textContent = String(Math.round(p * end)).padStart(2, '0')
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.unobserve(el)
        })
      }, { threshold: 0.6 })
      countTargets.forEach(t => obs.observe(t))
    }

    // Hero animation. The hero label + h1 carry data-hero="pending" so CSS hides
    // them on first paint (no flash). GSAP then animates them in with explicit
    // fromTo values; if GSAP never loads we just drop the attribute to show them.
    const heroEl = document.querySelector<HTMLElement>('.thinking-hero')
    const label = document.querySelector<HTMLElement>('.thinking-hero .section-label')
    const h1El = document.querySelector<HTMLElement>('.thinking-hero h1')
    const revealHero = () => heroEl?.setAttribute('data-hero', 'done')
    let heroTries = 0
    const runHero = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { revealHero(); return }
      const gsap = window.gsap
      if (!gsap) {
        if (heroTries++ < 40) { setTimeout(runHero, 50); return }
        revealHero()
        return
      }
      // fromTo immediately renders the hidden start state inline, so dropping the
      // attribute can't cause a flash — the elements stay hidden, then animate in.
      const tl = gsap.timeline({ delay: 0.1 })
      if (label) tl.fromTo(label, { y: 20, opacity: 0 }, { y: 0, opacity: 0.4, duration: 0.7, ease: 'power3.out' })
      if (h1El) tl.fromTo(h1El, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.4')
      revealHero()
    }
    const heroTimer = setTimeout(runHero, 0)

    // Glitch headline
    const headline = headlineRef.current
    if (headline) {
      headline.classList.add('glitch-text')
      headline.dataset.text = headline.innerText
      const fireGlitch = () => {
        headline.classList.remove('is-glitching')
        void headline.offsetWidth
        headline.classList.add('is-glitching')
        headline.style.filter = 'brightness(1.05)'
        setTimeout(() => {
          headline.classList.remove('is-glitching')
          headline.style.filter = ''
        }, 520)
        setTimeout(fireGlitch, 3000 + Math.random() * 5000)
      }
      const glitchTimer = setTimeout(fireGlitch, 2000 + Math.random() * 1500)
      headline.style.cursor = 'crosshair'
      const onHeadlineClick = () => {
        headline.classList.remove('is-glitching')
        void headline.offsetWidth
        headline.classList.add('is-glitching')
        setTimeout(() => headline.classList.remove('is-glitching'), 520)
      }
      headline.addEventListener('click', onHeadlineClick)
      return () => {
        clearTimeout(heroTimer)
        clearTimeout(glitchTimer)
        headline.removeEventListener('click', onHeadlineClick)
      }
    }
    return () => clearTimeout(heroTimer)
  }, [])

  useEffect(() => {
    // Cursor spotlight on principle cards
    const cleanups: (() => void)[] = []
    document.querySelectorAll<HTMLElement>('.principle-card').forEach(card => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%')
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%')
      }
      card.addEventListener('mousemove', onMove)
      cleanups.push(() => card.removeEventListener('mousemove', onMove))
    })

    // Scramble on hover for principle titles
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&!?'
    document.querySelectorAll<HTMLElement>('.principle-title').forEach(el => {
      const original = el.textContent || ''
      let timer: ReturnType<typeof setInterval> | null = null
      const onEnter = () => {
        if (timer) clearInterval(timer)
        const len = original.length
        const resolved = new Set<number>()
        let frame = 0
        const totalFrames = 18
        timer = setInterval(() => {
          frame++
          const toResolve = Math.floor((frame / totalFrames) * len)
          for (let i = 0; i < toResolve; i++) resolved.add(i)
          let out = ''
          for (let i = 0; i < len; i++) {
            if (original[i] === ' ' || original[i] === '-') { out += original[i]; continue }
            out += resolved.has(i) ? original[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
          }
          el.textContent = out
          if (resolved.size >= len) { if (timer) clearInterval(timer); el.textContent = original }
        }, 22)
      }
      const onLeave = () => { if (timer) clearInterval(timer); el.textContent = original }
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave) })
    })

    // Timeline stagger on scroll
    if ('IntersectionObserver' in window) {
      const items = document.querySelectorAll('.timeline-item')
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) } })
      }, { threshold: 0.2 })
      items.forEach(el => obs.observe(el))
      cleanups.push(() => obs.disconnect())
    }

    // Principle cards fade in
    if ('IntersectionObserver' in window) {
      const cards = document.querySelectorAll('.principle-card')
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) } })
      }, { threshold: 0.1 })
      cards.forEach(el => obs.observe(el))
      cleanups.push(() => obs.disconnect())
    }

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <>
      <div className="thinking-scanlines" aria-hidden="true"></div>
      <CursorFollower />
      <main className="page-shell">
        <div className="thinking-hero" data-hero="pending">
          <p className="section-label"><span className="count-up" data-count={4}>04</span> / How I Think<span className="terminal-cursor" aria-hidden="true"></span></p>
          <h1 id="thinking-title" ref={headlineRef}>I design the parts<br />people notice only<br />when they go wrong.</h1>
        </div>

        <section className="thinking-principles" aria-label="Design principles">
          <span className="principles-label">Core principles</span>
          <div className="principle-cards">
            <div className="principle-card">
              <span className="card-index">01</span>
              <div className="card-body">
                <span className="principle-title">Behavior before screens</span>
                <p className="principle-body">I start with what the product needs to do, then shape the interface around it.</p>
              </div>
              <span className="principle-num" aria-hidden="true">01</span>
              <div className="principle-spotlight"></div>
            </div>
            <div className="principle-card">
              <span className="card-index">02</span>
              <div className="card-body">
                <span className="principle-title">Motion as feedback</span>
                <p className="principle-body">Motion should explain state, direction, and consequence, not decorate.</p>
              </div>
              <span className="principle-num" aria-hidden="true">02</span>
              <div className="principle-spotlight"></div>
            </div>
            <div className="principle-card">
              <span className="card-index">03</span>
              <div className="card-body">
                <span className="principle-title">Controlled complexity</span>
                <p className="principle-body">Good systems are precise about when detail should appear and when it should hide.</p>
              </div>
              <span className="principle-num" aria-hidden="true">03</span>
              <div className="principle-spotlight"></div>
            </div>
            <div className="principle-card">
              <span className="card-index">04</span>
              <div className="card-body">
                <span className="principle-title">Micro-moments matter</span>
                <p className="principle-body">Loading, confirmation, recovery, and transitions decide how a product feels.</p>
              </div>
              <span className="principle-num" aria-hidden="true">04</span>
              <div className="principle-spotlight"></div>
            </div>
          </div>
        </section>

        <section className="thinking-signal" aria-label="Experience">
          <span className="signal-label"><span className="count-up" data-count={5}>05</span> / Signal</span>
          <h2 className="signal-headline">A product-minded design practice, shaped across teams and contexts.</h2>
          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-year">2025 – Now</span>
              <div className="timeline-content">
                <span className="timeline-company">Waysorted</span>
                <p className="timeline-desc">Product strategy, UX, systems, and motion for an AI workflow product.</p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-year">2025</span>
              <div className="timeline-content">
                <span className="timeline-company">Gen AI Summit</span>
                <p className="timeline-desc">Creative leadership across digital, print, stage, and motion assets.</p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-year">2024</span>
              <div className="timeline-content">
                <span className="timeline-company">Mazout Electric</span>
                <p className="timeline-desc">Mobile app interface from scratch and visual identity direction.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        body[data-page="thinking"] .page-section { border-bottom:none; padding-top:clamp(80px,10vw,140px); padding-bottom:clamp(60px,8vw,100px); }
        .thinking-scanlines { position:fixed; inset:0; z-index:99; pointer-events:none; background:repeating-linear-gradient(to bottom,transparent 0px,transparent 2px,var(--scanline-color) 2px,var(--scanline-color) 4px); animation:scanline-drift 16s linear infinite,crt-flicker 0.15s infinite; opacity:0.85; }
        @keyframes scanline-drift { from{background-position:0 0} to{background-position:0 300px} }
        @keyframes crt-flicker { 0%{opacity:0.78} 50%{opacity:0.85} 100%{opacity:0.80} }
        .thinking-hero { text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:70vh; padding:clamp(140px,18vh,200px) var(--pad) clamp(60px,8vw,100px); max-width:var(--max); margin:0 auto; }
        .thinking-hero .section-label { color:var(--ink); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.4; margin-bottom:28px; }
        .thinking-hero h1 { font-size:clamp(2.2rem,5.5vw,4.2rem); font-weight:400; line-height:1.1; letter-spacing:-0.02em; color:var(--ink); max-width:820px; margin:0 auto; }
        /* Hidden on first paint so the GSAP entrance doesn't flash visible→hidden */
        .thinking-hero[data-hero="pending"] .section-label,
        .thinking-hero[data-hero="pending"] h1 { opacity:0; }
        .glitch-text { position:relative; display:block; }
        .glitch-text::before,.glitch-text::after { content:attr(data-text); position:absolute; inset:0; opacity:0; pointer-events:none; white-space:pre-wrap; color:var(--ink); }
        .glitch-text.is-glitching { animation:glitch-main 0.4s steps(2) forwards; }
        .glitch-text.is-glitching::before { opacity:0.85; color:var(--glitch-color-1); animation:glitch-r 0.4s steps(5) forwards; transform:translateX(-5px); mix-blend-mode:var(--glitch-blend); }
        .glitch-text.is-glitching::after { opacity:0.8; color:var(--glitch-color-2); animation:glitch-b 0.4s steps(5) forwards; transform:translateX(5px); mix-blend-mode:var(--glitch-blend); }
        @keyframes glitch-main { 0%{transform:translateX(0) skewX(0)} 10%{transform:translateX(-6px) skewX(-2deg)} 20%{transform:translateX(4px) skewX(1deg)} 30%{transform:translateX(-2px) skewX(0deg)} 40%{transform:translateX(5px) skewX(-1.5deg)} 50%{transform:translateX(-4px) skewX(1.5deg)} 60%{transform:translateX(3px) skewX(0deg)} 70%,100%{transform:translateX(0) skewX(0)} }
        @keyframes glitch-r { 0%{clip-path:inset(12% 0 85% 0);transform:translate(-5px,-2px);opacity:0.9} 20%{clip-path:inset(40% 0 43% 0);transform:translate(3px,2px);opacity:0.9} 40%{clip-path:inset(75% 0 15% 0);transform:translate(-3px,-3px);opacity:0.9} 60%{clip-path:inset(30% 0 62% 0);transform:translate(4px,1px);opacity:0.9} 80%{clip-path:inset(85% 0 5% 0);transform:translate(-2px,3px);opacity:0.9} 100%{clip-path:inset(0 0 100% 0);transform:translate(0);opacity:0} }
        @keyframes glitch-b { 0%{clip-path:inset(80% 0 10% 0);transform:translate(5px,2px);opacity:0.9} 20%{clip-path:inset(5% 0 78% 0);transform:translate(-3px,-2px);opacity:0.9} 40%{clip-path:inset(60% 0 25% 0);transform:translate(2px,3px);opacity:0.9} 60%{clip-path:inset(15% 0 80% 0);transform:translate(-4px,-1px);opacity:0.9} 80%{clip-path:inset(45% 0 45% 0);transform:translate(3px,-2px);opacity:0.9} 100%{clip-path:inset(0 0 100% 0);transform:translate(0);opacity:0} }
        .terminal-cursor { display:inline-block; width:7px; height:0.85em; background:currentColor; margin-left:5px; vertical-align:middle; opacity:0.7; animation:term-blink 1.1s step-end infinite; }
        @keyframes term-blink { 0%,100%{opacity:0.7} 50%{opacity:0} }
        .thinking-principles { max-width:var(--max); margin:0 auto; padding:clamp(20px,4vw,60px) var(--pad) clamp(60px,8vw,100px); }
        .principles-label { font-size:11px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.4; margin-bottom:clamp(32px,5vw,56px); display:block; text-align:left; color:var(--ink); }
        .principle-cards { display:flex; flex-direction:column; gap:0; }
        .principle-card { position:relative; display:grid; grid-template-columns:56px 1fr; align-items:center; padding:clamp(36px,5vw,68px) 0; border-top:1px solid var(--line); overflow:hidden; cursor:crosshair; background:transparent; transition:background 0.4s ease; }
        .principle-card:last-child { border-bottom:1px solid var(--line); }
        .principle-card:hover { background:transparent; transform:none; animation:none; }
        .principle-card::before { display:none; }
        .card-index { font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); opacity:0.5; align-self:flex-start; padding-top:6px; }
        .card-body { position:relative; z-index:1; }
        .principle-title { font-size:clamp(1.5rem,3vw,2.5rem); font-weight:500; color:var(--ink); letter-spacing:-0.025em; line-height:1.1; margin-bottom:10px; display:block; transition:letter-spacing 0.4s ease; }
        .principle-card:hover .principle-title { letter-spacing:-0.04em; }
        .principle-body { font-size:0.95rem; line-height:1.65; color:var(--muted); margin:0; max-width:520px; position:relative; z-index:1; text-align:left; }
        .principle-num { position:absolute; right:-0.04em; top:50%; transform:translateY(-50%); font-size:clamp(8rem,20vw,22rem); font-weight:800; line-height:0.85; letter-spacing:-0.06em; color:var(--ink); opacity:0.03; pointer-events:none; user-select:none; display:block; margin:0; transition:opacity 0.5s ease,transform 0.5s ease; }
        .principle-card:hover .principle-num { opacity:0.07; transform:translateY(-50%) scale(1.04); }
        .principle-spotlight { position:absolute; inset:0; pointer-events:none; background:radial-gradient(circle 280px at var(--mx,-200%) var(--my,-200%),var(--accent) 0%,transparent 100%); opacity:0; transition:opacity 0.4s ease; }
        .principle-card:hover .principle-spotlight { opacity:0.08; }
        .thinking-signal { max-width:var(--max); margin:0 auto; padding:clamp(40px,6vw,80px) var(--pad) clamp(80px,10vw,140px); text-align:center; }
        .signal-label { font-size:11px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.4; margin-bottom:20px; display:block; color:var(--ink); }
        .signal-headline { font-size:clamp(1.4rem,3vw,2rem); font-weight:400; letter-spacing:-0.02em; line-height:1.2; color:var(--ink); max-width:640px; margin:0 auto clamp(48px,7vw,80px); }
        .timeline { --col-1:100px; --gap:32px; --line-pos:calc(var(--col-1) + (var(--gap)/2)); display:flex; flex-direction:column; gap:0; max-width:640px; margin:0 auto; text-align:left; position:relative; }
        .timeline::before { content:''; position:absolute; left:var(--line-pos); top:0; bottom:0; width:1px; background:var(--line); }
        .timeline-item { display:grid; grid-template-columns:var(--col-1) 1fr; gap:0 var(--gap); padding:clamp(20px,3vw,32px) 0; opacity:0; transform:translateY(20px); transition:opacity 0.6s ease,transform 0.6s ease; }
        .timeline-item.is-visible { opacity:1; transform:translateY(0); }
        .timeline-item:nth-child(2){transition-delay:0.1s} .timeline-item:nth-child(3){transition-delay:0.2s}
        .timeline-year { font-size:11px; letter-spacing:0.08em; color:var(--muted); padding-top:4px; text-align:right; }
        .timeline-content { position:relative; }
        .timeline-content::before { content:''; position:absolute; left:calc(var(--gap)/-2); transform:translateX(-50%); top:8px; width:6px; height:6px; border-radius:50%; background:var(--accent); border:2px solid var(--bg); box-shadow:0 0 0 1px var(--accent); }
        .timeline-company { font-size:1rem; font-weight:500; color:var(--ink); display:block; margin-bottom:6px; letter-spacing:-0.01em; }
        .timeline-desc { font-size:0.88rem; color:var(--muted); margin:0; line-height:1.55; max-width:none; text-align:left; }
      `}</style>
    </>
  )
}
