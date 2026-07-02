import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The site is a faithful port of an imperative, vanilla-JS animated site.
  // Strict Mode's dev-only double-invoke of effects re-runs one-shot GSAP
  // entrance tweens, freezing `gsap.from()` targets at opacity 0 and
  // double-splitting SplitType text. Production already runs effects once,
  // so disabling it here just makes dev match production (and the original).
  reactStrictMode: false,
  // The About page lives on the home route; redirect the legacy /about path
  // (and any old links pointing at it) instead of serving a 404.
  async redirects() {
    return [{ source: '/about', destination: '/', permanent: true }]
  },
}

export default nextConfig
