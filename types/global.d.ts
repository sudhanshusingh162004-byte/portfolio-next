// Ambient types for the CDN-hosted libraries the original site loads
// (GSAP, ScrollTrigger, SplitType) and attaches to `window`.

interface GsapTimeline {
  from: (...args: unknown[]) => GsapTimeline
  to: (...args: unknown[]) => GsapTimeline
  fromTo: (...args: unknown[]) => GsapTimeline
}

interface Gsap {
  timeline: (vars?: object) => GsapTimeline
  from: (...args: unknown[]) => unknown
  to: (...args: unknown[]) => unknown
  fromTo: (...args: unknown[]) => unknown
  registerPlugin: (...args: unknown[]) => void
  config: (vars: object) => void
}

declare global {
  interface Window {
    gsap?: Gsap
    ScrollTrigger?: { refresh: () => void }
    SplitType?: new (el: Element, opts: object) => { lines: Element[]; words: Element[] }
    lottie?: unknown
  }
}

export {}
