import type { Metadata } from 'next'
import Link from 'next/link'
import { AmbientGlow } from '@/components/AmbientGlow'
import { MazoutEffects } from '@/components/MazoutEffects'

export const metadata: Metadata = {
  title: 'Mazout X1 · Sudhanshu Singh',
  description: 'Making an EV powertrain feel simple — the first mobile interface for an autonomous EV powertrain unit in India.',
}

export default function MazoutPage() {
  return (
    <>
      <AmbientGlow />
      <main className="cs page-shell">

        <section className="cs-hero cs-wrap">
          <Link className="cs-back" href="/work"><span aria-hidden="true">←</span> Work</Link>
          <p className="cs-hero-label">Product Design · IoT · Mobile · 2024</p>
          <h1>Making an EV Powertrain Feel <em>Simple</em></h1>
          <p className="cs-hero-sub">Mazout X1, the first mobile interface for an autonomous EV powertrain unit in India.</p>
          <div className="cs-tags">
            <span className="cs-tag"><b>Mazout Electric</b><span>Client</span></span>
            <span className="cs-tag"><b>IoT · B2B</b><span>Hardware</span></span>
          </div>
          <div className="cs-hero-media reveal">
            <div className="ph ph-16x9 is-empty" data-label="assets/hero.png"></div>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <div className="tldr-sheet">
            <div className="tldr-grid">
              <div className="tldr-cell">
                <span className="tldr-label">First in category</span>
                <p className="tldr-value">No mobile UI precedent existed for this product type in India.</p>
              </div>
              <div className="tldr-cell">
                <span className="tldr-label">What I owned</span>
                <p className="tldr-value">App architecture, IA, UI, and 3D asset integration.</p>
              </div>
              <div className="tldr-cell">
                <span className="tldr-label">The challenge</span>
                <p className="tldr-value">Real-time telemetry, made approachable for non-technical fleet operators.</p>
              </div>
            </div>
            <p className="tldr-callout">Designed without direct user access. The client served as proxy for fleet-operator feedback.</p>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <div className="cs-split cs-split--wide">
            <div className="cs-split-text">
              <p className="cs-eyebrow">The Problem</p>
              <p className="cs-lead">Mazout was building India&apos;s first indigenous autonomous powertrain unit, hardware that connects to a vehicle and hands the user <strong>full digital control</strong>. No mobile interface existed for this category.</p>
              <p>The nearest references were Chinese enterprise dashboards built for function, not experience. My job was to design the consumer-facing app from scratch, something that made a technically complex system feel <mark>controlled and trustworthy</mark>.</p>
            </div>
            <div className="cs-split-media">
              <div className="ph ph-4x3 is-empty" data-label="assets/problem.png"></div>
            </div>
          </div>
        </section>

        <section className="cs-section cs-wrap cs-origin reveal">
          <span className="bignum" aria-hidden="true">Zero</span>
          <p className="cs-eyebrow">Where I Started</p>
          <div className="cs-origin-body">
            <p>I joined with <em>zero domain knowledge</em>. So I sat with the engineers first: how the unit worked, what data it threw off, what operators needed in real time.</p>
            <p>Then I turned that into a <mark>user mental model</mark> and pressure-tested it at every milestone.</p>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <p className="cs-eyebrow">Key Decisions</p>
          <h2>Three calls that shaped the app</h2>
          <div className="decisions-grid">
            <article className="decision-card">
              <span className="decision-bignum" aria-hidden="true">01</span>
              <h3>Light and minimal over dark and technical</h3>
              <p>We tested dark and technical against light and minimal. <strong>Fleet managers need quick reads, not immersion.</strong> The calmer direction won.</p>
              <div className="ph ph-4x3 is-empty" data-label="assets/decision-1.png"></div>
            </article>
            <article className="decision-card">
              <span className="decision-bignum" aria-hidden="true">02</span>
              <h3>An interface that reveals itself</h3>
              <p>Speed, torque, battery, voltage, orientation, all at once. Critical status stays visible; <mark>deeper data reveals on demand</mark>.</p>
              <div className="ph ph-4x3 is-empty" data-label="assets/decision-2.png"></div>
            </article>
            <article className="decision-card">
              <span className="decision-bignum" aria-hidden="true">03</span>
              <h3>3D hardware inside the interface</h3>
              <p>I enhanced the client&apos;s powertrain model in <strong>Spline</strong> with custom shaders and dropped it straight into the UI. You see exactly what you&apos;re controlling.</p>
              <div className="ph ph-4x3 is-empty" data-label="assets/decision-3.png"></div>
            </article>
          </div>
        </section>

        <section className="cs-section flow-section reveal">
          <div className="cs-wrap">
            <p className="cs-eyebrow">Inside the App</p>
            <p className="flow-intro">Live telemetry, motor health, device integration, the success and the failures. I designed every screen an operator touches, <mark>edge cases included</mark>.</p>
          </div>
          <div className="cs-wrap">
            <div className="flow-strip">
              <div className="flow-step"><div className="ph ph-phone is-empty" data-label="flow-1.png"></div><span><span className="flow-step-num">01</span> · Deployed Vehicle</span></div>
              <div className="flow-step"><div className="ph ph-phone is-empty" data-label="flow-2.png"></div><span><span className="flow-step-num">02</span> · Dual-Motor Telemetry</span></div>
              <div className="flow-step"><div className="ph ph-phone is-empty" data-label="flow-3.png"></div><span><span className="flow-step-num">03</span> · X1 Integration</span></div>
              <div className="flow-step"><div className="ph ph-phone is-empty" data-label="flow-4.png"></div><span><span className="flow-step-num">04</span> · Authentication Failed</span></div>
              <div className="flow-step"><div className="ph ph-phone is-empty" data-label="flow-5.png"></div><span><span className="flow-step-num">05</span> · Integration Success</span></div>
            </div>
            <div className="flow-hint" aria-hidden="true"><span>Scroll</span><span className="flow-hint-line"></span></div>
            <p className="flow-caption">Five screens across setup and daily use, including the <strong>failure paths most apps skip</strong>.</p>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <p className="cs-eyebrow">Beyond the App · Website</p>
          <h2>Designing the full digital presence</h2>
          <p>After the app shipped, Mazout brought me back for the website, the complete digital product. Same design language: <strong>clean, technical, modern</strong>.</p>
          <div className="web-carousel" data-carousel>
            <div className="web-track">
              <div className="web-slide ph ph-4x3 is-empty" data-label="assets/website-1.png" data-alt="Mazout website screen 1"></div>
              <div className="web-slide ph ph-4x3 is-empty" data-label="assets/website-2.png" data-alt="Mazout website screen 2"></div>
              <div className="web-slide ph ph-4x3 is-empty" data-label="assets/website-3.png" data-alt="Mazout website screen 3"></div>
            </div>
            <div className="web-dots" aria-label="Website screens">
              <button className="web-dot is-active" type="button" aria-label="Go to website screen 1"></button>
              <button className="web-dot" type="button" aria-label="Go to website screen 2"></button>
              <button className="web-dot" type="button" aria-label="Go to website screen 3"></button>
            </div>
          </div>
        </section>

        <section className="cs-section cs-wrap cs-statement reveal">
          <p className="cs-eyebrow">Outcome</p>
          <p className="cs-lead">When Mazout showed the X1 app to clients, the reaction was <mark>consistent surprise</mark>. For a first-in-category product, that reaction was the validation.</p>
          <div className="cs-quote">
            <blockquote>Nobody expected to <em>control the powertrain from a phone</em> like this.</blockquote>
            <div className="quote-by">
              <span className="quote-avatar" aria-hidden="true"><img src="/work/mazout/assets/founder.png" alt="" /></span>
              <span>
                <strong>Akhil Gupta</strong>
                <span className="quote-role">Founder · Mazout Electric</span>
              </span>
            </div>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <p className="cs-eyebrow">Reflection</p>
          <h2>What I&apos;d do differently</h2>
          <div className="reflect-grid">
            <article className="reflect-lesson">
              <span className="reflect-tag">01 · Research</span>
              <p>I worked largely from first principles. <strong>I&apos;d benchmark the adjacent tools harder upfront</strong>, not arrive at the direction through iteration.</p>
            </article>
            <article className="reflect-lesson">
              <span className="reflect-tag">02 · Access</span>
              <p>I leaned on client proxy feedback, not real fleet managers. Next time I&apos;d push for <strong>direct access to operators</strong>. The calls were right; the execution had room to breathe.</p>
            </article>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <Link className="next-card" href="/work/waysorted">
            <div className="ph next-thumb is-empty" data-label="next-waysorted.png"></div>
            <div className="next-card-body">
              <span className="next-kicker">Next project</span>
              <strong>Waysorted · Figma Plugin</strong>
            </div>
            <span className="next-arrow" aria-hidden="true">→</span>
          </Link>
        </section>

      </main>

      <MazoutEffects />
    </>
  )
}
