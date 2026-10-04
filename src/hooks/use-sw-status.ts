'use client'

import { useEffect, useState } from 'react'

export type SWStatus = 'checking' | 'unsupported' | 'dev' | 'registering' | 'active'

/**
 * Reports the offline-shell (service worker) status honestly per environment:
 *  - 'dev'          → running the dev server (SW intentionally dormant)
 *  - 'unsupported'  → browser has no serviceWorker support
 *  - 'registering'  → production, worker registered but not yet controlling
 *  - 'active'       → worker active and controlling this page
 *
 * The environment-dependent defaults are computed in the lazy initializer so
 * the effect itself only performs asynchronous state updates.
 */
export function useSWStatus(): SWStatus {
  const [status, setStatus] = useState<SWStatus>(() => {
    if (process.env.NODE_ENV !== 'production') return 'dev'
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return 'unsupported'
    return 'checking'
  })

  useEffect(() => {
    if (status !== 'checking') return
    let cancelled = false
    navigator.serviceWorker
      .getRegistration('/')
      .then((reg) => {
        if (cancelled) return
        if (!reg) {
          setStatus('registering')
          return
        }
        setStatus(reg.active ? 'active' : 'registering')
        if (!reg.active) {
          const poll = window.setInterval(() => {
            if (reg.active) {
              window.clearInterval(poll)
              if (!cancelled) setStatus('active')
            }
          }, 1000)
          window.setTimeout(() => window.clearInterval(poll), 15000)
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('unsupported')
      })
    return () => {
      cancelled = true
    }
  }, [status])

  return status
}
