"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BriefcaseBusiness, Check, Linkedin, Sparkles } from "lucide-react"

const goals = [
  "Practice interviews",
  "Prepare for a real interview",
  "Improve communication/confidence",
  "Get matched to startups/jobs",
  "Compete for networking event spots",
  "Explore career paths",
]

const roles = [
  "Software Engineering",
  "Product Management",
  "Data Analyst",
  "UX/UI Design",
  "Consulting",
  "Sales",
  "AI/ML",
  "Marketing",
  "Finance",
  "Other",
]

const experienceLevels = ["Student", "New Grad", "Early Career", "Mid-Level", "Senior"]
const workTypes = ["Internship", "Full-time", "Contract"]
const interviewTypes = ["Behavioral", "Technical", "Product sense", "Case study", "Resume-based", "AI interview"]

type OnboardingState = {
  firstName: string
  lastName: string
  email: string
  password: string
  goal: string
  role: string
  experienceLevel: string
  workType: string
  hasInterview: "yes" | "no" | ""
  company: string
  interviewDate: string
  interviewType: string
}

const initialState: OnboardingState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  goal: "",
  role: "",
  experienceLevel: "",
  workType: "",
  hasInterview: "",
  company: "",
  interviewDate: "",
  interviewType: "",
}

export default function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialState)

  const progress = useMemo(() => Math.round((step / 5) * 100), [step])

  const patch = (patchData: Partial<OnboardingState>) => {
    setData((prev) => ({ ...prev, ...patchData }))
  }

  const next = () => {
    if (step < 5) {
      setStep((current) => current + 1)
      return
    }

    try {
      localStorage.setItem("mockq-onboarding-profile", JSON.stringify(data))
    } catch {
      // localStorage may be unavailable.
    }
    router.push("/interview-setup")
  }

  const back = () => setStep((current) => Math.max(1, current - 1))

  const canContinue =
    step === 1
      ? data.firstName.trim() && data.lastName.trim() && data.email.trim() && data.password.trim()
      : step === 2
        ? data.goal
        : step === 3
          ? data.role && data.experienceLevel && data.workType
          : step === 4
            ? data.hasInterview && (data.hasInterview === "no" || data.interviewType)
            : true

  return (
    <div className="relative z-10 flex min-h-screen w-full items-center justify-center bg-black p-4 text-white sm:p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-white/50">
            <span>Step {step} of 5</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === 1 && (
          <Panel
            eyebrow="Account creation"
            title="Create your MockQ account"
            subtitle="Just the basics. You can reach your first mock interview in minutes."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="First name" value={data.firstName} onChange={(value) => patch({ firstName: value })} />
              <Input label="Last name" value={data.lastName} onChange={(value) => patch({ lastName: value })} />
            </div>
            <Input label="Email" type="email" value={data.email} onChange={(value) => patch({ email: value })} />
            <Input label="Password" type="password" value={data.password} onChange={(value) => patch({ password: value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <SocialButton label="Continue with Google" />
              <SocialButton label="Continue with LinkedIn" icon={Linkedin} />
            </div>
          </Panel>
        )}

        {step === 2 && (
          <Panel
            eyebrow="Goal selection"
            title="What brings you to MockQ today?"
            subtitle="We will use this to shape your first interview path immediately."
          >
            <ChoiceGrid items={goals} selected={data.goal} onSelect={(goal) => patch({ goal })} />
          </Panel>
        )}

        {step === 3 && (
          <Panel
            eyebrow="Target role"
            title="What role are you preparing for?"
            subtitle="This calibrates questions, difficulty, and feedback."
          >
            <ChoiceGrid items={roles} selected={data.role} onSelect={(role) => patch({ role })} compact />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Experience level" value={data.experienceLevel} options={experienceLevels} onChange={(experienceLevel) => patch({ experienceLevel })} />
              <Select label="Opportunity type" value={data.workType} options={workTypes} onChange={(workType) => patch({ workType })} />
            </div>
          </Panel>
        )}

        {step === 4 && (
          <Panel
            eyebrow="Interview context"
            title="Do you have an upcoming interview?"
            subtitle="If yes, MockQ can make your first session feel more realistic."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ChoiceCard label="Yes" active={data.hasInterview === "yes"} onClick={() => patch({ hasInterview: "yes" })} />
              <ChoiceCard label="No" active={data.hasInterview === "no"} onClick={() => patch({ hasInterview: "no" })} />
            </div>
            {data.hasInterview === "yes" && (
              <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <Input label="Company name" optional value={data.company} onChange={(company) => patch({ company })} />
                <Input label="Interview date" type="date" value={data.interviewDate} onChange={(interviewDate) => patch({ interviewDate })} />
                <Select label="Interview type" value={data.interviewType} options={interviewTypes} onChange={(interviewType) => patch({ interviewType })} />
              </div>
            )}
          </Panel>
        )}

        {step === 5 && (
          <Panel
            eyebrow="Immediate value"
            title="Your first mock interview is ready"
            subtitle="No resume required. We will use what you shared to generate a focused interview setup."
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{data.role || "Personalized"} mock interview</p>
                  <p className="text-sm text-white/50">{data.goal || "Practice interviews"} • {data.experienceLevel || "Calibrated difficulty"}</p>
                </div>
              </div>
              <div className="grid gap-2 text-sm text-white/70 sm:grid-cols-3">
                <ValuePill label="Role-specific prompts" />
                <ValuePill label="Real-time feedback" />
                <ValuePill label="Low-pressure practice" />
              </div>
            </div>
          </Panel>
        )}

        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              Back
            </button>
          )}
          <button
            type="button"
            disabled={!canContinue}
            onClick={next}
            className={`flex-1 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
              canContinue ? "bg-white text-black hover:bg-white/90" : "bg-white/15 text-white/35"
            }`}
          >
            {step === 5 ? "Start my first mock interview" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Panel({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">{subtitle}</p>
      <div className="mt-8 space-y-5">{children}</div>
    </section>
  )
}

function Input({ label, value, onChange, type = "text", optional }: { label: string; value: string; onChange: (value: string) => void; type?: string; optional?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/75">
        {label} {optional ? <span className="text-white/35">(optional)</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/35"
      />
    </label>
  )
}

function SocialButton({ label, icon: Icon = BriefcaseBusiness }: { label: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80 hover:bg-white/[0.08]">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function ChoiceGrid({ items, selected, onSelect, compact }: { items: string[]; selected: string; onSelect: (item: string) => void; compact?: boolean }) {
  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
      {items.map((item) => (
        <ChoiceCard key={item} label={item} active={selected === item} onClick={() => onSelect(item)} />
      ))}
    </div>
  )
}

function ChoiceCard({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-16 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
        active ? "border-white/50 bg-white text-black" : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
      {active ? <Check className="h-4 w-4" /> : null}
    </button>
  )
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/75">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-white/10 bg-[#111] px-4 text-sm text-white outline-none focus:border-white/35"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function ValuePill({ label }: { label: string }) {
  return <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center">{label}</div>
}
