"use client"

import React from "react"
import type {
  OnboardingData,
  ImprovementArea,
  SeniorityLevel,
} from "@/lib/onboarding-types"
import {
  GRADUATION_YEARS,
  EXPERIENCE_NEW_GRAD,
  EXPERIENCE_PROFESSIONAL,
  IMPROVEMENT_LABELS,
  SENIORITY_LABELS,
} from "@/lib/onboarding-types"

import { useRouter } from "next/navigation"

interface StepPersonalizedProps {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

// ─── Shared: Improvement Areas Multi-Select ─────────────────────────────────

function ImprovementAreasSelect({
  selected,
  onChange,
}: {
  selected: ImprovementArea[]
  onChange: (areas: ImprovementArea[]) => void
}) {
  const toggle = (area: ImprovementArea) => {
    if (area === "all") {
      // toggle "all of the above"
      if (selected.includes("all")) {
        onChange([])
      } else {
        onChange(["all"])
      }
      return
    }

    // deselect "all" if individual items are toggled
    const without = selected.filter((a) => a !== "all")
    if (without.includes(area)) {
      onChange(without.filter((a) => a !== area))
    } else {
      onChange([...without, area])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">
        Areas you&apos;d like to improve
      </label>
      <div className="grid grid-cols-1 gap-2">
        {(Object.keys(IMPROVEMENT_LABELS) as ImprovementArea[]).map((area) => {
          const isChecked =
            selected.includes(area) || (area !== "all" && selected.includes("all"))
          return (
            <button
              key={area}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              onClick={() => toggle(area)}
              className={`
                w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 cursor-pointer
                ${
                  isChecked
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:text-white/80"
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                    isChecked ? "border-white bg-white" : "border-white/30"
                  }`}
                >
                  {isChecked && (
                    <svg
                      viewBox="0 0 12 12"
                      className="w-2.5 h-2.5 text-black"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  )}
                </span>
                {IMPROVEMENT_LABELS[area]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StudentFields({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (p: Partial<OnboardingData>) => void
}) {
  return (
    <div className="space-y-6">
      {/* University */}
      <div className="space-y-2">
        <label htmlFor="university" className="block text-sm font-medium text-white/80">
          University
        </label>
        <input
          id="university"
          type="text"
          value={data.university}
          placeholder="e.g. Stanford University"
          onChange={(e) => onChange({ university: e.target.value })}
          className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 outline-none text-sm text-white placeholder:text-white/30 focus:border-white/30 transition-colors"
        />
      </div>

      {/* Graduation Year */}
      <div className="space-y-2">
        <label htmlFor="grad-year" className="block text-sm font-medium text-white/80">
          Expected graduation year
        </label>
        <div className="grid grid-cols-4 gap-2">
          {GRADUATION_YEARS.map((yr) => {
            const active = data.graduationYear === yr
            return (
              <button
                key={yr}
                type="button"
                onClick={() => onChange({ graduationYear: yr })}
                className={`py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                {yr}
              </button>
            )
          })}
        </div>
      </div>

      {/* Improvement Areas */}
      <ImprovementAreasSelect
        selected={data.improvementAreas}
        onChange={(a) => onChange({ improvementAreas: a })}
      />
    </div>
  )
}

// ─── New Grad Fields ────────────────────────────────────────────────────────

function NewGradFields({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (p: Partial<OnboardingData>) => void
}) {
  return (
    <div className="space-y-6">
      {/* Experience */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">
          Years of experience
        </label>
        <div className="grid grid-cols-4 gap-2">
          {EXPERIENCE_NEW_GRAD.map((exp) => {
            const active = data.newGradExperience === exp
            return (
              <button
                key={exp}
                type="button"
                onClick={() => onChange({ newGradExperience: exp })}
                className={`py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                {exp}
              </button>
            )
          })}
        </div>
      </div>

      {/* Improvement Areas */}
      <ImprovementAreasSelect
        selected={data.improvementAreas}
        onChange={(a) => onChange({ improvementAreas: a })}
      />
    </div>
  )
}



function ProfessionalFields({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (p: Partial<OnboardingData>) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">
          Years of experience
        </label>
        <div className="grid grid-cols-4 gap-2">
          {EXPERIENCE_PROFESSIONAL.map((exp) => {
            const active = data.professionalExperience === exp
            return (
              <button
                key={exp}
                type="button"
                onClick={() => onChange({ professionalExperience: exp })}
                className={`py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                {exp}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">
          Current seniority level
        </label>
        <div className="space-y-2">
          {(Object.keys(SENIORITY_LABELS) as SeniorityLevel[]).map((level) => {
            const active = data.seniorityLevel === level
            return (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange({ seniorityLevel: level })}
                className={`
                  w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 cursor-pointer
                  ${
                    active
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:text-white/80"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      active ? "border-white bg-white" : "border-white/30"
                    }`}
                  >
                    {active && (
                      <span className="block w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </span>
                  {SENIORITY_LABELS[level]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function StepPersonalized({
  data,
  onChange,
  onNext,
  onBack,
}: StepPersonalizedProps) {
  const headlineMap: Record<string, string> = {
    student: "A few more details about your studies",
    "new-grad": "Almost there — just a few more details",
    professional: "Help us calibrate your experience level",
  }

  const subtitleMap: Record<string, string> = {
    student:
      "This helps us match interview difficulty and recommend the right prep resources.",
    "new-grad":
      "We'll use this to personalize your mock interviews and track what matters most.",
    professional:
      "This lets us tailor questions to your seniority and target level.",
  }

  const userType = data.userType ?? "student" 
  const router = useRouter()

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-1 text-center">
        {headlineMap[userType]}
      </h1>
      <p className="text-sm text-white/50 mb-8 text-center">
        {subtitleMap[userType]}
      </p>

      {userType === "student" && (
        <StudentFields data={data} onChange={onChange} />
      )}
      {userType === "new-grad" && (
        <NewGradFields data={data} onChange={onChange} />
      )}
      {userType === "professional" && (
        <ProfessionalFields data={data} onChange={onChange} />
      )}

      <div className="flex gap-3 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-lg font-semibold text-sm border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3 rounded-lg font-semibold text-sm bg-white text-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        >
          Get Started
        </button>
      </div>

      <button
        type="button"
        onClick={()=> router.push("/practice")}
        className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors self-center cursor-pointer"
      >
        Skip
      </button>
    </div>
  )
}
