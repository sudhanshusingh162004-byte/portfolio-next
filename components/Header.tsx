'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const themeRef = useRef<HTMLButtonElement>(null)

  // Scroll → is-scrolled
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 40)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Mobile nav
  useEffect(() => {
    const btn = toggleRef.current
    const nav = navRef.current
    if (!btn || !nav) return

    const setNav = (open: boolean) => {
      btn.classList.toggle('is-open', open)
      nav.classList.toggle('is-open', open)
      btn.setAttribute('aria-expanded', String(open))
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      document.body.classList.toggle('nav-open', open)
    }

    const onToggle = () => setNav(!btn.classList.contains('is-open'))
    const onLinkClick = () => setNav(false)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNav(false) }

    btn.addEventListener('click', onToggle)
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', onLinkClick))
    document.addEventListener('keydown', onKey)

    return () => {
      btn.removeEventListener('click', onToggle)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Theme toggle
  useEffect(() => {
    const btn = themeRef.current
    if (!btn) return
    const onClick = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
      btn.classList.add('is-switching')
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
        localStorage.setItem('sui-theme', isDark ? 'light' : 'dark')
      }, 220)
      setTimeout(() => btn.classList.remove('is-switching'), 460)
    }
    btn.addEventListener('click', onClick)
    return () => btn.removeEventListener('click', onClick)
  }, [])

  const navPage = pathname === '/' ? 'about' : pathname.startsWith('/work') ? 'work' : 'thinking'

  return (
    <header className="site-header" ref={headerRef}>
      <Link className="brand" href="/">Sudhanshu Singh</Link>
      <button className="theme-toggle" ref={themeRef} aria-label="Toggle theme">
        <svg className="icon-moon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg className="icon-sun" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
      <button
        className="nav-toggle"
        id="nav-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="primary-nav"
        ref={toggleRef}
      >
        <span className="nav-toggle-bar"></span>
        <span className="nav-toggle-bar"></span>
      </button>
      <nav className="nav" id="primary-nav" aria-label="Primary navigation" ref={navRef}>
        <Link href="/" data-nav="about" className={navPage === 'about' ? 'is-active' : ''}>About Me</Link>
        <Link href="/work" data-nav="work" className={navPage === 'work' ? 'is-active' : ''}>Work</Link>
        <Link href="/thinking" data-nav="thinking" className={navPage === 'thinking' ? 'is-active' : ''}>Thinking</Link>
      </nav>
    </header>
  )
}
