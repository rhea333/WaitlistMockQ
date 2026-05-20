"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts"
import {
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Users,
  Brain,
  Code2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────

interface CompetencyRating {
  name: string
  score: number
  label: string
  evidence: string
  strengths: string
  weaknesses: string
}

interface OverallSummary {
  overallScore: number
  hireRecommendation: string
  justification: string
}

interface RationaleAndEvidence {
  strengths: string[]
  weaknesses: string[]
}

interface ParsedEvaluation {
  competencies: CompetencyRating[]
  summary: OverallSummary
  rationale: RationaleAndEvidence
  experienceSummary: string
  actionableSuggestions: string[]
}

// ─── Parser ───────────────────────────────────────────────────────────

function parseEvaluation(text: string): ParsedEvaluation {
  const competencies: CompetencyRating[] = []
  const competencyNames = [
    "Technical Skills",
    "Problem Solving",
    "Communication",
    "Cultural Fit and Collaboration",
  ]

  // Parse competency ratings (Section 1)
  for (const name of competencyNames) {
    const nameEscaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(
      `${nameEscaped}\\s*\\nScore:\\s*(\\d)\\s*[—–-]\\s*(.+?)\\s*\\nEvidence:\\s*([\\s\\S]+?)\\nStrengths:\\s*([\\s\\S]+?)\\nWeaknesses:\\s*([\\s\\S]+?)(?=\\n\\n|---|-{3,}|$)`
    )
    const match = text.match(regex)
    if (match) {
      competencies.push({
        name,
        score: parseInt(match[1], 10),
        label: match[2].trim(),
        evidence: match[3].trim(),
        strengths: match[4].trim(),
        weaknesses: match[5].trim(),
      })
    }
  }

  // Parse Section 2 - Overall Summary
  const scoreMatch = text.match(/Overall Score:\s*([\d.]+)/)
  const hireMatch = text.match(/Hire Recommendation:\s*(.+?)(?:\n|$)/)
  const justMatch = text.match(/Justification:\s*([\s\S]+?)(?=\n\n|---|-{3,}|$)/)

  const summary: OverallSummary = {
    overallScore: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
    hireRecommendation: hireMatch ? hireMatch[1].trim() : "Unknown",
    justification: justMatch ? justMatch[1].trim() : "",
  }

  // Parse Section 3 - Rationale and Evidence
  const rationaleSection = text.match(
    /SECTION 3[^]*?Strengths:\s*\n([\s\S]*?)Weaknesses:\s*\n([\s\S]*?)(?=---|-{3,}|SECTION 4)/
  )
  const rationale: RationaleAndEvidence = {
    strengths: [],
    weaknesses: [],
  }
  if (rationaleSection) {
    rationale.strengths = rationaleSection[1]
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    rationale.weaknesses = rationaleSection[2]
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  // Parse Section 4 - Experience Summary
  const expSection = text.match(
    /SECTION 4[^]*?EXPERIENCE SUMMARY\s*\n+([\s\S]*?)(?=---|-{3,}|SECTION 5)/
  )
  const experienceSummary = expSection ? expSection[1].trim() : ""

  // Parse Section 5 - Actionable Suggestions
  const sugSection = text.match(
    /SECTION 5[^]*?ACTIONABLE SUGGESTIONS\s*\n+([\s\S]*?)$/
  )
  const actionableSuggestions = sugSection
    ? sugSection[1]
      .split("\n")
      .map((s) => s.trim().replace(/^\d+\.\s+/, ""))
      .filter((s) => s.length > 0)
    : []

  return {
    competencies,
    summary,
    rationale,
    experienceSummary,
    actionableSuggestions,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 5) return "#22c55e"
  if (score >= 4) return "#4ade80"
  if (score >= 3) return "#facc15"
  if (score >= 2) return "#f97316"
  return "#ef4444"
}

function scoreGradient(score: number): string {
  if (score >= 5) return "from-emerald-500/20 to-emerald-500/5"
  if (score >= 4) return "from-green-500/20 to-green-500/5"
  if (score >= 3) return "from-yellow-500/20 to-yellow-500/5"
  if (score >= 2) return "from-orange-500/20 to-orange-500/5"
  return "from-red-500/20 to-red-500/5"
}

function hireColor(rec: string): string {
  const lower = rec.toLowerCase()
  if (lower.includes("strong hire") && !lower.includes("no")) return "#22c55e"
  if (lower === "hire") return "#4ade80"
  if (lower.includes("leaning hire") && !lower.includes("no")) return "#a3e635"
  if (lower.includes("leaning no")) return "#f97316"
  if (lower.includes("strong no")) return "#dc2626"
  if (lower.includes("no hire")) return "#ef4444"
  return "#9ca3af"
}

function competencyIcon(name: string) {
  switch (name) {
    case "Technical Skills":
      return <Code2 className="w-5 h-5" />
    case "Problem Solving":
      return <Brain className="w-5 h-5" />
    case "Communication":
      return <MessageSquare className="w-5 h-5" />
    case "Cultural Fit and Collaboration":
      return <Users className="w-5 h-5" />
    default:
      return <Target className="w-5 h-5" />
  }
}

// ─── Loading skeleton ─────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="app-viewport-frame bg-background">
      <div className="app-viewport-content py-8 md:py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] gap-8">
          {/* Pulsing orb */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent animate-ping opacity-30" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/60 animate-pulse" />
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white/90 tracking-tight">
              Evaluating your performance
            </h2>
            <p className="text-sm text-white/50 max-w-md">
              Our AI is reviewing your interview transcript, code submission, and test results to generate a comprehensive evaluation.
            </p>
          </div>

          {/* Animated progress dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white/40"
                style={{
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Skeleton cards preview */}
          <div className="w-full max-w-2xl space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="liquid-glass rounded-xl p-6 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10" />
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="ml-auto h-6 w-16 rounded-full bg-white/10" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-white/5" />
                  <div className="h-2 w-3/4 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Competency Card ──────────────────────────────────────────────────

function CompetencyCard({ comp }: { comp: CompetencyRating }) {
  const [expanded, setExpanded] = useState(false)
  const color = scoreColor(comp.score)
  const pct = (comp.score / 5) * 100

  return (
    <div className="liquid-glass rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 text-left cursor-pointer"
      >
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {competencyIcon(comp.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white/90 text-sm tracking-tight">
              {comp.name}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold font-mono"
                style={{ color }}
              >
                {comp.score}
              </span>
              <span className="text-xs text-white/40">/5</span>
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                backgroundColor: color,
              }}
            />
          </div>

          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
            {comp.label}
          </p>
        </div>

        <div className="shrink-0 text-white/30 mt-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Evidence */}
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Evidence
            </h4>
            <p className="text-sm text-white/70 leading-relaxed">
              {comp.evidence}
            </p>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-xs font-semibold text-green-400/80 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {comp.strengths.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean).map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-white/70 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-green-500/40"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="text-xs font-semibold text-orange-400/80 uppercase tracking-wider mb-3 flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5" />
              Weaknesses
            </h4>
            <ul className="space-y-2">
              {comp.weaknesses.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean).map((w, i) => (
                <li
                  key={i}
                  className="text-sm text-white/70 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-500/40"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

//Radar Tooltip

function CustomRadarTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-[var(--card)] border border-white/10 rounded-md p-3 shadow-xl backdrop-blur-md max-w-[200px]">
        <p className="text-sm font-semibold text-white/90">{data.subject}</p>
        <p className="text-xs text-white/60 mt-1">
          Score: {data.value}/5
        </p>
      </div>
    )
  }
  return null
}

//Main Scorecard Component

export function Scorecard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedEvaluation | null>(null)
  const [problemTitle, setProblemTitle] = useState("")
  const evaluationStarted = React.useRef(false)

  useEffect(() => {
    if (evaluationStarted.current) return
    evaluationStarted.current = true

    const runEvaluation = async () => {
      const stored = localStorage.getItem("mockq_eval_request")
      if (!stored) {
        setError("No evaluation data found. Please complete an interview first.")
        setLoading(false)
        return
      }

      try {
        const evalRequest = JSON.parse(stored)
        setProblemTitle(evalRequest.question?.title ?? "Interview")

        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(evalRequest),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? "Evaluation failed")

        const result = parseEvaluation(data.evaluation)
        // Use backend-parsed values as fallback
        if (result.summary.overallScore === 0 && data.overallScore) {
          result.summary.overallScore = data.overallScore
        }
        if (result.summary.hireRecommendation === "Unknown" && data.hireRecommendation) {
          result.summary.hireRecommendation = data.hireRecommendation
        }

        setParsed(result)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    runEvaluation()
  }, [])

  // Radar chart data from competency scores
  const radarData = useMemo(() => {
    if (!parsed) return []
    return parsed.competencies.map((c) => ({
      subject: c.name === "Cultural Fit and Collaboration" ? "Collaboration" : c.name,
      value: c.score,
      fullMark: 5,
    }))
  }, [parsed])

  if (loading) return <LoadingState />

  if (error || !parsed) {
    return (
      <div className="app-viewport-frame bg-background">
        <div className="app-viewport-content py-8 md:py-12">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <AlertTriangle className="w-12 h-12 text-orange-400" />
            <p className="text-white/70 text-center max-w-md">
              {error ?? "Could not load evaluation results."}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/practice")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { competencies, summary, rationale, experienceSummary, actionableSuggestions } = parsed

  return (
    <div className="app-viewport-frame bg-background">
      <div className="app-viewport-content py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button */}
          <button
            onClick={() => router.push("/practice")}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* ─── Overall Summary Banner ─────────────────────────────── */}
          <div className="liquid-glass-enhanced rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="relative flex flex-col lg:flex-row gap-8 items-center">
              {/* Left: Score + Recommendation */}
              <div className="flex flex-col items-center lg:items-start gap-4 lg:w-2/5">
                <p className="text-3xl font-bold text-white tracking-tight">
                  {problemTitle}
                </p>

                {/* Overall score circle */}
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke={scoreColor(summary.overallScore)}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(summary.overallScore / 5) * 327} 327`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-3xl font-bold font-mono"
                      style={{ color: scoreColor(summary.overallScore) }}
                    >
                      {summary.overallScore}
                    </span>
                    <span className="text-xs text-white/40">/5.0</span>
                  </div>
                </div>

                {/* Hire Recommendation badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold"
                  style={{
                    color: hireColor(summary.hireRecommendation),
                    borderColor: `${hireColor(summary.hireRecommendation)}30`,
                    backgroundColor: `${hireColor(summary.hireRecommendation)}10`,
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: hireColor(summary.hireRecommendation) }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: hireColor(summary.hireRecommendation) }}
                    />
                  </span>
                  {summary.hireRecommendation}
                </div>

                {summary.justification && (
                  <p className="text-sm text-white/50 leading-relaxed max-w-sm text-center lg:text-left">
                    {summary.justification}
                  </p>
                )}
              </div>

              {/* Right: Skills Radar Chart */}
              <div className="flex-1 w-full lg:w-3/5" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" gridType="polygon" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fill: "rgba(255,255,255,0.55)",
                        fontSize: 11,
                        fontFamily: "monospace",
                      }}
                    />
                    <PolarRadiusAxis
                      domain={[0, 5]}
                      tick={false}
                      axisLine={false}
                      tickCount={6}
                    />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth={1.5}
                      fill="rgba(255,255,255,0.15)"
                      fillOpacity={0.5}
                      isAnimationActive={true}
                    />
                    <Tooltip content={<CustomRadarTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ─── Competency Ratings (Section 1) ─────────────────────── */}
          <section>
            <h2 className="text-lg font-bold text-white/90 tracking-tight mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-white/50" />
              Competency Ratings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {competencies.map((comp) => (
                <CompetencyCard key={comp.name} comp={comp} />
              ))}
            </div>
          </section>

          {/* ─── Experience Summary (Section 2) ─────────────────────── */}
          {experienceSummary && (
            <section>
              <h2 className="text-lg font-bold text-white/90 tracking-tight mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white/50" />
                Experience Summary
              </h2>
              <div className="liquid-glass rounded-xl p-6">
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                  {experienceSummary}
                </p>
              </div>
            </section>
          )}

          {/* ─── Rationale & Evidence (Section 3) ───────────────────── */}
          {(rationale.strengths.length > 0 || rationale.weaknesses.length > 0) && (
            <section>
              <h2 className="text-lg font-bold text-white/90 tracking-tight mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-white/50" />
                Overall Rationale
              </h2>
              <div className="liquid-glass rounded-xl p-6 space-y-6">
                {rationale.strengths.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-green-400/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {rationale.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-white/70 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-green-500/40"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rationale.weaknesses.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-orange-400/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5" />
                      Key Weaknesses
                    </h3>
                    <ul className="space-y-2">
                      {rationale.weaknesses.map((w, i) => (
                        <li
                          key={i}
                          className="text-sm text-white/70 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-500/40"
                        >
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ─── Actionable Suggestions (Section 5) ─────────────────── */}
          {actionableSuggestions.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white/90 tracking-tight mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-white/50" />
                Actionable Suggestions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {actionableSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="liquid-glass rounded-xl p-5 flex items-start gap-4"
                  >
                    <div className="shrink-0 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-white/40 border border-white/10">
                      {i + 1}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
