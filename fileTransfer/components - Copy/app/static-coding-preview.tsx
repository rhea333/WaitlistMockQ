"use client"

import React from "react"
import { X, Play, ChevronDown, Mic, PhoneOff } from "lucide-react"

const TWO_SUM_PROBLEM = {
  id: "1",
  title: "Two Sum",
  difficulty: "Easy",
  description: {
    paragraphs: [
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      "You can return the answer in any order."
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ]
  }
}

const STATIC_CODE = `# Write your solution here

def twoSum(nums, target):
    pass`

export function StaticCodingPreview() {
  return (
    <section className="bg-background relative h-full w-full overflow-hidden flex flex-col select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-background/80 backdrop-blur-sm z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
          <span className="text-sm font-medium text-white/50">
            {TWO_SUM_PROBLEM.title}
          </span>
          <span className="text-xs text-white/30 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            Python
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Problem panel */}
        <div className="w-[30%] min-w-[300px] max-w-[440px] border-r border-white/10 flex flex-col bg-background/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 shrink-0">
            <span className="text-sm font-medium text-white/50">Problem Statement</span>
            <button disabled className="text-white/20 p-1 rounded cursor-not-allowed">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed opacity-70">
            <h2 className="text-xl font-bold text-white/60 mb-2">{TWO_SUM_PROBLEM.id}. {TWO_SUM_PROBLEM.title}</h2>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400/50 border border-green-500/10">
                {TWO_SUM_PROBLEM.difficulty}
              </span>
            </div>
            {TWO_SUM_PROBLEM.description.paragraphs.map((p, i) => (
              <p key={i} className={`text-white/40 ${i === TWO_SUM_PROBLEM.description.paragraphs.length - 1 ? "mb-6" : "mb-4"}`}>{p}</p>
            ))}
            {TWO_SUM_PROBLEM.description.examples.map((ex, i) => (
              <div key={i} className={i === TWO_SUM_PROBLEM.description.examples.length - 1 ? "mb-6" : "mb-5"}>
                <h3 className="text-sm font-semibold text-white/50 mb-2">Example {i + 1}:</h3>
                <div className="bg-white/3 border border-white/5 rounded-lg p-3 font-mono text-xs space-y-1">
                  <p><span className="text-white/30">Input:</span> <span className="text-white/50">{ex.input}</span></p>
                  <p><span className="text-white/30">Output:</span> <span className="text-white/50">{ex.output}</span></p>
                  {ex.explanation && <p className="text-white/20 mt-1">{ex.explanation}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code editor (static) */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-0 bg-[#1e1e1e] p-4 font-mono text-sm overflow-hidden">
            <div className="flex">
              <div className="flex flex-col items-end pr-4 text-white/20 select-none">
                {STATIC_CODE.split("\n").map((_, i) => (
                  <span key={i} className="leading-6 text-xs">{i + 1}</span>
                ))}
              </div>
              <pre className="text-white/40 leading-6">
                <code>{STATIC_CODE.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line.startsWith("#") ? (
                      <span className="text-green-500/40">{line}</span>
                    ) : line.startsWith("def") ? (
                      <>
                        <span className="text-blue-400/50">def </span>
                        <span className="text-yellow-300/50">twoSum</span>
                        <span className="text-white/40">(nums, target):</span>
                      </>
                    ) : line.includes("pass") ? (
                      <span className="text-purple-400/50">    pass</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </span>
                ))}</code>
              </pre>
            </div>
          </div>

          {/* Submit bar (disabled) */}
          <div className="border-t border-white/10 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs text-white/20">Test Results</span>
              <button
                disabled
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-green-600/30 text-white/30 cursor-not-allowed"
              >
                <Play className="h-4 w-4" />
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Interviewer panel (disabled) */}
        <div className="w-[30%] min-w-[280px] max-w-[400px] border-l border-white/10 flex flex-col bg-background/50">
          <div className="p-3 border-b border-white/10">
            <div className="text-xs text-white/20 font-medium uppercase tracking-wider mb-2">
              Interviewer
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-video flex items-center justify-center">
              {/* Static visualizer dots */}
              <div className="flex h-16 items-center justify-center gap-1.5">
                {[0.6, 0.3, 0.8, 0.4, 0.5].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-white/10"
                    style={{ height: `${h * 40}px` }}
                  />
                ))}
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white/30">
                AI Interviewer
              </div>
            </div>
          </div>

          {/* Disabled control bar */}
          <div className="p-3 shrink-0 mt-12">
            <div className="bg-background border border-white/10 flex flex-col rounded-[31px] p-3">
              <div className="flex gap-1">
                <div className="flex grow gap-1">
                  <button
                    disabled
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/20 cursor-not-allowed"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/15 text-red-400/30 cursor-not-allowed font-mono text-sm"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span className="hidden md:inline">END CALL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
