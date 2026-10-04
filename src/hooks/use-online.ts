'use client'

import { useEffect, useState } from 'react'

/**
 * Live navigator.onLine status. SSR-safe (defaults to online), updates via
 * the browser's online/offline events. Used by the app shell's offline banner.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  return online
}
