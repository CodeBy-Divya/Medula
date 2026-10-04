'use client'

// Global error boundary for the single-route SPA — without this, an uncaught
// render error white-screens every view (they all live on `/`).
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app-error]', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="clay w-full max-w-md rounded-2xl p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sev-crit/10 text-2xl">
          🩺
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Something misfired</h1>
        <p className="mt-2 text-sm text-ink-soft">
          MEDULA hit an unexpected error while rendering this view. Your study data is
          safe — try again, and if it persists, reload the app.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">ref: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset} className="min-h-11">
            Try again
          </Button>
          <Button variant="outline" className="min-h-11" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  )
}
