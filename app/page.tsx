'use client'
import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { PageLoader } from '@/components/PageLoader'
import { AmbientGlow } from '@/components/AmbientGlow'
import { CursorFollower } from '@/components/CursorFollower'

export default function HomePage() {
  // initHeroAnimations after loader
  const initHero = useCallback(() => {
    const gsap = (window as unknown as { gsap?: { from: (t: unknown, o: object) => unknown; timeline: (o?: object) => { from: (t: unknown, o: object, p?: string) => unknown } } }).gsap
    const SplitType = (window as unknown as { SplitType?: new (el: Element, opts: object) => { lines: Element[]; words: Element[] } }).SplitType

    if (gsap) {
      const sectionHead = document.querySelector('.section-head')
      const firstCard = document.querySelector('.project-card')
      if (sectionHead) {
        const label = sectionHead.querySelector('.section-label')
        const heading = sectionHead.querySelector('h1')
        const tl = gsap.timeline({ delay: 0.1 })
        if (label) tl.from(label, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' })
        if (heading) tl.from(heading, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        if (firstCard) {
          firstCard.classList.remove('fade-in')
          const media = firstCard.querySelector('.project-media')
          const copy = firstCard.querySelector('.project-copy')
          const tags = firstCard.querySelector('.project-tags')
          if (media) tl.from(media, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
          if (copy) tl.from(copy, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
          if (tags) tl.from(tags, { y: 15, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        }
      }
    }

    if (SplitType && gsap) {
      document.querySelectorAll('.split-text').forEach(el => {
        const text = new SplitType(el, { types: 'lines, words' })
        text.lines.forEach(line => {
          const wrapper = document.createElement('div')
          wrapper.classList.add('line-wrapper')
          Object.assign(wrapper.style, { overflow: 'hidden', display: 'block', paddingTop: '0.1em', marginTop: '-0.1em', paddingBottom: '0.45em', marginBottom: '-0.45em', paddingRight: '0.15em', marginRight: '-0.15em' })
          line.parentNode!.insertBefore(wrapper, line)
          wrapper.appendChild(line)
        })
        gsap.from(text.words, { y: '160%', opacity: 0, duration: 1.1, stagger: 0.035, ease: 'power4.out', delay: 0.08 })
      })
    }

    setTimeout(initScrollAnimations, 400)
  }, [])

  // Scroll animations
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return
    const FADE_SELECTOR = '.project-card, .section-head, .principle-grid article, .experience-list article, .about-body, .case-intro, .case-writing article, .archive article'
    const fadeTargets = document.querySelectorAll<Element>(FADE_SELECTOR)
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          fadeObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -150px 0px' })

    fadeTargets.forEach((el, i) => {
      if (i === 0 && el.classList.contains('project-card')) return
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible')
      } else {
        fadeObserver.observe(el)
      }
    })
  }

  useEffect(() => {
    // Coming-soon locks — these links never navigate
    document.querySelectorAll('[data-soon]').forEach(el => {
      el.addEventListener('click', e => e.preventDefault())
    })

    // Fade-in prep
    const FADE_SELECTOR = '.project-card, .section-head, .principle-grid article, .experience-list article, .about-body, .case-intro, .case-writing article, .archive article'
    document.querySelectorAll(FADE_SELECTOR).forEach(el => el.classList.add('fade-in'))

    // Reveal observer for .bento-reveal
    if ('IntersectionObserver' in window) {
      const cards = document.querySelectorAll('.bento-reveal')
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const d = parseFloat(el.dataset.delay || '0')
            setTimeout(() => el.classList.add('is-visible'), d * 1000)
            obs.unobserve(el)
          }
        })
      }, { threshold: 0.08 })
      document.querySelectorAll<HTMLElement>('.bento-row').forEach(row => {
        row.querySelectorAll<HTMLElement>('.bento-reveal').forEach((c, i) => { c.dataset.delay = (i * 0.12).toFixed(2) })
      })
      document.querySelectorAll<HTMLElement>('.bento-skills.bento-reveal').forEach(c => { c.dataset.delay = '0' })
      document.querySelectorAll<HTMLElement>('.bento-status.bento-reveal, .bento-signal.bento-reveal').forEach((c, i) => { c.dataset.delay = (i * 0.12).toFixed(2) })
      cards.forEach(c => obs.observe(c))
    }

    // Pixel portrait glitch swap
    const stage = document.getElementById('pixel-stage')
    if (stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const sprites = stage.querySelectorAll('.pixel-sprite')
      const swap = () => {
        stage.classList.add('is-glitching')
        setTimeout(() => {
          sprites.forEach(s => s.classList.toggle('is-active'))
          stage.classList.remove('is-glitching')
        }, 560)
      }
      const id = setInterval(swap, 3800)
      return () => clearInterval(id)
    }
  }, [])

  useEffect(() => {
    // Work filter
    const section = document.querySelector('.home-works')
    if (!section) return
    const btns = section.querySelectorAll<HTMLButtonElement>('.works-filter-btn')
    const rows = Array.from(section.querySelectorAll<HTMLElement>('.work-row'))

    const apply = (cat: string) => {
      let i = 0
      rows.forEach(row => {
        const show = cat === 'all' || row.dataset.cat === cat
        row.hidden = !show
        row.classList.toggle('is-first', false)
        if (show) {
          i++
          const idx = row.querySelector('.work-index')
          if (idx) idx.textContent = String(i).padStart(2, '0')
        }
      })
      const firstVisible = rows.find(r => !r.hidden)
      if (firstVisible) firstVisible.classList.add('is-first')
      btns.forEach(b => b.classList.toggle('is-active', b.dataset.filter === cat))
    }

    btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter || 'all')))
    apply('all')

    // Count-up
    if ('IntersectionObserver' in window) {
      const countTargets = document.querySelectorAll<HTMLElement>('.count-up')
      const countObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          const end = Number(target.dataset.count || 0)
          const startedAt = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - startedAt) / 400, 1)
            target.textContent = String(Math.round(progress * end)).padStart(2, '0')
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          countObserver.unobserve(target)
        })
      }, { threshold: 0.6 })
      countTargets.forEach(t => countObserver.observe(t))
    }

    // Reveal targets
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const revealTargets = document.querySelectorAll('.section-head, .principles h1, .experience h2, .about h1, .contact h2')
      revealTargets.forEach(t => t.classList.add('reveal-target'))
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.18 })
      revealTargets.forEach(t => revealObserver.observe(t))
    }
  }, [])

  // Mark the body so CSS hides the shell behind the loader on the very first
  // visit. initHero() is always invoked by PageLoader's onDone (whether the
  // loader plays or is skipped), so it must not be called again here.
  useEffect(() => {
    if (!document.body.classList.contains('has-loaded-before')) {
      document.body.classList.add('has-loader')
    }
    return () => { document.body.classList.remove('has-loader') }
  }, [])

  return (
    <>
      {/* Only show loader on first visit */}
      <PageLoader onDone={initHero} />
      <AmbientGlow />
      <CursorFollower />

      <main id="top" className="page-shell">
        {/* Hero */}
        <section className="home-hero">
          <p className="section-label home-hero-label">Sudhanshu Singh · Interaction Designer · New Delhi</p>
          <h1 id="hero-title" className="split-text">
            I craft digital <em>experiences</em><br />
            that feel right.
          </h1>
          <div className="scroll-hint" aria-hidden="true">
            <span>Scroll</span>
            <div className="scroll-hint-line"></div>
          </div>
        </section>

        {/* About / Bento */}
        <div className="about-bento">
          <div className="bento-hero bento-reveal">
            <div className="bento-hero-text">
              <span className="bento-label">About Me</span>
              <h1>Interaction designer with product thinking and a feel for <em>small moments.</em><span className="terminal-cursor" aria-hidden="true"></span></h1>
            </div>
            <div className="avatar-zone" aria-hidden="true">
              <div className="pixel-stage" id="pixel-stage">
                <img className="pixel-sprite sprite-me is-active" src="/assets/me-pixel.png" alt="" width={49} height={64} />
                <img className="pixel-sprite sprite-vader" src="/assets/vader-pixel.png?v=2" alt="" width={22} height={31} />
              </div>
              <div className="avatar-shadow"></div>
            </div>
          </div>

          <div className="bento-row">
            <div className="bento-card bento-bio bento-reveal">
              <span className="bento-card-label">Who</span>
              <p>I&apos;m studying Interaction Design while working across real product and design contexts. I care about interfaces tuned in the details, the loading state that doesn&apos;t feel like waiting, the transition that makes the next step obvious.</p>
            </div>
            <div className="bento-card bento-now bento-reveal">
              <span className="bento-card-label">Now</span>
              <div className="bento-live">
                <span className="live-dot"></span>
                Currently building
              </div>
              <span className="bento-company">Waysorted</span>
              <p className="bento-role">Co-founder &amp; CPO · AI workflow product<br />Founders.INC · Nvidia Inception Program</p>
            </div>
          </div>

          <div className="bento-card bento-skills bento-reveal">
            <span className="bento-card-label">Skills</span>
            <div className="bento-skills-cols">
              <div className="skills-col">
                <span className="skills-col-head">Design</span>
                <ul>
                  <li>Interaction Design</li>
                  <li>UI / UX</li>
                  <li>Information Architecture</li>
                  <li>User Research</li>
                </ul>
              </div>
              <div className="skills-col">
                <span className="skills-col-head">Craft</span>
                <ul>
                  <li>Motion Design</li>
                  <li>Prototyping</li>
                  <li>Product Thinking</li>
                  <li>Visual Identity</li>
                </ul>
              </div>
              <div className="skills-col">
                <span className="skills-col-head">Tools</span>
                <ul>
                  <li>Figma</li>
                  <li>After Effects</li>
                  <li>Rive</li>
                  <li>Spline · Blender</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bento-row bento-row--flip">
            <div className="bento-card bento-status bento-reveal">
              <span className="bento-card-label">Status</span>
              <div className="status-badge">
                <span className="status-dot"></span>
                <span className="status-badge-text">Open to roles</span>
              </div>
              <p className="status-desc">Available for full-time roles and select freelance work.</p>
              <a href="mailto:sudhanshusingh162004@gmail.com" className="status-cta">Get in touch →</a>
            </div>
            <div className="bento-card bento-impact bento-reveal">
              <span className="bento-card-label">By the Numbers</span>
              <div className="impact-stats">
                <div className="impact-stat">
                  <span className="impact-num">600+</span>
                  <span className="impact-desc">users at launch</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-num">F.INC</span>
                  <span className="impact-desc">Backed by Founders.INC</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-num">79%</span>
                  <span className="impact-desc">rated 4–5 stars</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-num">93%</span>
                  <span className="impact-desc">beta signup rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="story-thread" aria-hidden="true"></div>

        {/* Currently */}
        <section className="home-now" data-story-rise>
          <span className="home-now-label"><span className="live-dot"></span> Currently building</span>
          <h2 className="home-now-title">Waysorted</h2>
          <p className="home-now-desc">Co-founder &amp; CPO, designing an AI workflow product.<br />Founders.INC&ensp;·&ensp;Nvidia Inception Program</p>
        </section>

        <div className="story-thread" aria-hidden="true"></div>

        {/* Selected works */}
        <section className="home-works">
          <p className="story-kicker" data-story-rise>Selected Work</p>
          <div className="works-filter" role="group" aria-label="Filter work by discipline" data-story-rise>
            <button type="button" className="works-filter-btn is-active" data-filter="all">All</button>
            <button type="button" className="works-filter-btn" data-filter="product">Product</button>
            <button type="button" className="works-filter-btn" data-filter="motion">Motion</button>
          </div>
          <ul className="works-list">
            <li className="work-row" data-cat="product">
              <Link href="/work/waysorted">
                <span className="work-index">01</span>
                <span className="work-name">Waysorted</span>
                <span className="work-tag">Product Design · Live</span>
                <span className="work-metric">600+ users</span>
                <span className="work-year">2025–26</span>
                <span className="work-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg></span>
              </Link>
            </li>
            <li className="work-row" data-cat="product">
              <Link href="/work/mazout">
                <span className="work-index">02</span>
                <span className="work-name">Mazout Electric</span>
                <span className="work-tag">Product Design · Client</span>
                <span className="work-metric">First in India</span>
                <span className="work-year">2024</span>
                <span className="work-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg></span>
              </Link>
            </li>
            <li className="work-row" data-cat="motion">
              <Link href="/work/airpods-pro-film">
                <span className="work-index">03</span>
                <span className="work-name">AirPods Pro</span>
                <span className="work-tag">Motion Design</span>
                <span className="work-metric">Built in 8h</span>
                <span className="work-year">2024</span>
                <span className="work-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg></span>
              </Link>
            </li>
            <li className="work-row" data-cat="motion">
              <a href="/work/solace" data-soon>
                <span className="work-index">04</span>
                <span className="work-name">Solace</span>
                <span className="work-tag">UX · Spline 3D</span>
                <span className="work-metric"></span>
                <span className="work-year">2024</span>
                <span className="work-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg></span>
              </a>
            </li>
            <li className="work-row" data-cat="product">
              <a href="/work/daylign" data-soon>
                <span className="work-index">05</span>
                <span className="work-name">Daylign</span>
                <span className="work-tag">iOS · In Progress</span>
                <span className="work-metric"></span>
                <span className="work-year">2025</span>
                <span className="work-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg></span>
              </a>
            </li>
          </ul>
          <Link href="/work" className="works-more" data-story-rise>
            All case studies
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg>
          </Link>
        </section>
      </main>

      {/* Inline styles for bento/home — same as original */}
      <style>{`
        .about-bento { padding-top:clamp(30px,6vh,70px); padding-bottom:clamp(40px,7vh,90px); }
        .bento-hero { display:flex; align-items:flex-end; justify-content:space-between; gap:clamp(20px,4vw,48px); }
        .bento-hero-text { flex:1; min-width:0; }
        .avatar-zone { flex-shrink:0; display:flex; flex-direction:column; align-items:center; padding-bottom:8px; }
        .pixel-stage { position:relative; width:160px; height:192px; animation:avatar-bob 0.9s steps(2) infinite; }
        .pixel-sprite { position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:auto; image-rendering:pixelated; opacity:0; }
        .sprite-me { height:192px; }
        .sprite-vader { height:186px; }
        .pixel-sprite.is-active { opacity:1; }
        .avatar-shadow { width:96px; height:8px; background:radial-gradient(ellipse,rgba(255,255,255,0.12) 0%,transparent 70%); border-radius:50%; margin-top:-2px; animation:shadow-bob 0.9s steps(2) infinite; }
        html[data-theme="light"] .avatar-shadow { background:radial-gradient(ellipse,rgba(0,0,0,0.28) 0%,transparent 70%); }
        @keyframes avatar-bob { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(3px)} }
        @keyframes shadow-bob { 0%,100%{transform:scaleX(1);opacity:1} 50%{transform:scaleX(0.7);opacity:0.5} }
        .is-glitching .pixel-sprite.is-active { animation:glitch-out 0.55s steps(1) both; }
        .is-glitching .pixel-sprite:not(.is-active) { animation:glitch-in 0.55s steps(1) both; }
        @keyframes glitch-out { 0%{opacity:1;transform:translateX(-50%)} 10%{opacity:1;transform:translateX(calc(-50% - 6px));clip-path:inset(8% 0 58% 0);filter:drop-shadow(-3px 0 #ff2a2a) drop-shadow(3px 0 #00e5ff)} 20%{opacity:0} 30%{opacity:1;transform:translateX(calc(-50% + 5px));clip-path:inset(52% 0 12% 0);filter:drop-shadow(3px 0 #ff2a2a) drop-shadow(-3px 0 #00e5ff)} 40%{opacity:0} 52%{opacity:1;transform:translateX(calc(-50% - 4px));clip-path:inset(28% 0 32% 0)} 62%{opacity:0} 74%{opacity:1;transform:translateX(calc(-50% + 3px));clip-path:inset(68% 0 4% 0);filter:drop-shadow(-2px 0 #ff2a2a) drop-shadow(2px 0 #00e5ff)} 82%,100%{opacity:0} }
        @keyframes glitch-in { 0%{opacity:0} 14%{opacity:1;transform:translateX(calc(-50% + 6px));clip-path:inset(36% 0 30% 0);filter:drop-shadow(3px 0 #ff2a2a) drop-shadow(-3px 0 #00e5ff)} 24%{opacity:0} 36%{opacity:1;transform:translateX(calc(-50% - 5px));clip-path:inset(6% 0 66% 0);filter:drop-shadow(-3px 0 #ff2a2a) drop-shadow(3px 0 #00e5ff)} 46%{opacity:0} 60%{opacity:1;transform:translateX(calc(-50% + 4px));clip-path:inset(48% 0 18% 0)} 70%{opacity:0} 84%,100%{opacity:1;transform:translateX(-50%);clip-path:inset(0 0 0 0);filter:none} }
        @media (max-width:600px) { .bento-hero{flex-direction:column-reverse;gap:12px;align-items:flex-start} .pixel-stage{width:120px;height:128px} .sprite-me{height:128px} .sprite-vader{height:124px} .avatar-shadow{width:72px} }
        .bento-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.7s cubic-bezier(0.33,0,0.67,1),transform 0.7s cubic-bezier(0.33,0,0.67,1); }
        .bento-reveal.is-visible { opacity:1; transform:translateY(0); }
        .bento-impact { display:flex; flex-direction:column; justify-content:space-between; }
        .impact-stats { display:grid; grid-template-columns:1fr 1fr; gap:clamp(16px,2.5vw,28px); margin-top:auto; padding-top:clamp(16px,2vw,24px); }
        .impact-stat { display:flex; flex-direction:column; gap:5px; }
        .impact-num { font-size:clamp(1.6rem,3.2vw,2.6rem); font-weight:500; letter-spacing:-0.04em; line-height:1; color:var(--ink); }
        .impact-desc { font-size:0.72rem; text-transform:uppercase; letter-spacing:0.11em; color:var(--muted); }
      `}</style>

      <Script
        id="gsap-story-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `
          function tryInitStory() {
            if (window.gsap && window.ScrollTrigger) {
              var gsap = window.gsap; var ScrollTrigger = window.ScrollTrigger;
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
              gsap.registerPlugin(ScrollTrigger);
              document.querySelectorAll('[data-story-rise]').forEach(function(el) {
                gsap.from(el, {y:40,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true}});
              });
              gsap.from('.work-row', {y:26,opacity:0,duration:0.7,ease:'power3.out',stagger:0.09,scrollTrigger:{trigger:'.works-list',start:'top 84%',once:true}});
              document.querySelectorAll('.story-thread').forEach(function(el) {
                gsap.fromTo(el,{scaleY:0},{scaleY:1,ease:'none',transformOrigin:'top center',scrollTrigger:{trigger:el,start:'top 90%',end:'bottom 55%',scrub:0.4}});
              });
              window.addEventListener('load', function() { ScrollTrigger.refresh(); });
            } else { setTimeout(tryInitStory, 200); }
          }
          tryInitStory();
        ` }}
      />
    </>
  )
}
