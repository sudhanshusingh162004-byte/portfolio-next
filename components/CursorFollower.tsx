'use client'
import { useEffect } from 'react'

export function CursorFollower() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const follower = document.createElement('div')
    follower.className = 'cursor-follower'
    follower.setAttribute('aria-hidden', 'true')
    const pill = document.createElement('div')
    pill.className = 'cursor-pill'
    pill.textContent = 'View'
    follower.appendChild(pill)
    document.body.appendChild(follower)

    let mouseX = -100, mouseY = -100, fx = -100, fy = -100
    let running = false, activePill = false

    const loop = () => {
      if (!running) return
      fx += (mouseX - fx) * 0.28
      fy += (mouseY - fy) * 0.28
      follower.style.transform = `translate3d(${fx}px, ${fy}px, 0)`
      if (!activePill && Math.abs(mouseX - fx) < 0.1 && Math.abs(mouseY - fy) < 0.1) {
        running = false; return
      }
      requestAnimationFrame(loop)
    }
    const start = () => { if (!running) { running = true; requestAnimationFrame(loop) } }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY
      if (activePill) start()
    }, { passive: true })

    const showPill = (soon: boolean) => {
      fx = mouseX; fy = mouseY
      follower.style.transform = `translate3d(${fx}px, ${fy}px, 0)`
      pill.textContent = soon ? 'Coming soon' : 'View'
      follower.classList.add('is-viewing')
      follower.classList.toggle('is-soon', soon)
      activePill = true
      start()
    }
    const hidePill = () => {
      follower.classList.remove('is-viewing', 'is-soon')
      activePill = false
    }

    document.querySelectorAll('.media-placeholder').forEach(card => {
      const soon = !!card.closest('[data-soon]')
      card.addEventListener('mouseenter', () => showPill(soon))
      card.addEventListener('mouseleave', hidePill)
    })
    document.querySelectorAll('[data-soon]').forEach(el => {
      if (!el.querySelector('.media-placeholder')) {
        el.addEventListener('mouseenter', () => showPill(true))
        el.addEventListener('mouseleave', hidePill)
      }
    })

    document.documentElement.addEventListener('mouseleave', hidePill)
    window.addEventListener('blur', hidePill)

    return () => {
      follower.remove()
    }
  }, [])

  return null
}
