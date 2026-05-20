"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useSessionContext } from '@livekit/components-react'
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { INTERVIEW_PLANS, addInterview, getInterviewById } from "@/lib/interview-data"
import { Code, Users, Layout, BarChart, Palette, Megaphone, Server } from "lucide-react"

const languages = ["Python", "JavaScript", "Java", "C++", "Go", "Rust", "TypeScript"]

// Role-specific icons
const roleIcons: Record<string, any> = {
  "Software Engineer": Code,
  "Product Manager": BarChart,
  "UI/UX Designer": Palette,
  "Marketing Manager": Megaphone,
  "Data Scientist": BarChart,
  "DevOps Engineer": Server,
}

interface InterviewPlanProps {
  startButtonText?: string
  onStartCall?: () => Promise<void> | void
}

export function InterviewPlan({ startButtonText, onStartCall, ...props }: React.ComponentProps<'section'> & InterviewPlanProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get('id')

  const sessionCtx = useSessionContext()
  const { start } = sessionCtx
  const [selectedLanguage, setSelectedLanguage] = useState("Python")
  const [selectedRound, setSelectedRound] = useState("1")
  const [interviewSetup, setInterviewSetup] = useState<any>(null)
  const [rounds, setRounds] = useState<any[]>([])

  useEffect(() => {
    // 1. Check if loading existing interview by ID
    if (interviewId) {
      const interview = getInterviewById(interviewId)
      if (interview) {
        setInterviewSetup({
          role: interview.role,
          company: interview.company,
          jobTitle: interview.role
        })
        setRounds(interview.rounds)
        localStorage.setItem("mockq_current_interview_id", interview.id)
        return
      }
    }

    // 2. Fallback to creating new interview from setup
    const setupData = localStorage.getItem("mockq_current_interview")
    if (setupData) {
      const setup = JSON.parse(setupData)
      setInterviewSetup(setup)

      // Load role-specific interview plan
      const plan = INTERVIEW_PLANS[setup.role] || INTERVIEW_PLANS["Software Engineer"]
      setRounds(plan)

      const newInterview = addInterview({
        role: setup.role,
        company: setup.company || undefined,
        date: new Date().toISOString(),
        overallScore: 0,
        totalRounds: plan.length,
        completedRounds: 0,
        rounds: plan.map((r) => ({ ...r, completed: false })),
        scores: {},
      })

      // Store current interview ID
      localStorage.setItem("mockq_current_interview_id", newInterview.id)
    }
  }, [])

  const handleStartInterview = async () => {
    localStorage.setItem("mockq_current_round", selectedRound)
    localStorage.setItem("mockq_selected_language", selectedLanguage)
    try {
      if (onStartCall) {
        await onStartCall()
      } else {
        await start()
      }
    } catch (err) {
      console.error('Failed to start session', err)
    }

    // Route coding rounds to the code editor page
    const currentRound = rounds.find(
      (r) => r.round.toString() === selectedRound
    )
    if (currentRound?.hasCoding) {
      router.push("/interview/code")
    } else {
      router.push("/interview")
    }
  }

  if (!interviewSetup) {
    return null
  }

  const buttonLabel = startButtonText ?? 'Start Interview'

  return (
    <section className="relative isolate overflow-hidden py-12" {...props}>
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white/70 hover:text-white hover:bg-white/5 hover:cursor-pointer transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Setup
        </Button>

        {/* Interview Plan Card */}
        <div className="liquid-glass-enhanced rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Interview Plan</h1>
            <div className="flex items-center gap-2 text-xl text-white-200">
              {interviewSetup.company && (
                <>
                  <span className="text-lg font-semibold">{interviewSetup.company}</span>
                  <span className="text-white-200">—</span>
                </>
              )}
              <span className="text-lg font-semibold">{interviewSetup.jobTitle || interviewSetup.role}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {rounds.map((round) => {
              // Dynamic icon selection based on round type
              let Icon = Users
              if (round.hasCoding) Icon = Code
              else if (round.title.includes("Design")) Icon = Layout
              else if (round.title.includes("Product")) Icon = BarChart
              else if (round.title.includes("UX")) Icon = Palette
              else if (round.title.includes("Campaign") || round.title.includes("Marketing")) Icon = Megaphone
              else if (round.title.includes("Infrastructure") || round.title.includes("DevOps")) Icon = Server

              return (
                <div key={round.round} className="glass-border rounded-xl p-6 hover:bg-white/5 transition-colors transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          Round {round.round}: {round.title}
                        </h3>
                      </div>
                      {round.subtitle && <p className="text-sm text-white/60 mb-2">{round.subtitle}</p>}
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {round.duration}</span>
                        {round.completed && (
                          <span className="flex items-center gap-1 text-lime-400 ml-4 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </span>
                        )}
                      </div>

                      {round.hasCoding && (
                        <div className="mt-4">
                          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="w-48 glass-border bg-transparent text-white text-sm hover:cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-950 border-gray-800">
                              {languages.map((lang) => (
                                <SelectItem key={lang} value={lang} className="text-gray hover:bg-white/5">
                                  {lang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Start Interview Button with Round Selector */}
          <div className="space-y-3">
            <Select value={selectedRound} onValueChange={setSelectedRound}>
              <SelectTrigger className="w-full glass-border bg-transparent text-white hover:cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-800">
                {rounds.map((round) => (
                  <SelectItem key={round.round} value={round.round.toString()} className="text-gray hover:bg-white/5 hover:cursor-pointer">
                    Round {round.round}: {round.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleStartInterview}
              className="w-full bg-white text-black font-semibold rounded-lg py-6 hover:bg-gray-100 transition-all transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-lg"
            >
              Start Interview
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
