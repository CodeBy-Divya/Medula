'use client'

import { useEffect } from 'react'

/**
 * Registers the offline-shell service worker in production builds only.
 * In dev the SW stays dormant on purpose — Next serves freshly compiled
 * chunks on every edit, and a caching worker would resurrect stale bundles.
 */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline shell is best-effort; never block the app */
      })
    }
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
