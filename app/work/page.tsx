'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { CursorFollower } from '@/components/CursorFollower'

export default function WorkPage() {
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

    // The section-head + project cards carry `fade-in` straight from the JSX so
    // they're hidden on first paint (no flash). The footer columns stay permanent.
    const FADE = '.project-card, .section-head'

    // Scroll fade-in observer (skips first card — it's handled by the GSAP hero)
    function initScrollAnimations() {
      if (!('IntersectionObserver' in window)) return
      const fadeTargets = document.querySelectorAll(FADE)
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

    // GSAP hero entrance for the section-head + first project card.
    // Wait for the CDN GSAP to be ready (loaded afterInteractive), the way the
    // original page does by loading GSAP synchronously before its script.
    function initHeroAnimations() {
      const gsap = window.gsap
      const firstCard = document.querySelector('.project-card')
      if (gsap) {
        const sectionHead = document.querySelector('.section-head')
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
      } else if (firstCard) {
        // No GSAP available — reveal the first card directly so it never stays hidden
        firstCard.classList.add('is-visible')
      }
      setTimeout(initScrollAnimations, 400)
    }

    let tries = 0
    const startHero = () => {
      if (window.gsap || tries > 40) { initHeroAnimations(); return }
      tries++
      setTimeout(startHero, 50)
    }
    const heroTimer = setTimeout(startHero, 100)

    // Reveal-target observer for the section head
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const revealTargets = document.querySelectorAll('.section-head')
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

    // Coming-soon locks — these links never navigate
    document.querySelectorAll('[data-soon]').forEach(el => {
      el.addEventListener('click', e => e.preventDefault())
    })

    return () => clearTimeout(heroTimer)
  }, [])

  return (
    <>
      <CursorFollower />
      <main className="page-shell">
        <section className="work page-section" aria-labelledby="work-title">
          <div className="section-head fade-in">
            <p className="section-label"><span className="count-up" data-count={2}>00</span> / Selected Work</p>
            <h1 id="work-title">Projects as proof of product thinking.</h1>
          </div>

          <div className="project-stack">
            <Link className="project-card fade-in" href="/work/waysorted">
              <div className="project-media">
                <div className="media-placeholder">
                  <img src="/work/waysorted/assets/hero.png" alt="Waysorted Figma plugin case study" />
                </div>
              </div>
              <div className="project-copy">
                <div className="project-content-left">
                  <h2>waysorted</h2>
                  <p>A live Figma plugin that unifies the designer&apos;s workflow. CPO.</p>
                  <div className="project-tags" aria-label="Project tags">
                    <span>Product Design</span>
                    <span>Live</span>
                  </div>
                  <span className="project-metric">600+ users · 170k+ reach</span>
                </div>
                <div className="project-content-right">
                  <span className="project-index">01</span>
                  <span className="project-year">2025–26</span>
                </div>
              </div>
            </Link>

            <Link className="project-card fade-in" href="/work/mazout">
              <div className="project-media">
                <div className="media-placeholder">
                  <img src="/work/mazout/assets/hero.png" alt="Mazout X1 EV powertrain app and website case study" />
                </div>
              </div>
              <div className="project-copy">
                <div className="project-content-left">
                  <h2>mazout electric</h2>
                  <p>Designed the mobile app and website for an EV startup.</p>
                  <div className="project-tags" aria-label="Project tags">
                    <span>Product Design</span>
                    <span>Client Work</span>
                  </div>
                  <span className="project-metric">First in category · India</span>
                </div>
                <div className="project-content-right">
                  <span className="project-index">02</span>
                  <span className="project-year">2024</span>
                </div>
              </div>
            </Link>

            <Link className="project-card fade-in" href="/work/airpods-pro-film">
              <div className="project-media">
                <div className="media-placeholder">
                  <img src="/work/airpods-pro-film/assets/hero.png" alt="AirPods Pro motion design film" onError={e => (e.target as HTMLImageElement).remove()} />
                </div>
              </div>
              <div className="project-copy">
                <div className="project-content-left">
                  <h2>airpods pro</h2>
                  <p>A short motion-graphics film for AirPods Pro, in Apple&apos;s visual language.</p>
                  <div className="project-tags" aria-label="Project tags">
                    <span>Motion Design</span>
                    <span>After Effects</span>
                  </div>
                  <span className="project-metric">Built in 8 hours</span>
                </div>
                <div className="project-content-right">
                  <span className="project-index">03</span>
                  <span className="project-year">2024</span>
                </div>
              </div>
            </Link>

            <a className="project-card fade-in" href="/work/solace" data-soon>
              <div className="project-media">
                <div className="media-placeholder"></div>
              </div>
              <div className="project-copy">
                <div className="project-content-left">
                  <h2>solace</h2>
                  <p>A 3D calming experience designed in Spline.</p>
                  <div className="project-tags" aria-label="Project tags">
                    <span>UX</span>
                    <span>Spline</span>
                  </div>
                </div>
                <div className="project-content-right">
                  <span className="project-index">04</span>
                  <span className="project-year">2024</span>
                </div>
              </div>
            </a>

            <a className="project-card fade-in" href="/work/daylign" data-soon>
              <div className="project-media">
                <div className="media-placeholder"></div>
              </div>
              <div className="project-copy">
                <div className="project-content-left">
                  <h2>daylign</h2>
                  <p>iOS app tracking tasks through Dynamic Island. Built with Claude Code.</p>
                  <div className="project-tags" aria-label="Project tags">
                    <span>Product</span>
                    <span>In Progress</span>
                  </div>
                </div>
                <div className="project-content-right">
                  <span className="project-index">05</span>
                  <span className="project-year">2025</span>
                </div>
              </div>
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
