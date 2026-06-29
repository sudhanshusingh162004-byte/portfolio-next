'use client'
import { useEffect } from 'react'

// The famous ones — their best-known tracks, in a nice listening order.
const ARTIST = 'Arctic Monkeys'
const TRACKS = [
  'Do I Wanna Know?',
  'R U Mine?',
  '505',
  "Why'd You Only Call Me When You're High?",
  'Arabella',
  'Fluorescent Adolescent',
  'I Bet You Look Good on the Dancefloor',
  'Snap Out of It',
  'Cornerstone',
  'When the Sun Goes Down',
  'Mardy Bum',
  'One for the Road',
  'Brianstorm',
  'Crying Lightning',
  'Knee Socks',
]

export function NowPlaying() {
  useEffect(() => {
    const wrap = document.getElementById('now-playing')
    const deck = document.getElementById('np-deck') as HTMLButtonElement | null
    const arm = wrap?.querySelector<SVGGElement>('.np-arm-g')
    const armHit = wrap?.querySelector<SVGCircleElement>('.np-arm-hit')
    const listEl = document.getElementById('np-list')
    if (!wrap || !deck || !arm || !armHit || !listEl) return

    const artEl = wrap.querySelector<HTMLImageElement>('.np-art')
    const titleEl = document.getElementById('np-title')
    const stateEl = wrap.querySelector<HTMLElement>('.np-state-text')
    const rows = Array.from(listEl.querySelectorAll<HTMLButtonElement>('.np-track'))

    const audio = new Audio()
    audio.preload = 'none'
    let idx = 0
    let previewUrl: string | null = null
    let playing = false
    let reqToken = 0 // guards against a slow art fetch landing after a newer one
    const cache = new Map<number, { artwork: string | null; preview: string | null }>()

    function jsonp(url: string): Promise<{ results?: Array<{ artworkUrl100?: string; previewUrl?: string; artistName?: string }> }> {
      return new Promise((resolve, reject) => {
        const cb = 'np_cb_' + Math.random().toString(36).slice(2)
        const script = document.createElement('script')
        const timer = setTimeout(() => { cleanup(); reject(new Error('timeout')) }, 6000)
        function cleanup() { clearTimeout(timer); delete (window as unknown as Record<string, unknown>)[cb]; script.remove() }
        ;(window as unknown as Record<string, unknown>)[cb] = (data: unknown) => { cleanup(); resolve(data as ReturnType<typeof jsonp> extends Promise<infer T> ? T : never) }
        script.onerror = () => { cleanup(); reject(new Error('jsonp failed')) }
        script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + cb
        document.head.appendChild(script)
      })
    }

    // Album art + 30s preview for a track, preferring a real Arctic Monkeys hit.
    async function lookup(i: number): Promise<{ artwork: string | null; preview: string | null }> {
      const hit = cache.get(i)
      if (hit) return hit
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(ARTIST + ' ' + TRACKS[i])}&entity=song&limit=8`
        const d = await jsonp(url)
        const results = d.results || []
        const r = results.find((x) => /arctic monkeys/i.test(x.artistName || '')) || results[0]
        const out = {
          artwork: r?.artworkUrl100 ? r.artworkUrl100.replace('100x100', '600x600') : null,
          preview: r?.previewUrl || null,
        }
        cache.set(i, out)
        return out
      } catch {
        return { artwork: null, preview: null }
      }
    }

    function setPlaying(on: boolean) {
      playing = on
      wrap!.classList.toggle('is-playing', on)
      deck!.setAttribute('aria-pressed', on ? 'true' : 'false')
      if (stateEl) stateEl.textContent = on ? 'Now playing' : 'Paused'
    }

    function markActive(i: number) {
      rows.forEach((r, j) => {
        const on = j === i
        r.classList.toggle('is-active', on)
        if (on) r.setAttribute('aria-current', 'true')
        else r.removeAttribute('aria-current')
      })
      rows[i]?.scrollIntoView({ block: 'nearest' })
    }

    // Put track i on the deck (art, title, preview) — does NOT start audio.
    async function loadTrack(i: number) {
      const my = ++reqToken
      idx = i
      markActive(i)
      if (titleEl) titleEl.textContent = TRACKS[i]
      deck!.setAttribute('aria-label', `Play ${TRACKS[i]} by ${ARTIST}`)
      const info = await lookup(i)
      if (my !== reqToken) return
      previewUrl = info.preview
      if (artEl) {
        if (info.artwork) { artEl.src = info.artwork; artEl.alt = `${TRACKS[i]} — ${ARTIST}`; wrap!.classList.add('has-art') }
        else { artEl.removeAttribute('src'); wrap!.classList.remove('has-art') }
      }
    }

    async function play(i: number) {
      const switching = i !== idx
      if (switching) await loadTrack(i)
      if (!previewUrl) await loadTrack(i) // still resolving — try once more
      if (!previewUrl) return
      if (audio.src !== previewUrl) {
        audio.src = previewUrl
        audio.currentTime = 0
      }
      try { await audio.play(); setPlaying(true) } catch { setPlaying(false) }
    }

    function pause() { audio.pause(); setPlaying(false) }
    function toggle() { if (playing) pause(); else play(idx) }

    // Start paused on the first track; nothing moves until you act.
    setPlaying(false)
    loadTrack(0)

    // Pick a song from the list.
    const onRowClick = (e: Event) => {
      const i = Number((e.currentTarget as HTMLButtonElement).dataset.i)
      if (i === idx && playing) { pause(); return }
      play(i)
    }
    rows.forEach((r) => r.addEventListener('click', onRowClick))

    // When a 30s preview ends, roll into the next track — a gentle playlist loop.
    const onEnded = () => play((idx + 1) % TRACKS.length)
    audio.addEventListener('ended', onEnded)

    // ── Draggable tonearm: hold the deck and pull the arm onto the record ──
    let dragging = false
    let moved = 0
    let startX = 0
    let startY = 0
    let lastEng = 0 // 0 = arm parked, 1 = arm on the record
    function engagementAt(clientX: number, clientY: number) {
      const rect = deck!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const d = Math.hypot(clientX - cx, clientY - cy)
      const restD = rect.width * 0.62 // pointer out here → arm parked
      const engD = rect.width * 0.30  // pointer pulled in to here → arm down
      return Math.max(0, Math.min(1, (restD - d) / (restD - engD)))
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      dragging = true
      moved = 0
      startX = e.clientX
      startY = e.clientY
      lastEng = playing ? 1 : 0
      wrap!.classList.add('np-dragging')
      e.stopPropagation()
      try { armHit!.setPointerCapture(e.pointerId) } catch { /* no-op */ }
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      moved = Math.max(moved, Math.hypot(e.clientX - startX, e.clientY - startY))
      lastEng = engagementAt(e.clientX, e.clientY)
      arm!.style.transform = `rotate(${(-42 * (1 - lastEng)).toFixed(1)}deg)`
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      wrap!.classList.remove('np-dragging')
      arm!.style.transform = '' // hand control back to CSS so it snaps smoothly
      try { armHit!.releasePointerCapture(e.pointerId) } catch { /* no-op */ }
      if (moved < 6) { toggle(); return } // a tap, not a drag
      const engage = lastEng >= 0.45
      if (engage && !playing) play(idx)
      else if (!engage && playing) pause()
    }
    // Keyboard activation of the deck button (Enter/Space → click with detail 0).
    const onClick = (e: MouseEvent) => { if (e.detail === 0) toggle() }
    // Drag only from the tonearm head; the disc itself is inert.
    armHit.addEventListener('pointerdown', onDown)
    armHit.addEventListener('pointermove', onMove)
    armHit.addEventListener('pointerup', onUp)
    armHit.addEventListener('pointercancel', onUp)
    deck.addEventListener('click', onClick)

    return () => {
      rows.forEach((r) => r.removeEventListener('click', onRowClick))
      audio.removeEventListener('ended', onEnded)
      armHit.removeEventListener('pointerdown', onDown)
      armHit.removeEventListener('pointermove', onMove)
      armHit.removeEventListener('pointerup', onUp)
      armHit.removeEventListener('pointercancel', onUp)
      deck.removeEventListener('click', onClick)
      audio.pause()
    }
  }, [])

  return (
    <div className="np" id="now-playing">
      <button className="np-deck" id="np-deck" type="button" aria-label="Play" aria-pressed="false" title="Drag the arm onto the record — or just click — to play">
        <span className="np-vinyl">
          <span className="np-label"><img className="np-art" alt="" decoding="async" /></span>
        </span>
        <svg className="np-tonearm" viewBox="0 0 100 100" aria-hidden="true">
          <g className="np-arm-g">
            <line className="np-arm-line" x1="84" y1="16" x2="88" y2="52"></line>
            <rect className="np-arm-head" x="83.5" y="50" width="9" height="15" rx="2"></rect>
            <circle className="np-arm-hit" cx="88" cy="57" r="16"></circle>
          </g>
          <circle className="np-arm-pivot" cx="84" cy="16" r="6.5"></circle>
        </svg>
      </button>
      <div className="np-side">
        <div className="np-now">
          <div className="np-state">
            <span className="np-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span className="np-state-text">Paused</span>
          </div>
          <p className="np-title" id="np-title">Do I Wanna Know?</p>
        </div>
        <ul className="np-list" id="np-list" aria-label="Arctic Monkeys tracks">
        {TRACKS.map((t, i) => (
          <li key={i}>
            <button type="button" className="np-track" data-i={i}>
              <span className="np-tindicator" aria-hidden="true">
                <span className="np-tnum">{i + 1}</span>
                <span className="np-tbars"><i></i><i></i><i></i></span>
              </span>
              <span className="np-tname">{t}</span>
            </button>
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}
