import { useEffect, useState } from 'react'
import DotPattern from './components/app/DotPattern'
import { CompanyTicker } from './components/app/company-ticker'
import { LandingInterviewSection } from './components/app/landing-interview-section'
import { ScrollAnimation } from './components/app/scroll-animation'
import { WorkflowSection } from './components/app/workflow-section'
import { Check, X as XIcon } from 'lucide-react'
import './App.css'

export default function App() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  useEffect(() => {
    if (!waitlistOpen) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setWaitlistOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [waitlistOpen])

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white selection:bg-purple-500/30">
      <DotPattern className="absolute inset-0 pointer-events-none" />

      <nav className="absolute top-0 left-0 z-[100] flex w-full items-center justify-between p-6 pointer-events-auto md:p-8">
        <a href="/" className="flex items-center" aria-label="MockQ home">
          <span className="text-xl font-semibold tracking-[0.04em] text-white md:text-2xl">
            MockQ
          </span>
        </a>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className="flex h-10 items-center rounded-full border border-white/20 bg-white/90 px-6 text-sm font-medium text-black shadow-sm backdrop-blur-md transition-all hover:bg-white"
          >
            Sign up
          </button>
        </div>
      </nav>

      <section className="relative z-50 flex flex-1 flex-col items-center justify-center px-4 pt-32 pb-8 text-center pointer-events-auto">
        <h1 className="mb-4 text-center text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          <span className="bg-clip-text text-7xl font-extrabold tracking-tight text-transparent text-white md:text-8xl">
            Ace Your Next
          </span>
          <br />
          <span className="text-white">SWE Interview</span>
        </h1>
        <p className="mb-12 max-w-4xl text-center text-lg text-gray-400 md:text-xl">
          Practice with real-time AI interviewers that follow your code and reasoning.
        </p>

        <LandingInterviewSection />
      </section>

      <CompanyTicker />
      <WorkflowSection />

      <ScrollAnimation direction="right" className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24">
        <h2 className="mb-12 max-w-2xl text-center text-2xl font-bold leading-tight md:text-3xl">
          Bridging the gap between knowing the answer and delivering it under pressure.
        </h2>

        <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-5 font-medium text-gray-400">Feature</th>
                <th className="px-6 py-5 text-center font-medium text-gray-400">Final Round AI</th>
                <th className="px-6 py-5 text-center font-medium text-gray-400">interviewing.io</th>
                <th className="px-6 py-5 text-center font-bold text-white">MockQ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ['Real-time AI Voice Interviewer', 'yes', 'no', 'yes'],
                ['Sub-2000ms Conversational Latency', 'yes', 'no', 'yes'],
                ['Edge Case & Assumption Verification', 'partial', 'yes', 'yes'],
                ['Live Code Execution & Testing', 'no', 'partial', 'yes'],
                ['Multi-Language Support', 'partial', 'yes', 'yes'],
                ['FAANG Interview Questions', 'partial', 'yes', 'yes'],
                ['Structured Rubric Scoring', 'partial', 'partial', 'yes']
              ].map(([feature, finalRound, interviewing, mockq], index) => (
                <tr key={feature} className={`${index < 4 ? 'border-b border-white/5' : ''} ${index === 2 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="px-6 py-4 text-gray-300">{feature}</td>
                  <StatusCell status={finalRound} />
                  <StatusCell status={interviewing} />
                  <StatusCell status={mockq} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Yes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-yellow-500 opacity-70">&mdash;</span>
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <XIcon className="h-4 w-4 text-red-500 opacity-70" />
            <span>No</span>
          </div>
        </div>
      </ScrollAnimation>

      <ScrollAnimation direction="down" className="relative z-10 mb-24 flex w-full flex-col items-center px-4 py-32 text-center">
        <h2 className="mb-8 max-w-2xl text-3xl font-bold text-white md:text-4xl">
          Stop grinding blindly. Start practicing with real-time feedback.
        </h2>
        <button
          type="button"
          onClick={() => setWaitlistOpen(true)}
          className="flex h-12 items-center rounded-full bg-white px-8 text-base font-medium text-black shadow-sm transition-all hover:bg-gray-200"
        >
          Get started
        </button>
      </ScrollAnimation>

      {waitlistOpen && <WaitlistModal onClose={() => setWaitlistOpen(false)} />}
    </main>
  )
}

function WaitlistModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Unable to join the waitlist.')
      }

      setStatus('success')
      setMessage("You're on the waitlist. We'll be in touch soon.")
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to join the waitlist.')
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close waitlist signup"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xl"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-6 text-left shadow-2xl backdrop-blur-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <XIcon className="h-4 w-4" />
        </button>

        <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-cyan-200/60">
          Waitlist
        </p>
        <h2 className="pr-10 text-2xl font-bold text-white md:text-3xl">
          Get early access
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Join the MockQ waitlist and we&apos;ll send you access as soon as spots open.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              disabled={status === 'loading' || status === 'success'}
              className="h-12 w-full rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined' : 'Join waitlist'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

function StatusCell({ status }) {
  if (status === 'yes') {
    return (
      <td className="px-6 py-4 text-center">
        <Check className="mx-auto h-5 w-5 text-green-500" />
      </td>
    )
  }

  if (status === 'no') {
    return (
      <td className="px-6 py-4 text-center">
        <XIcon className="mx-auto h-5 w-5 text-red-500 opacity-70" />
      </td>
    )
  }

  return (
    <td className="px-6 py-4 text-center font-bold text-yellow-500 opacity-70">
      &mdash;
    </td>
  )
}
