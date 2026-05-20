"use client"

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MutableRefObject,
} from "react"
import {
  Send,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
  Volume2,
  X,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { editor } from "monaco-editor"
import type { MonacoInstance } from "@/components/app/code-editor"
import type { LocalParticipant, Room } from "livekit-client"
import { RoomEvent } from "livekit-client"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  role: "user" | "assistant"
  content: string
  /** 1-indexed start line in the user's editor code */
  highlightStart?: number
  /** 1-indexed end line in the user's editor code */
  highlightEnd?: number
  /** True while we're still fetching the highlight follow-up */
  snippetLoading?: boolean
  /** Whether this message was triggered by voice */
  fromVoice?: boolean
}

interface ChatGPTPromptProps {
  className?: string
  editorCode: string
  editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>
  monacoRef: MutableRefObject<MonacoInstance | null>
  /** LiveKit local participant — used to send hint summaries to the voice agent */
  localParticipant?: LocalParticipant
  /** LiveKit room — used to listen for hint_request data messages from the agent */
  room?: Room
}

/* ------------------------------------------------------------------ */
/*  System prompts                                                     */
/* ------------------------------------------------------------------ */

const buildHintSystemPrompt = (
  editorialCode: string,
  userCode: string,
) => `
You are a coding tutor during a mock interview. You have:
1. The student's current code.
2. The editorial solution (hidden from the student).

The student will ask you a SPECIFIC question. Give exactly ONE short, focused hint that directly answers their question. Do NOT give multiple hints, do NOT give progressive hints, do NOT number your hints.

Rules:
• ONE hint only — a single concise paragraph (2-4 sentences max).
• Answer ONLY what was asked. Do not volunteer extra information.
• Be vague enough to nudge, not solve. Never reveal the editorial code.
• If appropriate, reference a specific part of the student's code.
• Never say "Hint 1" or use bullet points for multiple hints.

STUDENT'S CURRENT CODE:
\`\`\`
${userCode}
\`\`\`

EDITORIAL SOLUTION (hidden — for your reference only):
\`\`\`
${editorialCode}
\`\`\`
`.trim()

const buildLineRangeSystemPrompt = (userCode: string) => `
You are given a student's code and a hint about what to improve. Your ONLY job is to return the line range in the student's code that the hint is about.

Return EXACTLY two numbers on one line, separated by a dash:
START-END

Where START and END are 1-indexed line numbers. Pick the tightest range (1-6 lines).

If the student's code is empty or only has starter comments, return: 1-1

RULES:
• Return ONLY the two numbers separated by a dash. Nothing else.
• No explanation, no text, no markdown.
• Example valid outputs: "3-5" or "7-12" or "1-1"

STUDENT'S CURRENT CODE (with line numbers):
${userCode
  .split("\n")
  .map((line, i) => `${i + 1}: ${line}`)
  .join("\n")}
`.trim()

/* ------------------------------------------------------------------ */
/*  API helper                                                         */
/* ------------------------------------------------------------------ */

async function callChat(
  systemPrompt: string,
  messages: { role: string; content: string }[],
): Promise<{ reply?: string; error?: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, messages }),
  })
  return res.json()
}

/* ------------------------------------------------------------------ */
/*  Hint summary API helper                                            */
/* ------------------------------------------------------------------ */

async function callHintSummary(
  hint: string,
  lineStart?: number,
  lineEnd?: number,
): Promise<{ summary?: string; error?: string }> {
  const res = await fetch("/api/hint-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hint, lineStart, lineEnd }),
  })
  return res.json()
}

/* ------------------------------------------------------------------ */
/*  Send data to LiveKit agent via data channel                        */
/* ------------------------------------------------------------------ */

function sendHintToAgent(
  localParticipant: LocalParticipant | undefined,
  payload: { summary: string; lineStart?: number; lineEnd?: number },
) {
  if (!localParticipant) return
  const data = JSON.stringify({ type: "hint_summary", ...payload })
  const encoder = new TextEncoder()
  localParticipant.publishData(encoder.encode(data), {
    reliable: true,
    topic: "hint_summary",
  })
}

/* ------------------------------------------------------------------ */
/*  Parse line range like "3-7"                                        */
/* ------------------------------------------------------------------ */

