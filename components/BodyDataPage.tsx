'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function BodyDataPage() {
  const pathname = usePathname()
  useEffect(() => {
    let page = 'about'
    if (pathname.startsWith('/work')) page = 'work'
    else if (pathname.startsWith('/thinking')) page = 'thinking'
    document.body.setAttribute('data-page', page)
  }, [pathname])
  return null
}
