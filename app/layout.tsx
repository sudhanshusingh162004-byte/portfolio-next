import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BodyDataPage } from '@/components/BodyDataPage'

export const metadata: Metadata = {
  title: 'Sudhanshu Singh - Interaction Designer',
  description:
    'Sudhanshu Singh is an interaction designer with product thinking, designing clean interactive experiences with precise moments of motion.',
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
      </body>
    </html>
  )
}
