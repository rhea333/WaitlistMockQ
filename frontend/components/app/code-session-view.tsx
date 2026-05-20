"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useSessionContext,
  useSessionMessages,
  useVoiceAssistant,
  useLocalParticipant,
  useRoomContext,
  useTracks,
  VideoTrack,
  BarVisualizer,
} from "@livekit/components-react"
import { Track, RoomEvent, type TranscriptionSegment, type Participant } from "livekit-client"
import type { AppConfig } from "@/app-config"
import {
  CodeEditor,
  type MonacoInstance,
} from "@/components/app/code-editor"
import { ChatGPTPrompt } from "@/components/app/chatgpt-prompt"
import { ChatTranscript } from "@/components/app/chat-transcript"
import {
  AgentControlBar,
  type ControlBarControls,
} from "@/components/livekit/agent-control-bar/agent-control-bar"
import { useLocalTrackRef } from "@/components/app/tile-layout"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/livekit/scroll-area/scroll-area"
import { FileText, X, ArrowLeft, Lock, Play, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { LANGUAGE_MAP } from "@/components/app/code-editor"
import { TEST_CASE_REGISTRY, type TestCase } from "@/lib/test-cases"

interface CodeSessionViewProps {
  appConfig: AppConfig
}

export function CodeSessionView({
  appConfig,
  ...props
}: React.ComponentProps<"section"> & CodeSessionViewProps) {
  const session = useSessionContext()
  const { messages } = useSessionMessages(session)
  const router = useRouter()

  const [problemOpen, setProblemOpen] = useState(true)
  const [code, setCode] = useState<string | undefined>(undefined)
  const [showEmptyWarning, setShowEmptyWarning] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const logCodeSnapshot = useCallback(
    (source: string) => {
      console.log(`[CodeSession] ${source} clicked. Current code:`, code ?? "(empty)")
    },
    [code],
  )

  // --- Code submission / test-case evaluation state ---
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verdict, setVerdict] = useState<{
    passed: number
    total: number
    results: {
      label: string
      passed: boolean
      status: string
      input?: string
      expectedOutput?: string
      actualOutput?: string
      stderr?: string
      userErrorLine?: number | null
      time?: string | null
      hidden: boolean
    }[]
  } | null>(null)
  const errorDecorationsRef = useRef<string[]>([])
  const [resultsOpen, setResultsOpen] = useState(false)
  const [selectedTestIdx, setSelectedTestIdx] = useState(0)

  const logSubmissionTestCases = useCallback(
    (
      problemId: string,
      runResults?: {
        label: string
        status: string
      }[],
      fallbackStatus = "Not Run",
    ) => {
      const testCases: TestCase[] =
        TEST_CASE_REGISTRY[problemId] ?? TEST_CASE_REGISTRY["1"] ?? []

      const statusByLabel = new Map(
        (runResults ?? []).map((result) => [result.label, result.status]),
      )

      const caseLog = testCases.map((testCase) => {
        const [nums, target] = testCase.input.split("\n")
        const input = {
          nums: nums ?? "[]",
          target: target ?? "",
        }

        return {
          label: testCase.label,
          input,
          expectedOutput: testCase.expectedOutput,
          status: statusByLabel.get(testCase.label) ?? fallbackStatus,
        }
      })

      console.groupCollapsed(
        `[CodeSession] Submission test cases (${caseLog.length}) for problem ${problemId}`,
      )
      console.table(caseLog)
      console.groupEnd()
    },
    [],
  )

  const parseErrorMessage = (stderr?: string): string => {
    if (!stderr) return ""
    const lines = stderr.split("\n").map((s) => s.trim()).filter(Boolean)
    const last = lines[lines.length - 1] ?? ""
    if (last.includes("Error") || last.includes("Exception")) return last
    return lines.find((s) => s.includes("Error") || s.includes("Exception")) ?? last
  }

  /** Highlight the error line in the Monaco editor with a red gutter + background */
  const highlightEditorLine = useCallback((_lineNumber: number | null | undefined) => {
    // Temporarily disabled: error line highlighting in editor.
    //
    // const editor = editorRef.current
    // if (!editor) return
    //
    // // Clear previous error decorations
    // errorDecorationsRef.current = editor.deltaDecorations(errorDecorationsRef.current, [])
    //
    // if (!lineNumber || lineNumber < 1) return
    //
    // errorDecorationsRef.current = editor.deltaDecorations([], [
    //   {
    //     range: { startLineNumber: lineNumber, startColumn: 1, endLineNumber: lineNumber, endColumn: 1 },
    //     options: {
    //       isWholeLine: true,
    //       className: "bg-red-500/20",
    //       glyphMarginClassName: "bg-red-500 rounded-full",
    //       overviewRuler: { color: "#ef4444", position: 4 },
    //     },
    //   },
    // ])
    //
    // editor.revealLineInCenter(lineNumber)
  }, [])

  const handleSubmitCode = async () => {
    if (!code || isSubmitting) return
    const problemId = currentProblem?.id ?? "1"

    setIsSubmitting(true)
    setVerdict(null)
    setSelectedTestIdx(0)
    highlightEditorLine(null) // clear previous highlights
    setResultsOpen(true)
    try {
      const monacoLang = LANGUAGE_MAP[language] || "python"
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: monacoLang,
          problemId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Submission failed")
      setVerdict(data)

      // Send test results to the LiveKit agent
      if (localParticipant) {
        const testResultPayload = JSON.stringify({
          type: "test_results",
          passed: data.passed,
          total: data.total,
          results: data.results.map((r: { label: string; passed: boolean; status: string }) => ({
            label: r.label,
            passed: r.passed,
            status: r.status,
          })),
        })
        localParticipant.publishData(new TextEncoder().encode(testResultPayload), {
          reliable: true,
          topic: "test_results",
        })
      }

      logSubmissionTestCases(problemId, data.results)

      // Persist interview score to localStorage
      const existingScores = JSON.parse(localStorage.getItem("mockq_problem_scores") || "{}")
      existingScores[problemId] = `${data.passed}/${data.total}`
      localStorage.setItem("mockq_problem_scores", JSON.stringify(existingScores))
    } catch (err) {
      const errorMessage = (err as Error).message

      setVerdict({
        passed: 0,
        total: 0,
        results: [
          {
            label: "Error",
            passed: false,
            status: errorMessage,
            hidden: false,
          },
        ],
      })

      logSubmissionTestCases(problemId, undefined, `Submission failed: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Monaco editor instances — shared with ChatGPTPrompt for inline highlights
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<MonacoInstance | null>(null)
  const handleEditorReady = useCallback(
    (ed: import("monaco-editor").editor.IStandaloneCodeEditor, m: MonacoInstance) => {
      editorRef.current = ed
      monacoRef.current = m
    },
    [],
  )

  // Read language and round from localStorage
  const [language, setLanguage] = useState("Python")
  const [roundInfo, setRoundInfo] = useState("")
  const [currentProblem, setCurrentProblem] = useState<{
    id: string
    title: string
    topic: string
    difficulty: "Easy" | "Medium" | "Hard"
    description?: {
      paragraphs: string[]
      examples: { input: string; output: string; explanation?: string }[]
      constraints: string[]
    }
  } | null>(null)

  useEffect(() => {
    const lang = localStorage.getItem("mockq_selected_language") || "Python"
    const round = localStorage.getItem("mockq_current_round") || "2"
    setLanguage(lang)
    setRoundInfo(`Round ${round}`)

    const stored = localStorage.getItem("mockq_current_problem")
    if (stored) {
      try {
        setCurrentProblem(JSON.parse(stored))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  // LiveKit tracks & room
  const room = useRoomContext()
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant()
  const { localParticipant } = useLocalParticipant()
  const cameraTrack = useLocalTrackRef(Track.Source.Camera)
  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: false, // no screen share needed in code editor mode
  }

  useEffect(() => {
    const lastMessage = messages.at(-1)
    if (scrollAreaRef.current && lastMessage?.from?.isLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Listen to RoomEvent.TranscriptionReceived to capture only final (non-interim) segments.
  const userTranscriptRef = useRef<string[]>([])
  const agentTranscriptRef = useRef<string[]>([])
  const interleavedTranscriptRef = useRef<string[]>([])

  useEffect(() => {
    const handler = (
      segments: TranscriptionSegment[],
      participant?: Participant,
    ) => {
      const finalTexts = segments.filter((s) => s.final).map((s) => s.text)
      if (!finalTexts.length) return

      const isUser = participant?.identity?.startsWith("voice_assistant_user_")
      const label = isUser ? "[Candidate]" : "[Interviewer]"

      if (isUser) {
        userTranscriptRef.current = [...userTranscriptRef.current, ...finalTexts]
      } else {
        agentTranscriptRef.current = [...agentTranscriptRef.current, ...finalTexts]
      }

      for (const text of finalTexts) {
        interleavedTranscriptRef.current.push(`${label} ${text}`)
      }

      console.groupCollapsed("Live session transcripts (final only)")
      console.log("User transcript:", userTranscriptRef.current)
      console.log("Agent transcript:", agentTranscriptRef.current)
      console.groupEnd()
    }

    room.on(RoomEvent.TranscriptionReceived, handler)
    return () => {
      room.off(RoomEvent.TranscriptionReceived, handler)
    }
  }, [room])

  const handleEnd = useCallback(async () => {
    logCodeSnapshot("End call")

    // ---- Build evaluation objects ----
    const questionObject = currentProblem
      ? {
        id: currentProblem.id,
        title: currentProblem.title,
        topic: currentProblem.topic,
        difficulty: currentProblem.difficulty,
        description: currentProblem.description ?? undefined,
      }
      : { id: "1", title: "Unknown", topic: "Unknown", difficulty: "Unknown" }

    const testCaseResults = verdict?.results ?? []

    const codeSubmission = code ?? ""

    const interviewTranscript = interleavedTranscriptRef.current.join("\n")

    // Store evaluation request for scorecard page
    if (interviewTranscript.length > 0 || codeSubmission.length > 0) {
      localStorage.setItem(
        "mockq_eval_request",
        JSON.stringify({
          question: questionObject,
          testCases: testCaseResults,
          codeSubmission,
          interviewTranscript,
        }),
      )
      await session.end()
      router.push("/scorecard")
    } else {
      // Empty session — show warning popup instead of submitting
      setShowEmptyWarning(true)
    }
  }, [logCodeSnapshot, router, session, currentProblem, verdict, code])

  return (
    <section
      className="bg-background relative h-[100dvh] w-full overflow-hidden flex flex-col "
      {...props}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-background/80 backdrop-blur-sm z-50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logCodeSnapshot("Redirect")
              router.push("/practice")
            }}
            className="text-white hover:text-white/90 hover:cursor-pointer transition-all duration-200 p-2 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 backdrop-blur-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-white/80">
            {currentProblem?.title || "No Problem Selected"} — Coding Interview
          </span>
          <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setProblemOpen(!problemOpen)}
            className={cn(
              "p-2 rounded-lg transition-colors hover:cursor-pointer",
              problemOpen
                ? "bg-white/10 hover:bg-white/40 text-white"
                : "bg-white/5 hover:bg-white/10 text-white/50"
            )}
            title="Toggle problem description"
          >
            <FileText className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Lock className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-y-auto glass-scrollbar mt-2">
        {problemOpen && (
          <div className="w-[30%] min-w-[300px] max-w-[440px] border-r border-white/10 flex flex-col bg-background/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">Problem Statement</span>
              </div>
              <button
                onClick={() => setProblemOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed">
              {currentProblem?.description ? (
                <>
                  <h2 className="text-xl font-bold text-white mb-2">{currentProblem.id}. {currentProblem.title}</h2>
                  <div className="flex items-center gap-2 mb-5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${currentProblem.difficulty === "Easy"
                      ? "bg-green-500/15 text-green-400 border border-green-500/20"
                      : currentProblem.difficulty === "Medium"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                        : "bg-red-500/15 text-red-400 border border-red-500/20"
                      }`}>
                      {currentProblem.difficulty}
                    </span>
                  </div>
                  {currentProblem.description.paragraphs.map((p, i) => (
                    <p key={i} className={`text-white/70 ${i === currentProblem.description!.paragraphs.length - 1 ? "mb-6" : "mb-4"}`}>{p}</p>
                  ))}
                  {currentProblem.description.examples.map((ex, i) => (
                    <div key={i} className={i === currentProblem.description!.examples.length - 1 ? "mb-6" : "mb-5"}>
                      <h3 className="text-sm font-semibold text-white/90 mb-2">Example {i + 1}:</h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 font-mono text-xs space-y-1">
                        <p><span className="text-white/50">Input:</span> <span className="text-white/80">{ex.input}</span></p>
                        <p><span className="text-white/50">Output:</span> <span className="text-white/80">{ex.output}</span></p>
                        {ex.explanation && <p className="text-white/40 mt-1">{ex.explanation}</p>}
                      </div>
                    </div>
                  ))}
                  <div>
                    <h3 className="text-sm font-semibold text-white/90 mb-2">Constraints:</h3>
                    <ul className="list-disc list-inside space-y-1.5 text-white/60 text-xs">
                      {currentProblem.description.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Lock className="h-8 w-8 text-white/40" />
                  <p className="text-lg font-semibold text-white/60">Coming Soon</p>
                  <p className="text-sm text-white/40 text-center max-w-[260px]">The problem description for this question is not yet available.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            "transition-all duration-300 ease-in-out flex flex-col flex-1 min-w-0"
          )}
        >
          <CodeEditor
            language={language}
            onChange={setCode}
            onEditorReady={handleEditorReady}
            className="flex-1 min-h-0"
          />

          {/* --- Submit bar & results panel --- */}
          <div className="border-t border-white/10 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-2">
              <button
                onClick={() => setResultsOpen(!resultsOpen)}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                {verdict ? (
                  <>
                    <span
                      className={cn(
                        "font-medium",
                        verdict.passed === verdict.total
                          ? "text-green-400"
                          : "text-amber-400"
                      )}
                    >
                      {verdict.passed}/{verdict.total} passed
                    </span>
                    {resultsOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronUp className="h-3.5 w-3.5" />
                    )}
                  </>
                ) : (
                  <span>Test Results</span>
                )}
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={isSubmitting || !code}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  isSubmitting
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 text-white hover:cursor-pointer"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Submit
                  </>
                )}
              </button>
            </div>

            {resultsOpen && verdict && (() => {
              const firstThree = verdict.results.filter((item) => !item.hidden).slice(0, 3)
              const selected = firstThree[selectedTestIdx] ?? firstThree[0]
              const errMsg = parseErrorMessage(selected?.stderr)
              const errLine = selected?.userErrorLine ?? null

              if (firstThree.length === 0) {
                return <div className="px-4 pb-3 text-xs text-white/50">No visible sample tests.</div>
              }

              return (
                <div className="px-4 pb-3 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    {firstThree.map((item, idx) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setSelectedTestIdx(idx)
                          highlightEditorLine(firstThree[idx]?.userErrorLine)
                        }}
                        className={cn(
                          "px-3 py-1 rounded-md border text-xs font-medium transition-colors",
                          selectedTestIdx === idx
                            ? item.passed
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                            : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 border",
                        selected.passed
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-red-500/10 border-red-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {selected.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className="font-medium text-white/80">{selected.label}</span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded",
                            selected.passed
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          )}
                        >
                          {selected.status}
                        </span>
                        {selected.time && <span className="text-white/30">{selected.time}s</span>}
                      </div>

                      {selected.input && (
                        <div className="mb-1">
                          <span className="text-white/40">Input:</span>
                          <pre className="font-mono text-white/80 whitespace-pre-wrap">{selected.input}</pre>
                        </div>
                      )}

                      {selected.expectedOutput && (
                        <div className="mb-1">
                          <span className="text-white/40">Expected:</span>{" "}
                          <span className="font-mono text-white/80">{selected.expectedOutput}</span>
                        </div>
                      )}

                      {selected.actualOutput !== undefined && !selected.passed && (
                        <div className="mb-1">
                          <span className="text-white/40">Got:</span>{" "}
                          <span className="font-mono text-red-300">{selected.actualOutput || "(empty)"}</span>
                        </div>
                      )}

                      {!selected.passed && selected.stderr && (
                        <div className="mt-2 rounded border border-red-500/20 bg-red-950/30 p-2">
                          <div className="flex items-center gap-1 text-red-300 mb-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="font-medium">Code Error</span>
                          </div>
                          {errMsg && (
                            <p className="font-mono text-red-200 mb-1 break-all">{errMsg}</p>
                          )}
                          <pre className="font-mono text-red-300/80 whitespace-pre-wrap max-h-28 overflow-auto">{selected.stderr}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>

          <div className="hidden">
            <ChatGPTPrompt
              editorCode={code ?? ""}
              editorRef={editorRef}
              monacoRef={monacoRef}
              localParticipant={localParticipant}
              room={room}
            />
          </div>
        </div>

        <div className="w-[30%] min-w-[280px] max-w-[400px] border-l border-white/10 flex flex-col bg-background/50">
          <div className="p-3 border-b border-white/10">
            <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">
              Interviewer
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-video flex items-center justify-center">
              {agentVideoTrack ? (
                <VideoTrack
                  trackRef={agentVideoTrack}
                  width={agentVideoTrack.publication.dimensions?.width ?? 0}
                  height={
                    agentVideoTrack.publication.dimensions?.height ?? 0
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BarVisualizer
                    barCount={5}
                    state={agentState}
                    options={{ minHeight: 5 }}
                    trackRef={agentAudioTrack}
                    className="flex h-16 items-center justify-center gap-1.5"
                  >
                    <span
                      className={cn([
                        "bg-muted min-h-2 w-2 rounded-full",
                        "origin-center transition-colors duration-250 ease-linear",
                        "data-[lk-highlighted=true]:bg-purple-400 data-[lk-muted=true]:bg-muted",
                      ])}
                    />
                  </BarVisualizer>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white/70">
                AI Interviewer
              </div>
            </div>
          </div>

          <div className="p-3 border-b border-white/10">
            <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">
              You
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-video flex items-center justify-center">
              {isCameraEnabled && cameraTrack ? (
                <VideoTrack
                  trackRef={cameraTrack}
                  width={
                    cameraTrack.publication.dimensions?.width ?? 0
                  }
                  height={
                    cameraTrack.publication.dimensions?.height ?? 0
                  }
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/30">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-lg font-semibold">
                    U
                  </div>
                  <span className="text-xs">Camera off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white/70">
                You
              </div>
            </div>
          </div>

          <div className="flex-1" />
          <div className="p-3 shrink-0">
            <AgentControlBar
              controls={controls}
              isConnected={session.isConnected}
              onDisconnect={handleEnd}
              onChatOpenChange={setProblemOpen}
            />
          </div>
        </div>
      </div>

      {/* Empty submission warning popup */}
      {showEmptyWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Empty Submission</h3>
            </div>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              You haven&apos;t written any code or participated in the interview. Empty sessions can&apos;t be evaluated — please write a solution or discuss your approach before submitting.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmptyWarning(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors hover:cursor-pointer"
              >
                Continue Working
              </button>
              <button
                onClick={async () => {
                  setShowEmptyWarning(false)
                  localStorage.removeItem("mockq_eval_request")
                  await session.end()
                  router.push("/practice")
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-medium transition-colors border border-red-500/20 hover:cursor-pointer"
              >
                Exit Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
