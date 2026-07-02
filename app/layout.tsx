import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BodyDataPage } from '@/components/BodyDataPage'

const SITE_URL = 'https://sudhanshu-s.com'
const SITE_TITLE = 'Sudhanshu Singh - Interaction Designer'
const SITE_DESC =
  'Sudhanshu Singh is an interaction designer with product thinking, designing clean interactive experiences with precise moments of motion.'
const SITE_OG_IMAGE = '/work/waysorted/assets/hero.png'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Sudhanshu Singh',
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [{ url: SITE_OG_IMAGE, width: 1920, height: 1080, alt: SITE_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [SITE_OG_IMAGE],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme must run before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var t=localStorage.getItem('sui-theme');t&&document.documentElement.setAttribute('data-theme',t)}();`,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <BodyDataPage />
        <Header />
        {children}
        <Footer />
        {/* CDN libs loaded after interactive — same as original */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          strategy="afterInteractive"
        />
        <Script src="https://unpkg.com/split-type" strategy="afterInteractive" />
        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
