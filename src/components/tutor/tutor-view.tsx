'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'
import {
  Baby,
  Bot,
  Brain,
  Eraser,
  GraduationCap,
  Languages,
  Lightbulb,
  Loader2,
  Microscope,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type TutorMode = 'simple' | 'exam' | 'clinical' | 'deep' | 'rapid' | 'eli5' | 'hinglish'

interface TutorMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  /** true when the user turn that produced this reply looked like a real-patient question */
  sensitive?: boolean
}

const MODES: { id: TutorMode; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'simple', label: 'Simple', icon: Lightbulb, desc: 'Clear explanation with analogies, first-year level' },
  { id: 'exam', label: 'Exam Mode', icon: GraduationCap, desc: 'High-yield, fact-dense answer with classic exam traps' },
  { id: 'clinical', label: 'Clinical', icon: Stethoscope, desc: 'Case approach: history, exam, differentials, management' },
  { id: 'deep', label: 'Deep Dive', icon: Microscope, desc: 'Mechanistic pathophysiology chain, cross-subject links' },
  { id: 'rapid', label: 'Rapid Revision', icon: Zap, desc: 'Ultra-condensed one-liner recall sheet' },
  { id: 'eli5', label: 'ELI5', icon: Baby, desc: 'Everyday analogies mapped back to real terms' },
  { id: 'hinglish', label: 'Hinglish', icon: Languages, desc: 'Friendly Hindi-English mix, medical terms in English' },
]

const SUGGESTED_PROMPTS = [
  'Explain the RAAS cascade',
  'Nephritic vs nephrotic — compare',
  'Why does DKA cause Kussmaul breathing?',
  'Create 3 MCQs on beta-blockers',
  'Mnemonic for ATT drug toxicities',
]

// Client-side safety net: real-patient phrasing gets an inline notice under the reply.
const SENSITIVE_RE = /my patient|should i (give|prescribe|start)|real patient/i

const SENSITIVE_NOTICE =
  'This looks like a real-patient question — MEDOS is educational. Discuss with your seniors/faculty.'

const FOOTER_TEXT =
  'Educational content only — not for real-patient decisions. The AI can be wrong; verify against standard textbooks.'

// Session-storage key written by the global search overlay ("Ask the tutor" hand-off).
const TUTOR_QUESTION_KEY = 'medos:tutor-question'

let msgSeq = 0
const nextId = (role: string) => `${role}-${Date.now()}-${msgSeq++}`

// Markdown styling: compact headings, scrollable tables, tight lists. Code is not expected.
const MD_COMPONENTS: Components = {
  h1: ({ children }) => <h3 className="mt-3 text-base font-semibold tracking-tight first:mt-0">{children}</h3>,
  h2: ({ children }) => <h4 className="mt-3 text-sm font-semibold tracking-tight first:mt-0">{children}</h4>,
  h3: ({ children }) => <h5 className="mt-2.5 text-sm font-semibold text-foreground/90 first:mt-0">{children}</h5>,
  h4: ({ children }) => <h6 className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-soft first:mt-0">{children}</h6>,
  p: ({ children }) => <p className="my-1.5 text-sm leading-relaxed first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed marker:text-primary/70">{children}</ul>,
  ol: ({ children }) => <ol className="my-1.5 list-decimal space-y-1 pl-4 text-sm leading-relaxed marker:text-primary/70">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="text-ink-soft">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-primary/50 pl-3 text-sm italic text-ink-soft">{children}</blockquote>
  ),
  hr: () => <hr className="my-3 border-line" />,
  code: ({ children }) => <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">{children}</code>,
  pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-lg border border-line bg-surface-2 p-2 text-xs">{children}</pre>,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-xs [&_td]:border-b [&_td]:border-line/70 [&_td]:px-2 [&_td]:py-1.5 [&_th]:bg-surface-2 [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold [&_tr:last-child_td]:border-b-0">
        {children}
      </table>
    </div>
  ),
}

// ─── Thinking indicator ──────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="flex items-center gap-2.5"
      aria-live="polite"
      role="status"
    >
      <span className="glass grid size-8 shrink-0 place-items-center rounded-xl" aria-hidden>
        <Brain className="size-4 text-primary" />
      </span>
      <span className="glass inline-flex items-center gap-2.5 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
        <span className="flex items-end gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1.5 rounded-full bg-primary"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </span>
        <span className="text-xs text-ink-soft">Thinking through this…</span>
      </span>
    </motion.div>
  )
}

// ─── TutorView ───────────────────────────────────────────────────────────────

