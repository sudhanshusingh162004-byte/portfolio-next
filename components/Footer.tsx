'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MARQUEE = 'Interaction Design · Motion · Product Thinking · Figma · After Effects · Rive · Spline · Interaction Design · Motion · Product Thinking · Figma · After Effects · Rive · Spline · Interaction Design · Motion · Product Thinking · Figma · After Effects · Rive · Spline · '

export function Footer() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  // IST clock
  useEffect(() => {
    const clock = document.getElementById('local-time')
    if (!clock) return
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
    })
    const tick = () => { clock.textContent = fmt.format(new Date()) + ' IST' }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  // Back to top
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = (e.target as Element).closest('.back-to-top')
      if (btn) window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Footer glitch on link hover
  useEffect(() => {
    const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01'
    const links = document.querySelectorAll<HTMLAnchorElement>('.footer-col a')

    const cleanups: (() => void)[] = []

    links.forEach(link => {
      const original = link.innerText
      const charIndices: number[] = []
      for (let i = 0; i < original.length; i++) {
        if (original[i] !== ' ') charIndices.push(i)
      }
      const tickDelay = Math.round(620 / (charIndices.length || 1))
      let frame: ReturnType<typeof setTimeout> | null = null
      let active = false
      let resolvedSet = new Set<number>()

      const tick = () => {
        if (!active) return
        const unresolved = charIndices.filter(i => !resolvedSet.has(i))
        if (unresolved.length > 0) {
          resolvedSet.add(unresolved[Math.floor(Math.random() * unresolved.length)])
        }
        const rootStyle = getComputedStyle(document.documentElement)
        const inkColor = rootStyle.getPropertyValue('--ink').trim()
        const accentColor = rootStyle.getPropertyValue('--accent').trim()
        let html = ''
        for (let i = 0; i < original.length; i++) {
          if (original[i] === ' ') { html += ' '; continue }
          if (resolvedSet.has(i)) {
            html += `<span style="color:${inkColor}">${original[i]}</span>`
          } else {
            const r = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            html += `<span style="color:${accentColor}">${r}</span>`
          }
        }
        link.innerHTML = html
        if (resolvedSet.size < charIndices.length) {
          frame = setTimeout(() => requestAnimationFrame(tick), tickDelay)
        }
      }

      const onEnter = () => {
        if (frame) clearTimeout(frame)
        active = true
        resolvedSet = new Set()
        requestAnimationFrame(tick)
      }
      const onLeave = () => {
        active = false
        if (frame) clearTimeout(frame)
        link.innerHTML = original
        resolvedSet = new Set()
      }
      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        link.removeEventListener('mouseenter', onEnter)
        link.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <footer className="sui-footer" id="footer">
      <div className="sui-footer-content">
        <div className="footer-cta">
          <p className="footer-cta-kicker">Got an idea? A role? A wild brief?</p>
          <h2 className="footer-cta-heading">Let&apos;s make<br />something <em>great.</em></h2>
          <a href="mailto:sudhanshusingh162004@gmail.com" className="footer-cta-btn" data-magnetic>
            <span className="footer-cta-btn-text">sudhanshusingh162004@gmail.com</span>
            <span className="footer-cta-btn-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg>
            </span>
          </a>
        </div>

        <div className="footer-marquee" aria-hidden="true">
          <div className="footer-marquee-track">
            <span>{MARQUEE}</span>
            <span>{MARQUEE}</span>
          </div>
        </div>

        <div className="sui-footer-grid">
          <div className="footer-col">
            <h4>Navigate</h4>
            <Link href="/" data-magnetic>About Me</Link>
            <Link href="/work" data-magnetic>Work</Link>
            <Link href="/thinking" data-magnetic>Thinking</Link>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://www.linkedin.com/in/sudhanshu-singh-34843b249" target="_blank" rel="noopener" data-magnetic>LinkedIn &#8599;</a>
            <a href="mailto:sudhanshusingh162004@gmail.com" data-magnetic>Email</a>
            <a href="/assets/Sudhanshu-Singh-Resume.pdf" target="_blank" rel="noopener" data-magnetic>Résumé &#8599;</a>
          </div>
          <div className="footer-col footer-col--meta">
            <h4>Currently</h4>
            <p className="footer-meta-line"><span className="live-dot"></span> Available for work</p>
            <p className="footer-meta-line footer-clock">New Delhi&ensp;·&ensp;<span id="local-time">--:--</span></p>
          </div>
        </div>

        <div className="sui-footer-bottom">
          <p>&copy; 2026 Sudhanshu Singh</p>
          <div className="footer-bottom-right">
            <span className="colophon">Coffee &amp; Claude :)</span>
            <button className="back-to-top" type="button" aria-label="Back to top">
              Back to top <span aria-hidden="true">&#8593;</span>
            </button>
          </div>
        </div>

        {isHome && (
          <p className="footer-credit">
            Darth Vader pixel sprite made with
            <svg className="credit-heart" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
              <path d="M12 21s-7.5-4.6-10.2-9C.2 9 1.3 5.5 4.3 4.7c2-.5 3.9.4 4.9 2 .9-1.6 2.9-2.5 4.9-2 3 .8 4.1 4.3 2.5 7.3C19.5 16.4 12 21 12 21z" fill="currentColor"/>
            </svg>
            by its original artist, <a href="https://i.pinimg.com/originals/c0/98/11/c098114f40ee07b4e23aa2bbb3b9f644.gif" target="_blank" rel="noopener">via Pinterest</a>.
          </p>
        )}
      </div>

      <style>{`
        .footer-credit { margin-top:18px; font-size:0.72rem; color:var(--muted); opacity:0.7; }
        .footer-credit a { color:var(--muted); text-decoration:underline; text-underline-offset:2px; transition:color 0.25s ease; }
        .footer-credit a:hover { color:var(--accent); }
        .credit-heart { display:inline-block; vertical-align:-1px; margin:0 5px; color:var(--accent); opacity:0.85; animation:credit-heartbeat 1.8s ease-in-out infinite; }
        @keyframes credit-heartbeat { 0%,100%{transform:scale(1)} 15%{transform:scale(1.22)} 30%{transform:scale(1)} 45%{transform:scale(1.14)} }
      `}</style>
    </footer>
  )
}
