'use client'
import { useEffect } from 'react'

// Persists across client-side navigations so the loader only ever plays once
// per session — returning to the home page via <Link> skips it.
let loaderHasRun = false

export function PageLoader({ onDone }: { onDone?: () => void }) {
  useEffect(() => {
    const loader = document.querySelector<HTMLElement>('.page-loader')
    if (!loader) return

    // Already played this session — reveal the page immediately, no loader.
    if (loaderHasRun || document.body.classList.contains('has-loaded-before')) {
      loader.style.display = 'none'
      document.body.classList.add('has-loaded-before')
      const shell = document.querySelector<HTMLElement>('.page-shell')
      if (shell) shell.style.opacity = '1'
      onDone?.()
      return
    }
    loaderHasRun = true

    const countValue = loader.querySelector<HTMLElement>('.loader-count-value')
    const lineFill = loader.querySelector<HTMLElement>('.loader-line-fill')
    const nameEl = loader.querySelector<HTMLElement>('.loader-name')
    const duration = 1800
    let loaderStart: number | null = null

    if (countValue) countValue.textContent = '0'

    if (nameEl) {
      const nameText = 'Sudhanshu Singh'
      const GCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01'
      const GCOL = '#7aab68'
      const targetDuration = duration * 0.45
      const nonSpaceIndices: number[] = []
      for (let i = 0; i < nameText.length; i++) {
        if (nameText[i] !== ' ') nonSpaceIndices.push(i)
      }
      const nameTickDelay = Math.round(targetDuration / nonSpaceIndices.length)
      const resolvedName = new Set<number>()
      const currentChars: Record<number, string> = {}
      nonSpaceIndices.forEach(i => {
        currentChars[i] = GCHARS[Math.floor(Math.random() * GCHARS.length)]
      })

      function renderName() {
        const unres = nonSpaceIndices.filter(i => !resolvedName.has(i))
        if (unres.length > 0) resolvedName.add(unres[Math.floor(Math.random() * unres.length)])
        unres.forEach(i => {
          if (Math.random() < 0.4) currentChars[i] = GCHARS[Math.floor(Math.random() * GCHARS.length)]
        })
        let html = ''
        for (let i = 0; i < nameText.length; i++) {
          if (nameText[i] === ' ') { html += ' '; continue }
          if (resolvedName.has(i)) {
            html += `<span style="color:rgba(255,255,255,0.9)">${nameText[i]}</span>`
          } else {
            html += `<span style="color:${GCOL}">${currentChars[i]}</span>`
          }
        }
        if (nameEl) nameEl.innerHTML = html
        if (resolvedName.size < nonSpaceIndices.length) {
          setTimeout(() => requestAnimationFrame(renderName), nameTickDelay)
        }
      }
      requestAnimationFrame(renderName)
    }

    const animateLoader = (timestamp: number) => {
      if (!loaderStart) loaderStart = timestamp
      const rawProgress = Math.min((timestamp - loaderStart) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3)
      const percent = Math.round(easedProgress * 100)
      if (countValue) countValue.textContent = String(percent)
      if (lineFill) lineFill.style.transform = `scaleX(${easedProgress})`

      if (rawProgress < 1) {
        requestAnimationFrame(animateLoader)
      } else {
        loader.style.transform = 'translateY(-100%)'
        setTimeout(() => {
          loader.style.display = 'none'
          document.body.classList.add('has-loaded-before')
          const shell = document.querySelector<HTMLElement>('.page-shell')
          if (shell) {
            shell.style.transition = 'opacity 0.5s ease'
            shell.style.opacity = '1'
          }
          onDone?.()
        }, 520)
      }
    }

    setTimeout(() => requestAnimationFrame(animateLoader), 100)
  }, [onDone])

  return (
    // On a return visit (client-side nav back to home) the loader has already
    // run, so render it hidden up-front to avoid a one-frame flash.
    <div className="page-loader" aria-hidden="true" style={loaderHasRun ? { display: 'none' } : undefined}>
      <div className="loader-top">
        <div className="loader-name" aria-label="Sudhanshu Singh"></div>
        <div className="loader-count">
          <span className="loader-count-value">0</span>
          <span className="loader-percent">%</span>
        </div>
      </div>
      <div className="loader-line"><div className="loader-line-fill"></div></div>
      <div className="loader-bottom"></div>
    </div>
  )
}
