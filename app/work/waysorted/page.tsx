import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { AmbientGlow } from '@/components/AmbientGlow'
import { WaysortedEffects } from '@/components/WaysortedEffects'

export const metadata: Metadata = {
  title: 'Waysorted · Sudhanshu Singh',
  description: 'Designing a design tool that gets out of the way — Waysorted, a Figma plugin that bundles the tools designers reach for most. Co-founder & CPO.',
}

export default function WaysortedPage() {
  return (
    <>
      <AmbientGlow />
      <main className="cs page-shell">

        <section className="cs-hero cs-wrap">
          <Link className="cs-back" href="/work"><span aria-hidden="true">←</span> Work</Link>
          <p className="cs-hero-label">Product Design · Figma Plugin · 2025–26</p>
          <h1>Solving tool fragmentation for <em>13&nbsp;million&nbsp;designers</em></h1>
          <p className="cs-hero-sub">The tools designers reach for most, bundled into one Figma plugin. No tab-switching. No subscriptions. No lost context.</p>
          <div className="cs-tags">
            <span className="cs-tag"><b>Founders.INC</b><span>Accelerator</span></span>
            <span className="cs-tag"><b>Nvidia Inception</b><span>Program</span></span>
          </div>
          <div className="cs-hero-media reveal">
            <div className="ph ph-16x9">
              <img src="/work/waysorted/assets/hero.png" alt="Waysorted plugin running inside Figma" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <div className="tldr-sheet">
            <div className="tldr-grid">
              <div className="tldr-cell">
                <span className="tldr-label">Recognition</span>
                <p className="tldr-value">Founders.INC&nbsp;+&nbsp;Nvidia Inception Program</p>
              </div>
              <div className="tldr-cell">
                <span className="tldr-label">Role</span>
                <p className="tldr-value">Co-founder &amp; CPO, product direction, design, and distribution</p>
              </div>
              <div className="tldr-cell">
                <span className="tldr-label">The constraint</span>
                <p className="tldr-value">1033×240px. Every design decision lived inside this strip.</p>
              </div>
            </div>
            <p className="tldr-callout">600+ users. Featured by a design creator with 170k+ subscribers on YouTube.</p>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <div className="cs-split cs-split--wide">
            <div className="cs-split-text">
              <p className="cs-eyebrow">The Problem</p>
              <p className="cs-lead">Designers paid for <strong>four or five separate tools</strong> to do what should&apos;ve been built in: a timer, a color picker, a placeholder, a contrast check.</p>
              <p>The real cost wasn&apos;t the money. It was the <mark>interruption</mark>. Every switch broke flow, twenty times a day.</p>
            </div>
            <div className="cs-split-media">
              <img className="bare-media" src="/work/waysorted/assets/problem.png" alt="The chaos of switching between separate design tools" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="cs-section cs-wrap cs-origin reveal">
          <span className="bignum" aria-hidden="true">100+</span>
          <p className="cs-eyebrow">Where I Started</p>
          <div className="cs-origin-body">
            <p>Before opening Figma, I audited <strong>100+ plugins</strong> and surveyed working designers. Most failed the same way: <mark>too much interface for too little value</mark>.</p>
            <p>That research became a priority stack, the non-negotiables any designer needs mid-session. That list became the product. Everything else was noise.</p>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <p className="cs-eyebrow">User Interviews</p>
          <p className="interviews-line">I sat down with <em>10+ designers</em> to learn what they actually reach for.</p>
          <div className="interview-stack" aria-label="A cluster of user interview and demo sessions">
            {[1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
              const positions = [
                {x:'18%',y:'33%',r:'-9deg',z:3,d:'0.05s'},
                {x:'34%',y:'25%',r:'6deg',z:5,d:'0.10s'},
                {x:'50%',y:'31%',r:'-3deg',z:7,d:'0.15s'},
                {x:'66%',y:'25%',r:'8deg',z:4,d:'0.20s'},
                {x:'82%',y:'35%',r:'-6deg',z:2,d:'0.25s'},
                {x:'26%',y:'56%',r:'5deg',z:6,d:'0.30s'},
                {x:'44%',y:'52%',r:'-7deg',z:9,d:'0.35s'},
                {x:'60%',y:'56%',r:'4deg',z:8,d:'0.40s'},
                {x:'77%',y:'58%',r:'-4deg',z:5,d:'0.45s'},
                {x:'37%',y:'74%',r:'8deg',z:4,d:'0.50s'},
                {x:'58%',y:'76%',r:'-8deg',z:6,d:'0.55s'},
              ]
              const p = positions[i]
              return (
                <figure key={n} className="interview-card" style={{'--x':p.x,'--y':p.y,'--r':p.r,'--z':p.z,'--d':p.d} as CSSProperties}>
                  <img src={`/work/waysorted/assets/interview-${n}.png`} alt="Waysorted user interview session" loading="lazy" />
                </figure>
              )
            })}
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <p className="cs-eyebrow">Key Decisions</p>
          <h2>Three calls that shaped the plugin</h2>
          <div className="decisions-grid">
            <article className="decision-card">
              <span className="decision-bignum" aria-hidden="true">01</span>
              <h3>Locking the Canvas Footprint</h3>
              <p>One hard constraint, set early: <strong>1033×240px</strong>. No scroll, no deep hierarchy, nothing that needs explaining. Every later decision got faster.</p>
              <div className="ph ph-4x3"><img src="/work/waysorted/assets/decision-1.png" alt="The plugin's locked 1033×240 canvas footprint" loading="lazy" /></div>
            </article>
            <article className="decision-card">
              <span className="decision-bignum" aria-hidden="true">02</span>
              <h3>Cutting Everything That Wasn&apos;t Primary</h3>
              <p>Open the plugin, use the thing, get back to work. <strong>No onboarding, no upsell.</strong> We cut everything that wasn&apos;t the tool itself.</p>
              <div className="ph ph-4x3"><img src="/work/waysorted/assets/decision-2.png" alt="The pared-back interface after cutting non-primary actions" loading="lazy" /></div>
            </article>
            <article className="decision-card">
              <span className="decision-bignum" aria-hidden="true">03</span>
              <h3>Matching Figma&apos;s Colour System</h3>
              <p>Same tones, same surfaces as Figma&apos;s own UI. So it stops feeling like a plugin and starts feeling like a <mark>feature that was always there</mark>.</p>
              <div className="ph ph-4x3"><img src="/work/waysorted/assets/decision-3.png" alt="Waysorted's UI matched to Figma's colour system" loading="lazy" /></div>
            </article>
          </div>
        </section>

        <section className="cs-section flow-section reveal">
          <div className="cs-wrap">
            <p className="cs-eyebrow">The Interface in Use</p>
            <p className="flow-intro">Every tool accessible without leaving the canvas. No tabs. No switching. No lost context.</p>
          </div>
          <div className="cs-wrap">
            <div className="flow-strip">
              <div className="flow-step"><div className="ph ph-strip"><img src="/work/waysorted/assets/flow-1.png" alt="Waysorted PDF tool" loading="lazy" /></div><span><span className="flow-step-num">01</span> · PDF Tool</span></div>
              <div className="flow-step"><div className="ph ph-strip"><img src="/work/waysorted/assets/flow-2.png" alt="Waysorted unit converter" loading="lazy" /></div><span><span className="flow-step-num">02</span> · Unit Converter</span></div>
              <div className="flow-step"><div className="ph ph-strip"><img src="/work/waysorted/assets/flow-3.png" alt="Waysorted file importer" loading="lazy" /></div><span><span className="flow-step-num">03</span> · File Importer</span></div>
              <div className="flow-step"><div className="ph ph-strip"><img src="/work/waysorted/assets/flow-4.png" alt="Waysorted icon library" loading="lazy" /></div><span><span className="flow-step-num">04</span> · Icon Library</span></div>
            </div>
            <div className="flow-hint" aria-hidden="true"><span>Scroll</span><span className="flow-hint-line"></span></div>
            <p className="flow-caption">The full plugin at 1033×240px. Every tool, one deliberate decision.</p>
          </div>
        </section>

        <section className="cs-section cs-wrap motion-section reveal">
          <p className="cs-eyebrow">In Motion</p>
          <p className="motion-label">Product demo, chopped from the original campaign footage</p>
          <div className="motion-frame" id="motion-frame">
            <video id="demo-video" src="/work/waysorted/assets/demo.mp4" playsInline preload="metadata"></video>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <div className="cs-split">
            <div className="cs-split-text">
              <p className="cs-eyebrow">Marketing &amp; Distribution</p>
              <h2>Built the Product. Then Animated the Marketing.</h2>
              <p>I designed and animated the reels myself, motion-first, built to show the plugin doing real work. <strong>Several crossed 10k+ views.</strong> Views converted to installs, not followers. A user base, not a brand.</p>
            </div>
            <div className="cs-split-media">
              <div className="ph ph-4x3"><img src="/work/waysorted/assets/marketing-1.png" alt="Still frame from a Waysorted marketing reel" loading="lazy" /></div>
            </div>
          </div>
        </section>

        <section className="cs-section cs-wrap cs-statement reveal">
          <p className="cs-eyebrow">Outcome</p>
          <div className="outcome-grid">
            <div className="outcome-main">
              <div className="stat-grid">
                <div className="stat"><span className="stat-num">600+</span><span className="stat-label">Users</span></div>
                <div className="stat"><span className="stat-num">170k+</span><span className="stat-label">YouTube subscribers on the feature</span></div>
                <div className="stat"><span className="stat-num stat-num--word">Founders.INC</span><span className="stat-label">Accelerator</span></div>
                <div className="stat"><span className="stat-num stat-num--word">Nvidia Inception</span><span className="stat-label">Program</span></div>
              </div>
              <p>Accepted into <strong>Founders.INC</strong> and <strong>Nvidia Inception</strong>. 600+ users, plus an organic shout-out from a <mark>170k-subscriber</mark> design creator. We didn&apos;t buy that reach. We earned it.</p>
            </div>
            <aside className="outcome-survey">
              <span className="survey-label">User Validation</span>
              <ul className="survey-list">
                <li><span className="survey-num">79%</span><span className="survey-text">rated the experience 4-5 out of 5</span></li>
                <li><span className="survey-num">64%</span><span className="survey-text">confirmed genuine productivity improvement</span></li>
                <li><span className="survey-num">93%</span><span className="survey-text">signed up for early beta access</span></li>
              </ul>
              <p className="survey-foot">Validated by 30 designers, including senior professionals with 10+ years of experience.</p>
            </aside>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <p className="cs-eyebrow">Reflection</p>
          <h2>What I&apos;d do differently</h2>
          <div className="reflect-grid">
            <article className="reflect-lesson">
              <span className="reflect-tag">01 · The interface</span>
              <p>We treated the first version like a product homepage, not a tool surface. Too many CTAs, too much noise. We should have <strong>started from the constraint</strong>, not arrived at it.</p>
            </article>
            <article className="reflect-lesson">
              <span className="reflect-tag">02 · The website</span>
              <p>The website made the same mistake: it tried to do too much. A tool that reduces complexity shouldn&apos;t have a complex landing page. <strong>Simplicity first, always.</strong></p>
            </article>
          </div>
        </section>

        <section className="cs-section cs-wrap reveal">
          <Link className="next-card" href="/work/mazout">
            <div className="ph next-thumb"><img src="/work/waysorted/assets/next-mazout.png" alt="Mazout X1 case study" loading="lazy" /></div>
            <div className="next-card-body">
              <span className="next-kicker">Next project</span>
              <strong>Mazout X1 · EV Powertrain App</strong>
            </div>
            <span className="next-arrow" aria-hidden="true">→</span>
          </Link>
        </section>

      </main>

      <WaysortedEffects />
    </>
  )
}
