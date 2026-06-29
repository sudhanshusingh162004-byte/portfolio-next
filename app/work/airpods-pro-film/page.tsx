import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { AmbientGlow } from '@/components/AmbientGlow'
import { AirpodsEffects } from '@/components/AirpodsEffects'

export const metadata: Metadata = {
  title: 'AirPods Pro · Motion Design · Sudhanshu Singh',
  description: 'A short commercial advertisement for Apple AirPods Pro, designed and animated in After Effects.',
}

export default function AirPodsPage() {
  return (
    <>
      <div className="afp-progress" aria-hidden="true"></div>
      <AmbientGlow />
      <main className="afp">

        <section className="cs-hero cs-wrap">
          <Link className="cs-back" href="/work"><span aria-hidden="true">←</span> Work</Link>
          <p className="cs-hero-label">Motion Design · After Effects · 2024</p>
          <h1>A motion film for AirPods Pro, in Apple&apos;s <em>visual language</em></h1>
          <p className="cs-hero-sub">A short commercial advertisement for Apple AirPods Pro, designed and animated in After Effects, with the whole piece built in 8 hours.</p>
          <div className="cs-tags">
            <span className="cs-tag"><b>Motion Design</b><span>Role</span></span>
            <span className="cs-tag"><b>After Effects</b><span>Tool</span></span>
            <span className="cs-tag"><b>8 hours</b><span>Made in</span></span>
            <span className="cs-tag"><b>2024</b><span>Year</span></span>
          </div>
          <div className="cs-hero-media afp-reveal">
            <div className="ph ph-16x9"><img src="/work/airpods-pro-film/assets/hero.png" alt="AirPods Pro motion film, hero frame" loading="lazy" /></div>
          </div>
        </section>

        <section className="afp-stage" id="afp-opening">
          <div className="afp-stage-pin">
            <div className="afp-stage-media" data-video="/work/airpods-pro-film/assets/start.mp4" data-poster="/work/airpods-pro-film/assets/hero.png" data-player="full"></div>
            <div className="afp-stage-blocks" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          </div>
        </section>

        <section className="afp-block afp-wrap">
          <div className="afp-head">
            <p className="afp-eyebrow afp-reveal">Introduction</p>
            <h2 className="afp-subhead"><span className="line">Conceptual Thinking</span></h2>
            <p className="afp-body afp-reveal">A design built to match Apple&apos;s innovative ethos and put the AirPods Pro at the centre. The whole piece came together in <strong>eight hours</strong>, from research and moodboarding to the final frame.</p>
          </div>
          <div className="afp-mood">
            <p className="afp-mood-label afp-reveal">Mood Board</p>
            <div className="afp-mood-grid">
              {[
                {n:1,ar:'488/442'},{n:2,ar:'480/272'},{n:3,ar:'242/564'},
                {n:4,ar:'480/302'},{n:5,ar:'381/302'},{n:6,ar:'335/302'},
                {n:7,ar:'488/528'},{n:8,ar:'484/263'},{n:9,ar:'322/423'},
                {n:10,ar:'415/406'},{n:11,ar:'1253/682'},
              ].map(({n,ar}) => (
                <figure key={n} className="afp-mood-tile afp-reveal" style={{'--ar':ar} as CSSProperties} data-img={`/work/airpods-pro-film/assets/mood-${n}.png`} data-alt="Mood reference"></figure>
              ))}
            </div>
          </div>
        </section>

        <section className="afp-band">
          <div className="afp-block afp-wrap">
            <div className="afp-split afp-split--text">
              <div className="afp-textcol">
                <p className="afp-eyebrow afp-reveal">Brand Choice</p>
                <h2 className="afp-subhead"><span className="line">Why Apple?</span></h2>
                <p className="afp-body afp-reveal">Apple&apos;s reputation for innovation made it the obvious subject. <strong>Advanced features, a sleek design</strong>, and a visual language worth animating to.</p>
              </div>
              <div className="afp-splitfig afp-apple-wrap">
                <svg className="afp-apple afp-reveal" viewBox="0 0 814 1000" aria-hidden="true">
                  <path pathLength="100" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="afp-block--tight afp-wrap">
          <div className="afp-head">
            <p className="afp-eyebrow afp-reveal">Soundtrack</p>
            <h2 className="afp-subhead"><span className="line">Soundtrack choice</span></h2>
            <p className="afp-body afp-reveal">I scored it to a real Apple AirPods ad, keeping the original track for <strong>authenticity</strong> and the same dynamic energy. The music sets the rhythm every cut lands on.</p>
          </div>
        </section>
        <div className="afp-wavestage">
          <div className="afp-wave" id="afp-wave" aria-hidden="true"></div>
        </div>

        <section className="afp-block afp-wrap afp-center">
          <p className="afp-eyebrow afp-reveal">Product Focus</p>
          <h2 className="afp-subhead"><span className="line">Why AirPods Pro?</span></h2>
          <p className="afp-body afp-reveal">Honestly, because they live in my ears. I use the AirPods Pro every day and I have always liked the way Apple builds and shows its products, so animating something I already knew that well let me <em>obsess over the motion, not the research</em>.</p>
        </section>

        <section className="afp-block afp-wrap">
          <div className="afp-head">
            <p className="afp-eyebrow afp-reveal">Creative Process</p>
            <h2 className="afp-subhead"><span className="line">The Creative journey</span></h2>
          </div>
          <ol className="afp-journey afp-reveal">
            <li><span className="afp-journey-n">01</span><span className="afp-journey-l">Storyboard</span><span className="afp-journey-s">Frame the beats</span></li>
            <li><span className="afp-journey-n">02</span><span className="afp-journey-l">Iterate</span><span className="afp-journey-s">Against the 8-hour clock</span></li>
            <li><span className="afp-journey-n">03</span><span className="afp-journey-l">Peer feedback</span><span className="afp-journey-s">Tighten the timing</span></li>
            <li><span className="afp-journey-n">04</span><span className="afp-journey-l">Final cut</span><span className="afp-journey-s">Export and ship</span></li>
          </ol>
        </section>

        <section className="afp-block--tight afp-wrap">
          <div className="afp-head">
            <p className="afp-eyebrow afp-reveal">Final Outcome</p>
            <h2 className="afp-subhead"><span className="line">Final Showcase</span></h2>
            <p className="afp-body afp-reveal">The full reel, end to end. Smooth text animation, tight transitions, and the soundtrack, closing on the product. Also on <a className="afp-link" href="https://www.behance.net/gallery/202554449/Motion-Design-Airpods-Pro" target="_blank" rel="noopener">Behance &#8599;</a>.</p>
          </div>
        </section>

        <section className="afp-stage" id="afp-final">
          <div className="afp-stage-pin">
            <div className="afp-stage-media afp-cinema-media" data-video="/work/airpods-pro-film/assets/final.mp4" data-poster="/work/airpods-pro-film/assets/hero.png" data-player="cinema"></div>
            <div className="afp-stage-blocks" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          </div>
        </section>

        <section className="cs-section cs-wrap afp-reveal">
          <Link className="next-card" href="/work/waysorted">
            <div className="ph next-thumb"><img src="/work/waysorted/assets/hero.png" alt="Waysorted case study" loading="lazy" /></div>
            <div className="next-card-body">
              <span className="next-kicker">Next project</span>
              <strong>Waysorted · Figma Plugin</strong>
            </div>
            <span className="next-arrow" aria-hidden="true">→</span>
          </Link>
        </section>

      </main>

      <AirpodsEffects />
    </>
  )
}