export function TutorView() {
  const [mode, setMode] = useState<TutorMode>('exam')
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const bootRef = useRef(false)
  // Latest in-flight request wins; stale replies are dropped.
  const reqRef = useRef(0)

  const autosize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [])

  const send = useCallback(
    async (raw: string, history: TutorMessage[]) => {
      const content = raw.trim()
      if (!content) return
      const req = ++reqRef.current

      const userMsg: TutorMessage = { id: nextId('user'), role: 'user', content, sensitive: SENSITIVE_RE.test(content) }
      const outgoing = [...history, userMsg]

      setMessages(outgoing)
      setInput('')
      setError(null)
      setThinking(true)

      try {
        const res = await api.tutor({
          messages: outgoing.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          mode,
          conceptId: undefined,
        })
        if (reqRef.current !== req) return
        setMessages((prev) => [
          ...prev,
          { id: nextId('assistant'), role: 'assistant', content: res.reply, sensitive: userMsg.sensitive },
        ])
      } catch {
        if (reqRef.current !== req) return
        setError('Could not reach the tutor. Your question is kept — try again.')
      } finally {
        if (reqRef.current === req) setThinking(false)
      }
    },
    [mode],
  )

  // Question handed off from the global search palette ("Ask the tutor" row).
  useEffect(() => {
    if (bootRef.current) return
    bootRef.current = true
    let q: string | null = null
    try {
      q = sessionStorage.getItem(TUTOR_QUESTION_KEY)
      if (q) sessionStorage.removeItem(TUTOR_QUESTION_KEY)
    } catch {
      q = null
    }
    if (!q) return
    const t = setTimeout(() => {
      textareaRef.current?.focus()
      void send(q as string, [])
    }, 60)
    return () => clearTimeout(t)
  }, [send])

  // Keep the thread pinned to the newest bubble.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const onKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return
    e.preventDefault()
    if (!thinking && input.trim()) void send(input, messages)
  }

  const clear = () => {
    reqRef.current++
    setMessages([])
    setInput('')
    setError(null)
    setThinking(false)
  }

  const empty = messages.length === 0 && !thinking

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 px-4 pb-4 pt-6 md:px-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-500 dark:text-cyan-300">
            <Stethoscope className="size-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Ask Your Medical Tutor</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Educational explanations from your AI tutor — never medical advice for real patients.
            </p>
          </div>
        </div>
        {!empty && (
          <Button variant="ghost" size="sm" onClick={clear} className="mt-1 min-h-11 gap-1.5 text-ink-soft hover:text-foreground">
            <Eraser className="size-3.5" aria-hidden />
            Clear
          </Button>
        )}
      </header>

      {/* Mode selector */}
      <div role="radiogroup" aria-label="Tutor mode" className="flex flex-wrap gap-2">
        {MODES.map((m) => {
          const active = mode === m.id
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              title={m.desc}
              onClick={() => setMode(m.id)}
              className={cn(
                'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-all',
                active
                  ? 'border-primary/60 bg-primary/15 text-primary shadow-[0_0_20px_-8px_rgba(34,211,238,0.55)]'
                  : 'border-line bg-surface-2 text-ink-soft hover:border-primary/40 hover:text-foreground',
              )}
            >
              <m.icon className="size-4" aria-hidden />
              {m.label}
            </button>
          )
        })}
      </div>

      {/* Thread */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl pr-1"
        aria-live="polite"
        aria-label="Tutor conversation"
      >
        {empty && (
          <div className="flex h-full flex-col items-center justify-center gap-5 py-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="glass grid size-14 place-items-center rounded-2xl"
            >
              <Sparkles className="size-6 text-primary" aria-hidden />
            </motion.div>
            <div className="max-w-md">
              <p className="text-sm font-medium text-foreground">Where should we start?</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Pick a mode above, then ask anything from first year to final year — or try one of these:
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => void send(p, [])}
                  className="min-h-11 rounded-full border border-line bg-surface-2 px-4 text-xs font-medium text-ink-soft transition-all hover:border-primary/40 hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) =>
            m.role === 'user' ? (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-primary/30 bg-primary/15 px-4 py-2.5 text-sm leading-relaxed text-foreground">
                  {m.content}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="flex items-start gap-2.5"
              >
                <span className="glass mt-1 grid size-8 shrink-0 place-items-center rounded-xl" aria-hidden>
                  <Bot className="size-4 text-primary" />
                </span>
                <div className="min-w-0 max-w-[calc(100%-3rem)]">
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <Markdown components={MD_COMPONENTS}>{m.content}</Markdown>
                  </div>
                  {m.sensitive && (
                    <p className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-sev-warn/30 bg-sev-warn/10 px-2.5 py-1.5 text-xs leading-snug text-sev-warn">
                      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      {SENSITIVE_NOTICE}
                    </p>
                  )}
                </div>
              </motion.div>
            ),
          )}
          {thinking && <ThinkingDots key="thinking" />}
        </AnimatePresence>
      </div>

      {/* Error banner */}
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-sev-crit/30 bg-sev-crit/10 px-3.5 py-2.5">
          <p className="flex items-center gap-2 text-xs text-sev-crit">
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
            {error}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-9 gap-1.5 text-sev-crit hover:text-sev-crit"
            onClick={() => {
              const lastUser = [...messages].reverse().find((m) => m.role === 'user')
              if (lastUser) void send(lastUser.content, messages.filter((m) => m.id !== lastUser.id))
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Composer */}
      <div className="glass rounded-2xl p-2.5">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onInput={autosize}
            rows={1}
            placeholder={`Ask anything — try ${MODES.find((m) => m.id === mode)?.label ?? 'exam'} style…`}
            aria-label="Message your medical tutor"
            className="max-h-40 min-h-11 flex-1 resize-none border-none bg-transparent px-2 py-2.5 shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <Button
            size="icon"
            onClick={() => void send(input, messages)}
            disabled={thinking || !input.trim()}
            aria-label="Send message"
            className="size-11 shrink-0 rounded-xl"
          >
            {thinking ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <SendHorizontal className="size-4" aria-hidden />}
          </Button>
        </div>
      </div>

      {/* Permanent safety footer */}
      <footer className="flex items-start gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-sev-warn" aria-hidden />
        <p className="text-[11px] leading-snug text-ink-soft">{FOOTER_TEXT}</p>
      </footer>
    </div>
  )
}