function parseLineRange(
  raw: string,
  maxLine: number,
): { start: number; end: number } | null {
  const match = raw.trim().match(/^(\d+)\s*-\s*(\d+)$/)
  if (!match) return null
  const start = Math.max(1, Math.min(parseInt(match[1], 10), maxLine))
  const end = Math.max(start, Math.min(parseInt(match[2], 10), maxLine))
  return { start, end }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChatGPTPrompt({
  className,
  editorCode,
  editorRef,
  monacoRef,
  localParticipant,
  room,
}: ChatGPTPromptProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [referenceCode, setReferenceCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [closed, setClosed] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Track Monaco decoration IDs so we can clear them
  const decorationIds = useRef<string[]>([])
  const viewZoneIds = useRef<string[]>([])

  // Refs for values needed inside the data channel callback
  const editorCodeRef = useRef(editorCode)
  const referenceCodeRef = useRef(referenceCode)
  const messagesRef = useRef(messages)
  const loadingRef = useRef(loading)

  useEffect(() => { editorCodeRef.current = editorCode }, [editorCode])
  useEffect(() => { referenceCodeRef.current = referenceCode }, [referenceCode])
  useEffect(() => { messagesRef.current = messages }, [messages])
  useEffect(() => { loadingRef.current = loading }, [loading])

  // Fetch editorial solution from backend on mount
  useEffect(() => {
    const fetchEditorial = async () => {
      try {
        const res = await fetch("/api/editorial")
        const data = await res.json()
        if (data.code) {
          setReferenceCode(data.code)
        }
      } catch (error) {
        console.error("Failed to load editorial:", error)
      }
    }
    fetchEditorial()
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const hasEditorial = referenceCode.trim().length > 0

  /* ---- Clear old editor decorations & view zones ---- */
  const clearEditorHints = useCallback(() => {
    const ed = editorRef.current
    if (!ed) return

    // Clear decorations
    decorationIds.current = ed.deltaDecorations(decorationIds.current, [])

    // Clear view zones
    if (viewZoneIds.current.length > 0) {
      ed.changeViewZones((accessor) => {
        viewZoneIds.current.forEach((id) => accessor.removeZone(id))
      })
      viewZoneIds.current = []
    }
  }, [editorRef])

  /* ---- Apply highlight + inline hint bubble to editor ---- */
  const applyEditorHint = useCallback(
    (startLine: number, endLine: number, hintText: string) => {
      const ed = editorRef.current
      const monaco = monacoRef.current
      if (!ed || !monaco) return

      // First clear old ones
      clearEditorHints()

      // Add line highlight decorations
      decorationIds.current = ed.deltaDecorations([], [
        {
          range: new monaco.Range(startLine, 1, endLine, 1),
          options: {
            isWholeLine: true,
            className: "hint-line-highlight",
            glyphMarginClassName: "hint-glyph-icon",
            overviewRuler: {
              color: "rgba(251, 191, 36, 0.6)",
              position: monaco.editor.OverviewRulerLane.Full,
            },
          },
        },
      ])

      // Add a view zone (inline hint bubble) after the highlighted block
      ed.changeViewZones((accessor) => {
        const domNode = document.createElement("div")
        domNode.className = "hint-viewzone"

        domNode.innerHTML = `
          <div class="hint-viewzone-bubble">
            <div class="hint-viewzone-icon">💡</div>
            <div class="hint-viewzone-text">${hintText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          </div>
        `

        const id = accessor.addZone({
          afterLineNumber: endLine,
          heightInPx: Math.min(80, 32 + Math.ceil(hintText.length / 80) * 18),
          domNode,
        })
        viewZoneIds.current.push(id)
      })

      // Scroll the highlighted lines into view
      ed.revealLineInCenter(startLine)

      // Auto-dismiss after 10 seconds
      setTimeout(() => clearEditorHints(), 10000)
    },
    [editorRef, monacoRef, clearEditorHints],
  )

  /* ---- Core hint pipeline (used by both text input and voice) ---- */
  const runHintPipeline = useCallback(
    async (question: string, fromVoice: boolean = false) => {
      const currentEditorCode = editorCodeRef.current
      const currentReferenceCode = referenceCodeRef.current
      const currentMessages = messagesRef.current

      if (!currentReferenceCode.trim()) {
        if (fromVoice) {
          // Voice hint requested but no editorial loaded — tell the agent
          sendHintToAgent(localParticipant, {
            summary:
              "I'd love to help, but the editorial solution hasn't been loaded yet. Please paste it into the hint panel first.",
          })
        }
        return
      }

      const userMsg: Message = { role: "user", content: question, fromVoice }
      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setLoading(true)
      setExpanded(true)

      // Conversation history
      const history = [...currentMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      try {
        /* ---- Step 1: get ONE focused hint ---- */
        const hintResult = await callChat(
          buildHintSystemPrompt(currentReferenceCode, currentEditorCode),
          history,
        )

        if (hintResult.error) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Error: ${hintResult.error}` },
          ])
          setLoading(false)
          return
        }

        const hintText = hintResult.reply || ""

        // Add assistant hint message with snippetLoading flag
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: hintText, snippetLoading: true },
        ])

        /* ---- Step 2: get the line range to highlight ---- */
        const lineResult = await callChat(
          buildLineRangeSystemPrompt(currentEditorCode),
          [
            { role: "user", content: `Student question: ${question}` },
            { role: "user", content: `Hint given: ${hintText}` },
          ],
        )

        const maxLine = currentEditorCode.split("\n").length
        const range =
          !lineResult.error && lineResult.reply
            ? parseLineRange(lineResult.reply, maxLine)
            : null

        // Update message with line range
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1
              ? {
                  ...m,
                  highlightStart: range?.start,
                  highlightEnd: range?.end,
                  snippetLoading: false,
                }
              : m,
          ),
        )

        // Apply the highlight + bubble in the editor
        if (range) {
          applyEditorHint(range.start, range.end, hintText)
        }

        /* ---- Step 3: generate voice summary & send to LiveKit agent ---- */
        if (localParticipant) {
          try {
            const summaryResult = await callHintSummary(
              hintText,
              range?.start,
              range?.end,
            )
            if (summaryResult.summary) {
              sendHintToAgent(localParticipant, {
                summary: summaryResult.summary,
                lineStart: range?.start,
                lineEnd: range?.end,
              })
            }
          } catch {
            // Voice summary is best-effort — don't break the hint flow
            console.warn("Failed to send hint summary to voice agent")
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: Failed to connect to API" },
        ])
      } finally {
        setLoading(false)
      }
    },
    [applyEditorHint, localParticipant],
  )

  /* ---- Listen for hint_request data messages from the backend agent ---- */
  useEffect(() => {
    if (!room) return

    const decoder = new TextDecoder()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleData = (payload: Uint8Array, participant: any, _kind: any, topic: string | undefined) => {
      // Only process messages from the agent (remote participants), not our own
      if (participant?.identity === room.localParticipant?.identity) return

      try {
        const data = JSON.parse(decoder.decode(payload))
        if (data.type !== "hint_request") return

        const transcript: string = data.transcript || ""
        if (!transcript.trim()) return

        //console.log(`[HintRouter] Voice hint request: "${transcript.slice(0, 60)}..."`)

        // Don't queue if already processing a hint
        if (loadingRef.current) {
          //console.log("[HintRouter] Already processing a hint, skipping")
          return
        }

        // Trigger the hint pipeline with the voice transcript
        runHintPipeline(transcript, true)
      } catch {
        // Not a JSON message or not for us — ignore
      }
    }

    room.on(RoomEvent.DataReceived, handleData)

    return () => {
      room.off(RoomEvent.DataReceived, handleData)
    }
  }, [room, runHintPipeline])

  /* ---- Text input send handler ---- */
  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading || !hasEditorial) return
    runHintPipeline(trimmed, false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
    setExpanded(false)
    clearEditorHints()
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  // When closed, show a small reopen button
  if (closed) {
    return (
      <button
        onClick={() => setClosed(false)}
        className={cn(
          "border-t border-white/10 bg-[#1e1e1e] flex items-center justify-center gap-2 px-3 py-2",
          "hover:bg-white/5 transition-colors text-white/50 hover:text-white/80",
          className,
        )}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">AI Hint Assistant</span>
        {hasEditorial && (
          <span className="text-[10px] text-emerald-400/70 px-1.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/15">
            ready
          </span>
        )}
      </button>
    )
  }

  return (
    <div
      className={cn(
        "border-t border-white/10 bg-[#1e1e1e] flex flex-col",
        className,
      )}
    >
      {/* ---- Header bar ---- */}
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-white/5 transition-colors select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-white/60">
            AI Hint Assistant
          </span>
          {hasEditorial && (
            <span className="text-[10px] text-emerald-400/70 px-1.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/15">
              editorial loaded
            </span>
          )}
          {loading && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400/70 px-1.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/15">
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              processing hint
            </span>
          )}
          {messages.length > 0 && (
            <span className="text-[10px] text-white/30 px-1.5 py-0.5 rounded-full bg-white/5">
              {messages.length} msg{messages.length !== 1 && "s"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setClosed(true)
            }}
            className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
            title="Close hint assistant"
          >
            <X className="h-3 w-3" />
          </button>
          {messages.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearChat()
              }}
              className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-white/40" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5 text-white/40" />
          )}
        </div>
      </div>

      {/* ---- Expanded body ---- */}
      {expanded && (
        <>
          {/* Voice hint info banner */}
          {hasEditorial && (
            <div className="px-3 py-1.5 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                <Volume2 className="h-3 w-3 shrink-0" />
                <span>
                  Say <strong className="text-white/50">&quot;help&quot;</strong> or{" "}
                  <strong className="text-white/50">&quot;hint&quot;</strong> while speaking to the
                  interviewer to get a code hint
                </span>
              </div>
            </div>
          )}

          {/* Messages (compact history) */}
          {messages.length > 0 && (
            <div className="max-h-[200px] overflow-y-auto px-3 py-2 space-y-2 glass-scrollbar border-t border-white/5">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <div
                      className={cn(
                        "text-xs leading-relaxed rounded-lg px-2.5 py-1.5 max-w-[95%] ml-auto border",
                        msg.fromVoice
                          ? "bg-amber-500/10 text-amber-200 border-amber-500/20"
                          : "bg-purple-500/15 text-purple-200 border-purple-500/20",
                      )}
                    >
                      {msg.fromVoice && (
                        <span className="text-[9px] text-amber-400/50 block mb-0.5">
                          🎙 voice
                        </span>
                      )}
                      <pre className="whitespace-pre-wrap font-sans break-words">
                        {msg.content}
                      </pre>
                    </div>
                  ) : (
                    <div className="space-y-1 max-w-[95%]">
                      <div className="text-xs leading-relaxed rounded-lg px-2.5 py-2 bg-white/5 text-white/80 border border-white/5">
                        <pre className="whitespace-pre-wrap font-sans break-words">
                          {msg.content}
                        </pre>
                      </div>
                      {msg.snippetLoading && (
                        <div className="flex items-center gap-1.5 text-white/30 text-[11px] px-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Highlighting your code...</span>
                        </div>
                      )}
                      {msg.highlightStart != null &&
                        msg.highlightEnd != null && (
                          <button
                            onClick={() =>
                              applyEditorHint(
                                msg.highlightStart!,
                                msg.highlightEnd!,
                                msg.content,
                              )
                            }
                            className="flex items-center gap-1.5 text-[10px] text-amber-400/60 hover:text-amber-400 transition-colors px-2 cursor-pointer"
                          >
                            <span>
                              📍 Lines {msg.highlightStart}-{msg.highlightEnd}
                            </span>
                            <span className="text-white/20">
                              (click to re-highlight)
                            </span>
                          </button>
                        )}
                    </div>
                  )}
                </div>
              ))}
              {loading &&
                messages.at(-1)?.role !== "assistant" && (
                  <div className="flex items-center gap-1.5 text-white/40 text-xs px-2.5 py-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </>
      )}

      {/* ---- Input area (text fallback — voice goes through LiveKit mic) ---- */}
      <div className="flex items-end gap-2 px-3 py-2 border-t border-white/5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasEditorial
              ? "Type a hint question... or just say \"help\" to the interviewer"
              : "Paste editorial code above first, then ask a question..."
          }
          disabled={!hasEditorial}
          rows={1}
          className={cn(
            "flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2",
            "text-xs text-white/90 placeholder-white/25",
            "resize-none outline-none",
            "focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20",
            "transition-all duration-200",
            !hasEditorial && "opacity-50 cursor-not-allowed",
          )}
          style={{ maxHeight: "80px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = "auto"
            target.style.height = Math.min(target.scrollHeight, 80) + "px"
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim() || !hasEditorial}
          className={cn(
            "p-2 rounded-lg transition-all duration-200 shrink-0",
            input.trim() && !loading && hasEditorial
              ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30"
              : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed",
          )}
          title="Send message"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  )
}
