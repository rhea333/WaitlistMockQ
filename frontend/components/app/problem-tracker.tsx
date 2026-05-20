"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, CheckCircle2, XCircle, Clock, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
//import { AnalyticsOverview } from "@/components/app/analytics-overview"
import type { InterviewData } from "@/lib/interview-data"

// ── Types ──────────────────────────────────────────────────────────────────
type Difficulty = "Easy" | "Medium" | "Hard"
type ProblemStatus = "solved" | "attempted" | "unsolved"
type Category = "Software Engineering" | "Product Management" | "Data Science" | "Data Engineering" | "Data Analytics" | "Machine Learning/AI"

interface ProblemExample {
  input: string
  output: string
  explanation?: string
}

interface ProblemDescription {
  paragraphs: string[]
  examples: ProblemExample[]
  constraints: string[]
}

interface Problem {
  id: string
  title: string
  topic: string
  score: string
  difficulty: Difficulty
  frequency: number
  status: ProblemStatus
  description?: ProblemDescription
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_PROBLEMS: Problem[] = [
  // Arrays & Hashing
  {
    id: "1", title: "Two Sum", topic: "Arrays & Hashing", score: "150/150", difficulty: "Easy", frequency: 5, status: "solved", description: {
      paragraphs: [
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
        { input: "nums = [3,3], target = 6", output: "[0,1]" },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
    }
  },
  { id: "2", title: "Group Anagrams", topic: "Arrays & Hashing", score: "130/150", difficulty: "Medium", frequency: 4, status: "attempted" },
  // Two Pointers
  { id: "3", title: "Valid Palindrome", topic: "Two Pointers", score: "150/150", difficulty: "Easy", frequency: 6, status: "solved" },
  { id: "4", title: "3Sum", topic: "Two Pointers", score: "90/150", difficulty: "Medium", frequency: 5, status: "attempted" },
  // Sliding Window
  { id: "5", title: "Best Time to Buy and Sell Stock", topic: "Sliding Window", score: "150/150", difficulty: "Easy", frequency: 8, status: "solved" },
  { id: "6", title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", score: "142/150", difficulty: "Medium", frequency: 3, status: "attempted" },
  // Stack
  { id: "7", title: "Valid Parentheses", topic: "Stack", score: "150/150", difficulty: "Easy", frequency: 7, status: "solved" },
  { id: "8", title: "Min Stack", topic: "Stack", score: "120/150", difficulty: "Medium", frequency: 3, status: "attempted" },
  // Binary Search
  { id: "9", title: "Binary Search", topic: "Binary Search", score: "150/150", difficulty: "Easy", frequency: 6, status: "solved" },
  { id: "10", title: "Search in Rotated Sorted Array", topic: "Binary Search", score: "110/150", difficulty: "Medium", frequency: 4, status: "attempted" },
  // Linked List
  { id: "11", title: "Reverse Linked List", topic: "Linked List", score: "0/150", difficulty: "Easy", frequency: 6, status: "unsolved" },
  { id: "12", title: "Merge Two Sorted Lists", topic: "Linked List", score: "142/150", difficulty: "Easy", frequency: 5, status: "solved" },
  // Trees
  { id: "13", title: "Invert Binary Tree", topic: "Trees", score: "150/150", difficulty: "Easy", frequency: 7, status: "solved" },
  { id: "14", title: "Validate Binary Search Tree", topic: "Trees", score: "100/150", difficulty: "Medium", frequency: 4, status: "attempted" },
  // Heap / Priority Queue
  { id: "15", title: "Find Median from Data Stream", topic: "Heap / Priority Queue", score: "0/150", difficulty: "Hard", frequency: 2, status: "unsolved" },
  { id: "16", title: "Kth Largest Element in a Stream", topic: "Heap / Priority Queue", score: "130/150", difficulty: "Easy", frequency: 3, status: "solved" },
  // Backtracking
  { id: "17", title: "Combination Sum", topic: "Backtracking", score: "120/150", difficulty: "Medium", frequency: 3, status: "attempted" },
  { id: "18", title: "Word Search", topic: "Backtracking", score: "0/150", difficulty: "Medium", frequency: 2, status: "unsolved" },
  // Tries
  { id: "19", title: "Implement Trie (Prefix Tree)", topic: "Tries", score: "140/150", difficulty: "Medium", frequency: 3, status: "solved" },
  { id: "20", title: "Word Search II", topic: "Tries", score: "0/150", difficulty: "Hard", frequency: 2, status: "unsolved" },
  // Graphs
  { id: "21", title: "Number of Islands", topic: "Graphs", score: "142/150", difficulty: "Medium", frequency: 5, status: "solved" },
  { id: "22", title: "Clone Graph", topic: "Graphs", score: "110/150", difficulty: "Medium", frequency: 3, status: "attempted" },
  // 1-D Dynamic Programming
  { id: "23", title: "Climbing Stairs", topic: "DP", score: "150/150", difficulty: "Easy", frequency: 7, status: "solved" },
  { id: "24", title: "Unique Paths", topic: "DP", score: "140/150", difficulty: "Medium", frequency: 3, status: "solved" },
  // Greedy
  { id: "25", title: "Maximum Subarray", topic: "Greedy", score: "150/150", difficulty: "Medium", frequency: 6, status: "solved" },
  { id: "26", title: "Jump Game", topic: "Greedy", score: "110/150", difficulty: "Medium", frequency: 3, status: "attempted" },
  // Intervals
  { id: "27", title: "Merge Intervals", topic: "Intervals", score: "142/150", difficulty: "Medium", frequency: 5, status: "solved" },
  { id: "28", title: "Non-overlapping Intervals", topic: "Intervals", score: "100/150", difficulty: "Medium", frequency: 3, status: "attempted" },
  // Math & Geometry
  { id: "29", title: "Rotate Image", topic: "Math & Geometry", score: "130/150", difficulty: "Medium", frequency: 4, status: "solved" },
  { id: "30", title: "Set Matrix Zeroes", topic: "Math & Geometry", score: "120/150", difficulty: "Medium", frequency: 3, status: "attempted" },
  // Bit Manipulation
  { id: "31", title: "Number of 1 Bits", topic: "Bit Manipulation", score: "150/150", difficulty: "Easy", frequency: 5, status: "solved" },
  { id: "32", title: "Counting Bits", topic: "Bit Manipulation", score: "140/150", difficulty: "Easy", frequency: 4, status: "solved" },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
const difficultyColor: Record<Difficulty, string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
}

// ── Component ──────────────────────────────────────────────────────────────
interface ProblemTrackerProps {
  interviews: InterviewData[]
}

export function ProblemTracker({ interviews }: ProblemTrackerProps) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<Category>("Software Engineering")
  const [searchQuery, setSearchQuery] = useState("")
  const [topicFilter, setTopicFilter] = useState("All Topics")
  const [topicSearchQuery, setTopicSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulties")

  // Read persisted interview scores from localStorage
  const [savedScores, setSavedScores] = useState<Record<string, string>>({})
  useEffect(() => {
    const stored = localStorage.getItem("mockq_problem_scores")
    if (stored) {
      try {
        setSavedScores(JSON.parse(stored))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const getDisplayScore = (problem: Problem): string => {
    if (savedScores[problem.id]) return savedScores[problem.id]
    switch (problem.status) {
      case "solved": return "11/11"
      case "attempted": return "7/11"
      case "unsolved": return "0/11"
    }
  }

  const categories: { label: Category }[] = [
    { label: "Software Engineering" },
    { label: "Product Management" },
    { label: "Data Science" },
    { label: "Data Engineering" },
    { label: "Data Analytics" },
    { label: "Machine Learning/AI" },
  ]

  const uniqueTopics = useMemo(
    () => Array.from(new Set(MOCK_PROBLEMS.map((p) => p.topic))),
    [],
  )

  const filteredTopics = useMemo(
    () => uniqueTopics.filter((t) => topicSearchQuery === "" || t.toLowerCase().includes(topicSearchQuery.toLowerCase())),
    [uniqueTopics, topicSearchQuery],
  )

  // Determine if current section should show "Coming Soon"
  const isComingSoon = activeCategory !== "Software Engineering"

  const filteredProblems = useMemo(() => {
    return MOCK_PROBLEMS.filter((p) => {
      const matchesSearch =
        searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTopic = topicFilter === "All Topics" || p.topic === topicFilter
      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Solved" && p.status === "solved") ||
        (statusFilter === "Attempted" && p.status === "attempted") ||
        (statusFilter === "Unsolved" && p.status === "unsolved")
      const matchesDifficulty =
        difficultyFilter === "All Difficulties" || p.difficulty === difficultyFilter
      return matchesSearch && matchesTopic && matchesStatus && matchesDifficulty
    })
  }, [searchQuery, topicFilter, statusFilter, difficultyFilter])

  return (
    <div className="mb-12">
      {/* ── Category Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-5 border-b border-white/10">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer relative ${activeCategory === cat.label
                ? "text-white"
                : "text-white/50 hover:text-white/80"
              }`}
          >
            {cat.label}
            {activeCategory === cat.label && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Main Layout: Table + Sidebar ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left: Search + Filters + Table */}
        <div className="xl:col-span-3 relative">
          {/* Coming Soon Overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl backdrop-blur-md bg-black/40">
              <div className="flex flex-col items-center gap-3">
                <Lock className="h-8 w-8 text-white/60" />
                <p className="text-lg font-semibold text-white/80">Coming Soon</p>
                <p className="text-sm text-white/40 max-w-[280px] text-center">We&apos;re working on problems for this section. Stay tuned!</p>
              </div>
            </div>
          )}
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search for problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-neutral-900 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Topic Filter */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${topicFilter !== "All Topics" ? "bg-neutral-800 border-white/25" : "bg-neutral-900 border border-white/10 hover:bg-neutral-800"} text-white hover:cursor-pointer`}
                >
                  {topicFilter === "All Topics" ? "Topic" : topicFilter}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" avoidCollisions={false} className="bg-black/90 border-white/10 max-h-[320px] overflow-hidden flex flex-col">
                <div className="px-2 py-1.5 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={topicSearchQuery}
                      onChange={(e) => setTopicSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="w-full pl-7 pr-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white placeholder:text-white/40 outline-none focus:border-white/25"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 glass-scrollbar">
                  <DropdownMenuItem onClick={() => { setTopicFilter("All Topics"); setTopicSearchQuery(""); }} className="text-white hover:bg-white/10">
                    All Topics
                  </DropdownMenuItem>
                  {filteredTopics.map((topic) => (
                    <DropdownMenuItem key={topic} onClick={() => { setTopicFilter(topic); setTopicSearchQuery(""); }} className="text-white hover:bg-white/10">
                      {topic}
                    </DropdownMenuItem>
                  ))}
                  {filteredTopics.length === 0 && (
                    <div className="px-3 py-2 text-xs text-white/40">No topics found</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${statusFilter !== "All Status" ? "bg-neutral-800 border-white/25" : "bg-neutral-900 border border-white/10 hover:bg-neutral-800"} text-white hover:cursor-pointer`}
                >
                  {statusFilter === "All Status" ? "Status" : statusFilter}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10">
                <DropdownMenuItem onClick={() => setStatusFilter("All Status")} className="text-white hover:bg-white/10">
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Solved")} className="text-white hover:bg-white/10">
                  Solved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Attempted")} className="text-white hover:bg-white/10">
                  Attempted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Unsolved")} className="text-white hover:bg-white/10">
                  Unsolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Difficulty Filter */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${difficultyFilter !== "All Difficulties" ? "bg-neutral-800 border-white/25" : "bg-neutral-900 border border-white/10 hover:bg-neutral-800"} text-white hover:cursor-pointer`}
                >
                  {difficultyFilter === "All Difficulties" ? "Difficulty" : difficultyFilter}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10">
                <DropdownMenuItem onClick={() => setDifficultyFilter("All Difficulties")} className="text-white hover:bg-white/10">
                  All Difficulties
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter("Easy")} className="text-white hover:bg-white/10">
                  Easy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter("Medium")} className="text-white hover:bg-white/10">
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter("Hard")} className="text-white hover:bg-white/10">
                  Hard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Problem Table */}
          <div className="liquid-glass rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-[48px_16px_1fr_120px_100px_100px] gap-3 px-5 py-3 border-b border-white/10 text-xs font-medium text-white/50 uppercase tracking-wider">
              <span>Status</span>
              <span></span>
              <span>Title</span>
              <span>Topic</span>
              <span>Score</span>
              <span>Difficulty</span>
            </div>

            {/* Table Rows */}
            <div className="max-h-[420px] overflow-y-auto glass-scrollbar">
              {filteredProblems.length === 0 ? (
                <div className="px-5 py-10 text-center text-white/40 text-sm">
                  No problems match your filters.
                </div>
              ) : (
                filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => {
                      localStorage.setItem("mockq_current_problem", JSON.stringify(problem))
                      router.push("/interview/code")
                      //console.log("Navigating to problem:", problem.title)
                    }}
                    className="grid grid-cols-[1fr] sm:grid-cols-[48px_16px_1fr_120px_100px_100px] gap-3 px-5 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer items-center"
                  >
                    {/* Status icon */}
                    <div className="hidden sm:flex items-center justify-center">
                      {problem.status === "solved" && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                      {problem.status === "attempted" && <Clock className="h-5 w-5 text-amber-400" />}
                      {problem.status === "unsolved" && <XCircle className="h-5 w-5 text-red-400" />}
                    </div>

                    {/* Spacer between status and title */}
                    <div className="hidden sm:block" />

                    {/* Title (mobile: shows all info) */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                      <div className="flex items-center gap-2 sm:hidden">
                        {problem.status === "solved" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        {problem.status === "attempted" && <Clock className="h-4 w-4 text-amber-400" />}
                        {problem.status === "unsolved" && <XCircle className="h-4 w-4 text-red-400" />}
                        <span className="text-sm font-medium text-white">{problem.title}</span>
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-white">{problem.title}</span>
                      {/* Mobile extra info */}
                      <div className="flex items-center gap-3 sm:hidden text-xs text-white/50 ml-6">
                        <span>{problem.topic}</span>
                        <span>{getDisplayScore(problem)}</span>
                        <span className={difficultyColor[problem.difficulty]}>{problem.difficulty}</span>
                      </div>
                    </div>

                    {/* Topic */}
                    <span className="hidden sm:block text-sm text-white/60">{problem.topic}</span>

                    {/* Score */}
                    <span className="hidden sm:block text-sm text-white/70 font-mono">{getDisplayScore(problem)}</span>

                    {/* Difficulty (no dot, just colored text) */}
                    <span className={`hidden sm:block text-sm ${difficultyColor[problem.difficulty]}`}>{problem.difficulty}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Analytics Sidebar
        <div className="xl:col-span-1 relative">
          {isComingSoon && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl backdrop-blur-md bg-black/40">
              <div className="flex flex-col items-center gap-3">
                <Lock className="h-8 w-8 text-white/60" />
                <p className="text-lg font-semibold text-white/80">Coming Soon</p>
              </div>
            </div>
          )}
        <AnalyticsOverview interviews={interviews} vertical />
        </div>*/}
      </div>
    </div>
  )
}
