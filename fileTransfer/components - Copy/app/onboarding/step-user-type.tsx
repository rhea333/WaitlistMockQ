"use client"

import React from "react"
import type { UserType, OnboardingData } from "@/lib/onboarding-types"
import { useRouter } from "next/navigation"

interface StepUserTypeProps {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
  onNext: () => void
}

const USER_TYPES: {
  value: UserType
  label: string
  tagline: string
  illustration: React.ReactNode
}[] = [
  {
    value: "student",
    label: "Student",
    tagline: "Build interview confidence while in school",
    illustration: (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        className="w-16 h-16 mx-auto mb-3"
        aria-hidden="true"
      >
        <rect
          x="20"
          y="30"
          width="40"
          height="30"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/60"
        />
        <path
          d="M40 18L58 28L40 38L22 28L40 18Z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/80"
        />
        <line
          x1="40"
          y1="38"
          x2="40"
          y2="55"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/60"
        />
        <circle cx="40" cy="56" r="2" fill="currentColor" className="text-white/60" />
      </svg>
    ),
  },
  {
    value: "new-grad",
    label: "New Grad",
    tagline: "Land your first role with expert preparation",
    illustration: (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        className="w-16 h-16 mx-auto mb-3"
        aria-hidden="true"
      >
        <circle
          cx="40"
          cy="30"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/60"
        />
        <path
          d="M24 55C24 46.16 31.16 40 40 40C48.84 40 56 46.16 56 55"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-white/80"
        />
        <path
          d="M35 60L40 66L50 54"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/80"
        />
      </svg>
    ),
  },
  {
    value: "professional",
    label: "Professional",
    tagline: "Level up to your next opportunity",
    illustration: (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        className="w-16 h-16 mx-auto mb-3"
        aria-hidden="true"
      >
        <rect
          x="18"
          y="32"
          width="44"
          height="28"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/60"
        />
        <path
          d="M30 32V26C30 22.69 32.69 20 36 20H44C47.31 20 50 22.69 50 26V32"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/80"
        />
        <line
          x1="18"
          y1="44"
          x2="62"
          y2="44"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/40"
        />
        <circle cx="40" cy="44" r="3" fill="currentColor" className="text-white/70" />
      </svg>
    ),
  },
]

export default function StepUserType({ data, onChange, onNext }: StepUserTypeProps) {
  const selected = data.userType
  const router = useRouter()

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2">
        How are you planning to use MockQ?
      </h1>
      <p className="text-sm text-white/60 mb-10 max-w-md">
        We&apos;ll tailor your interview prep experience accordingly. This entire onboarding section is optional and can be skipped if you&apos;d like to jump right in!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
        {USER_TYPES.map((t) => {
          const isActive = selected === t.value
          return (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={t.label}
              onClick={() => onChange({ userType: t.value })}
              className={`
                relative flex flex-col items-center p-6 rounded-xl border transform transition-transform duration-300 hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "border-white/40 bg-white/10 shadow-lg shadow-white/5"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }
              `}
            >
              <span
                className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isActive ? "border-white bg-white" : "border-white/30"
                }`}
              >
                {isActive && (
                  <span className="block w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </span>

              {t.illustration}
              <span className="font-medium text-white text-base">{t.label}</span>
              <span className="text-xs text-white/50 mt-1 leading-snug">
                {t.tagline}
              </span>
            </button>
          )
        })}
      </div>

      

      <button
        type="button"
        disabled={!selected}
        onClick={onNext}
        className={`
          w-full max-w-xs py-3 rounded-lg font-semibold text-sm transition-all duration-200
          ${
            selected
              ? "bg-white text-black hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:shadow-md transition-all"
              : "bg-white/20 text-white/40 cursor-not-allowed "
          }
        `}
      >
        Continue
      </button>
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
