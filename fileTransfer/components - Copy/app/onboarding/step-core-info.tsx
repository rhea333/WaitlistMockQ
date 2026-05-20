"use client"

import React, { useState } from "react"
import type { OnboardingData, PrimaryGoal } from "@/lib/onboarding-types"
import { TARGET_ROLE_SUGGESTIONS } from "@/lib/onboarding-types"
import { ResumeUpload } from "@/components/app/resume-upload"
import { useRouter } from "next/navigation"
interface StepCoreInfoProps {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

function TargetRoleInput({
  roles,
  onChange,
}: {
  roles: string[]
  onChange: (roles: string[]) => void
}) {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filtered = TARGET_ROLE_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) && !roles.includes(s)
  )

  const addRole = (role: string) => {
    const trimmed = role.trim()
    if (trimmed && !roles.includes(trimmed)) {
      onChange([...roles, trimmed])
    }
    setInput("")
    setShowSuggestions(false)
  }

  const removeRole = (role: string) => onChange(roles.filter((r) => r !== role))

  return (
    <div className="space-y-2">
      <label
        htmlFor="target-role"
        className="block text-sm font-medium text-white/80"
      >
        Target role(s)
      </label>

      <div className="relative">
        <input
          id="target-role"
          type="text"
          value={input}
          placeholder="e.g. Software Engineer Intern"
          autoComplete="off"
          onClick={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onChange={(e) => {
            setInput(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault()
              addRole(input)
            }
          }}
          className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 outline-none text-sm text-white placeholder:text-white/30 focus:border-white/30 transition-colors"
        />

        {showSuggestions && filtered.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-black/90 backdrop-blur-lg py-1 glass-scrollbar">
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addRole(s)}
                  className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {roles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {roles.map((r) => (
            <span
              key={r}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/[0.06] text-xs text-white/80"
            >
              {r}
              <button
                type="button"
                aria-label={`Remove ${r}`}
                onClick={() => removeRole(r)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const GOALS: { value: PrimaryGoal; label: string }[] = [
  { value: "general-practice", label: "Practice general interview skills" },
  { value: "specific-companies", label: "Prepare for specific companies" },
  { value: "improve-weak-areas", label: "Improve in weak areas" },
]

function PrimaryGoalSelect({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (p: Partial<OnboardingData>) => void
}) {
  const [companyInput, setCompanyInput] = useState("")

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">
        What&apos;s your primary goal?
      </label>

      <div className="space-y-2">
        {GOALS.map((g) => {
          const isSelected = data.primaryGoal === g.value
          return (
            <button
              key={g.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange({ primaryGoal: g.value })}
              className={`
                w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 cursor-pointer 
                ${
                  isSelected
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:text-white/80"
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-white bg-white" : "border-white/30"
                  }`}
                >
                  {isSelected && (
                    <span className="block w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </span>
                {g.label}
              </span>
            </button>
          )
        })}
      </div>

      {data.primaryGoal === "specific-companies" && (
        <div className="mt-3 space-y-2">
          <label
            htmlFor="company-input"
            className="block text-xs text-white/50"
          >
            Which companies? <span className="text-white/30">(optional)</span>
          </label>
          <input
            id="company-input"
            type="text"
            value={companyInput}
            placeholder="e.g. Google, Meta, Stripe"
            onChange={(e) => setCompanyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && companyInput.trim()) {
                e.preventDefault()
                const names = companyInput
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                onChange({
                  targetCompanies: [
                    ...new Set([...data.targetCompanies, ...names]),
                  ],
                })
                setCompanyInput("")
              }
            }}
            className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 outline-none text-sm text-white placeholder:text-white/30 focus:border-white/30 transition-colors"
          />

          {data.targetCompanies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.targetCompanies.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/[0.06] text-xs text-white/80"
                >
                  {c}
                  <button
                    type="button"
                    aria-label={`Remove ${c}`}
                    onClick={() =>
                      onChange({
                        targetCompanies: data.targetCompanies.filter(
                          (x) => x !== c
                        ),
                      })
                    }
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function StepCoreInfo({
  data,
  onChange,
  onNext,
  onBack,
}: StepCoreInfoProps) {
  const canContinue =
    data.resumeFile !== null &&
    data.targetRoles.length > 0 &&
    data.primaryGoal !== null
    
    const router = useRouter()

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-1 text-center">
        Tell us about yourself
      </h1>
      <p className="text-sm text-white/50 mb-8 text-center">
        This helps us personalize your interviews and job matches.
      </p>

      <div className="space-y-6">
        <ResumeUpload
          resumeFileName={data.resumeFileName}
          onFileSelected={(file, fileName) =>
            onChange({ resumeFile: file, resumeFileName: fileName })
          }
        />
        <TargetRoleInput
          roles={data.targetRoles}
          onChange={(r) => onChange({ targetRoles: r })}
        />
        <PrimaryGoalSelect data={data} onChange={onChange} />
      </div>

      <div className="flex gap-3 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-lg font-semibold text-sm border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-md transition-all"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className={`
            flex-1 py-3 rounded-lg font-semibold text-sm transition-all duration-200
            ${
              canContinue
                ? "bg-white text-black hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-md transition-all"
                : "bg-white/20 text-white/40 cursor-not-allowed"
            }
          `}
        >
          Continue
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push("/practice")}
        className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors self-center cursor-pointer"
      >
        Skip
      </button>
    </div>
  )
}


