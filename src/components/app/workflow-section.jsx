import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const steps = [
  {
    number: '01',
    title: 'Select a Problem',
    description:
      'Select your technical interview problem based on a specific topic, difficulty, or company from our curated list of 30+ problems that have been asked at top tech companies.'
  },
  {
    number: '02',
    title: 'The Technical Loop',
    description:
      'Practice with an AI interviewer that assesses your problem-solving approach, edge-case handling, and code quality in real time, backed by sub-2000ms voice responses that keep the conversation flowing naturally. Write, run, and test your solution directly in our integrated coding environment.'
  },
  {
    number: '03',
    title: 'Post-Interview Feedback',
    description:
      'Receive a comprehensive breakdown of your performance based on real FAANG interview rubrics that focus on code quality, problem solving, communication, and culture fit.'
  }
]

function Mockup1() {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-cyan-300/20 bg-black p-3 shadow-[0_0_70px_rgba(34,211,238,0.18),inset_0_0_40px_rgba(59,130,246,0.08)] md:p-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="relative mb-3 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/70">
        <span>Problem Grid</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]" />
      </div>
      <div className="relative w-full flex-1 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#020409] shadow-[0_10px_60px_rgba(0,0,0,0.75),inset_0_0_30px_rgba(34,211,238,0.08)]">
        <img src="/problemset.png" alt="Problem Selection Interface" className="h-full w-full object-cover object-left-top opacity-70 contrast-125 saturate-150 transition duration-500 group-hover:scale-[1.015] group-hover:opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(34,211,238,0.16),transparent_32%,rgba(168,85,247,0.18)_78%,transparent)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.055)_0px,rgba(255,255,255,0.055)_1px,transparent_1px,transparent_5px)] opacity-25" />
        <div className="absolute inset-x-6 top-5 h-px bg-cyan-200/60 shadow-[0_0_20px_rgba(103,232,249,0.9)]" />
      </div>
    </div>
  )
}

function Mockup2() {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-violet-300/20 bg-black p-3 shadow-[0_0_70px_rgba(168,85,247,0.18),inset_0_0_40px_rgba(34,211,238,0.08)] md:p-4">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="relative mb-3 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-violet-100/70">
        <span>Live Sandbox</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.95)]" />
          Online
        </span>
      </div>
      <div className="relative w-full flex-1 overflow-hidden rounded-2xl border border-violet-300/20 bg-[#020409] shadow-[0_10px_60px_rgba(0,0,0,0.75),inset_0_0_30px_rgba(168,85,247,0.08)]">
        <img src="/codingsandbox.png" alt="Coding Sandbox Interface" className="h-full w-full object-cover object-left-top opacity-[0.72] contrast-125 saturate-150 transition duration-500 group-hover:scale-[1.015] group-hover:opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.2),transparent_38%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_7px)] opacity-20" />
        <div className="absolute bottom-5 right-5 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.24)]">
          Tests synced
        </div>
      </div>
    </div>
  )
}

function Mockup3() {
  return (
    <div className="relative flex h-full items-center justify-between overflow-hidden rounded-[28px] border border-cyan-300/20 bg-[#020409] p-6 shadow-[0_0_80px_rgba(34,211,238,0.2),inset_0_0_50px_rgba(168,85,247,0.08)] md:p-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 shadow-[0_0_70px_rgba(34,211,238,0.18)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(135deg,rgba(168,85,247,0.12),transparent_45%)]" />
      <div className="relative flex-1 pr-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200/60">Feedback Engine</p>
        <h4 className="mb-6 font-bold text-white">Performance Matrix</h4>
        <div className="space-y-5">
          {[
            ['Algorithms', 'Strong', 'w-[85%]', 'from-emerald-400 to-cyan-300'],
            ['Communication', 'Needs Work', 'w-[45%]', 'from-amber-300 to-fuchsia-300'],
            ['Speed', 'Optimal', 'w-[95%]', 'from-cyan-300 to-violet-300']
          ].map(([label, score, width, colors]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-400">{label}</span>
                <span className="text-cyan-200">{score}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.7)]">
                <div className={`h-full ${width} bg-gradient-to-r ${colors} shadow-[0_0_18px_rgba(34,211,238,0.7)]`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/5 shadow-[0_0_45px_rgba(34,211,238,0.2),inset_0_0_25px_rgba(34,211,238,0.08)] md:h-[120px] md:w-[120px]">
        <div className="absolute inset-3 rounded-full border border-fuchsia-300/20" />
        <svg className="h-full w-full text-cyan-300 drop-shadow-[0_0_18px_rgba(103,232,249,0.85)]" viewBox="0 0 100 100">
          <polygon points="50,10 90,40 75,90 25,90 10,40" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

const mockups = [Mockup1, Mockup2, Mockup3]

export function WorkflowSection() {
  const sectionRef = useRef(null)
  const isInitialMount = useRef(true)
  const [activeStep, setActiveStep] = useState(0)
  const [scrollDirection, setScrollDirection] = useState(1)
  const MockupComponent = mockups[activeStep]

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const section = sectionRef.current
    if (!section) return

    const rect = section.getBoundingClientRect()
    const isVisible = rect.top >= -100 && rect.top <= window.innerHeight * 0.3

    if (!isVisible) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeStep])

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative z-10 flex min-h-screen w-full items-center overflow-hidden py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_80%_65%,rgba(168,85,247,0.14),transparent_32%)]" />
      <div className="pointer-events-none absolute left-0 right-0 top-20 h-px bg-cyan-200/20 shadow-[0_0_50px_rgba(34,211,238,0.35)]" />
      <div className="mx-auto w-full max-w-6xl px-6">
        <h1 className="mb-16 text-center text-3xl font-bold text-white drop-shadow-[0_0_28px_rgba(34,211,238,0.22)] md:text-4xl lg:text-5xl">
          Mock Interview Flow
        </h1>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {steps.map((step, i) => (
                  <button
                    key={step.number}
                    onClick={() => {
                      setScrollDirection(i > activeStep ? 1 : -1)
                      setActiveStep(i)
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      i === activeStep ? 'scale-125 bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.9)]' : 'bg-white/20 hover:bg-cyan-200/60'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-100/40">
                <span>Click indicators to explore</span>
              </div>
            </div>
            <div className="relative min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: scrollDirection > 0 ? 30 : -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: scrollDirection > 0 ? -30 : 30 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan-200/55">{steps[activeStep].number}</p>
                  <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">{steps[activeStep].title}</h3>
                  <p className="text-base leading-relaxed text-gray-400 md:text-lg">{steps[activeStep].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative h-[320px] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: scrollDirection > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: scrollDirection > 0 ? -40 : 40 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                >
                  <MockupComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
