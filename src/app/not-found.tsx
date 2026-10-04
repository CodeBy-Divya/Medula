'use client'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="clay w-full max-w-md rounded-2xl p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-2xl">
          🧭
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Off the map</h1>
        <p className="mt-2 text-sm text-ink-soft">
          This page doesn&apos;t exist. MEDULA lives on a single route — head back to base.
        </p>
        <Button className="mt-6 min-h-11" onClick={() => window.location.assign('/')}>
          Back to MEDULA
        </Button>
      </div>
    </div>
  )
}
