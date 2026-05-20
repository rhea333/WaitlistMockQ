// ─── Onboarding Types & State ───────────────────────────────────────────────

export type UserType = "student" | "new-grad" | "professional"

export type PrimaryGoal =
  | "general-practice"
  | "specific-companies"
  | "improve-weak-areas"

export type ImprovementArea =
  | "dsa"
  | "system-design"
  | "behavioral"
  | "technical-communication"
  | "all"

export type SeniorityLevel =
  | "junior"
  | "mid"
  | "senior"
  | "staff"
  | "manager"

export interface OnboardingData {
  // Step 1
  userType: UserType | null

  // Step 2
  resumeFile: File | null
  resumeFileName: string
  targetRoles: string[]
  primaryGoal: PrimaryGoal | null
  targetCompanies: string[]

  // Step 3 – Student
  university: string
  graduationYear: string

  // Step 3 – New Grad
  newGradExperience: string

  // Step 3 – Professional
  professionalExperience: string
  seniorityLevel: SeniorityLevel | null

  // Step 3 – Shared (Student & New Grad)
  improvementAreas: ImprovementArea[]
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  userType: null,
  resumeFile: null,
  resumeFileName: "",
  targetRoles: [],
  primaryGoal: null,
  targetCompanies: [],
  university: "",
  graduationYear: "",
  newGradExperience: "",
  professionalExperience: "",
  seniorityLevel: null,
  improvementAreas: [],
}

// ─── Constants ──────────────────────────────────────────────────────────────

export const TARGET_ROLE_SUGGESTIONS = [
  "Software Engineer Intern",
  "New Grad SDE",
  "Junior Software Engineer",
  "Software Engineer",
  "Senior Software Engineer",
  "Senior Backend Engineer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "DevOps Engineer",
  "Data Engineer",
  "ML Engineer",
  "Staff Engineer",
  "Engineering Manager",
]

export const GRADUATION_YEARS = ["2025", "2026", "2027", "2028+"]

export const EXPERIENCE_NEW_GRAD = ["0 years", "< 1 year", "1 year", "2 years"]

export const EXPERIENCE_PROFESSIONAL = ["2–5 years", "5–8 years", "8–12 years", "12+ years"]

export const IMPROVEMENT_LABELS: Record<ImprovementArea, string> = {
  dsa: "Data Structures & Algorithms",
  "system-design": "System Design",
  behavioral: "Behavioral Questions",
  "technical-communication": "Technical Communication",
  all: "All of the above",
}

export const SENIORITY_LABELS: Record<SeniorityLevel, string> = {
  junior: "Junior / Associate",
  mid: "Mid-level",
  senior: "Senior",
  staff: "Staff / Principal",
  manager: "Engineering Manager",
}

export const ACCEPTED_FILE_TYPES = ".pdf,.docx,.txt"
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

// ─── Persistence helpers (localStorage) ─────────────────────────────────────

const STORAGE_KEY = "mockq-onboarding"

export function saveOnboardingProgress(step: number, data: OnboardingData) {
  try {
    // Files can't be serialized — strip it out before saving
    const serializable = { ...data, resumeFile: null }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, data: serializable })
    )
  } catch {
    // localStorage may be unavailable
  }
}

export function loadOnboardingProgress(): {
  step: number
  data: OnboardingData
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearOnboardingProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // noop
  }
}
