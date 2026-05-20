import { NextRequest, NextResponse } from "next/server"
import {
  submitBatch,
  wrapTwoSum,
  wrapperLineOffset,
  JUDGE0_LANG_ID,
  type Judge0Submission,
  type Judge0Result,
} from "@/lib/judge0"
import { TEST_CASE_REGISTRY, type TestCase } from "@/lib/test-cases"

// ---- Types returned to the client ----

interface CaseResult {
  label: string
  passed: boolean
  /** Status description from Judge0 (e.g. "Accepted", "Wrong Answer") */
  status: string
  /** Only included for non-hidden cases */
  input?: string
  expectedOutput?: string
  actualOutput?: string
  stderr?: string
  /** Line number in the user's editor (1-based), derived from stderr */
  userErrorLine?: number | null
  time?: string | null
  hidden: boolean
}

interface RunCodeResponse {
  passed: number
  total: number
  results: CaseResult[]
}

// ---- Helpers ----

/** Strip ALL whitespace – used exclusively for pass/fail comparison */
function compareNormalize(s: string | null | undefined): string {
  return (s ?? "").replace(/\s/g, "")
}

/** Trim leading/trailing whitespace but keep internal newlines for readable stderr */
function displayTrim(s: string | null | undefined): string {
  return (s ?? "").trim()
}

/**
 * Strip internal wrapper/driver frames from stderr so only the user's
 * code frames and the final error message are shown.
 */
function filterUserErrors(stderr: string): string {
  const lines = stderr.split("\n")
  const filtered: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]!

    // Skip "Traceback (most recent call last):" header
    if (line.trim().startsWith("Traceback")) {
      i++
      continue
    }

    // For "File ..." stack frames, keep only those referencing user functions
    // (skip _driver, <module>, and wrapper-internal frames)
    if (line.trim().startsWith("File")) {
      const isDriverFrame =
        line.includes("_driver") ||
        line.includes("<module>") ||
        line.includes("in _driver")

      if (isDriverFrame) {
        // Skip this frame line and any following code-context line
        i++
        if (i < lines.length && !lines[i]!.trim().startsWith("File") && !lines[i]!.includes("Error")) {
          i++
        }
        continue
      }

      // User frame — keep it and its code-context line
      filtered.push(line)
      i++
      if (i < lines.length && !lines[i]!.trim().startsWith("File") && !lines[i]!.includes("Error")) {
        filtered.push(lines[i]!)
        i++
      }
      continue
    }

    // Keep error message lines (NameError, TypeError, etc.) and anything else
    filtered.push(line)
    i++
  }

  return filtered.join("\n").trim()
}

function wrapCode(userCode: string, language: string, _problemId: string): string {
  // For now only Two-Sum wrapper exists – extend switch when adding problems
  return wrapTwoSum(userCode, language)
}

// ---- Route handler ----

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, language, problemId } = body as {
      code?: string
      language?: string
      problemId?: string
    }

    if (!code || !language) {
      return NextResponse.json(
        { error: "code and language are required" },
        { status: 400 },
      )
    }

    const langId = JUDGE0_LANG_ID[language]
    if (langId === undefined) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 },
      )
    }

    // Look up test cases
    const testCases: TestCase[] =
      TEST_CASE_REGISTRY[problemId ?? ""] ?? TEST_CASE_REGISTRY["1"]!

    // Wrap user code with driver
    const fullSource = wrapCode(code, language, problemId ?? "1")

    // Build a submissions array for the batch endpoint
    const submissions: Judge0Submission[] = testCases.map((tc) => ({
      source_code: fullSource,
      language_id: langId,
      stdin: tc.input,
      cpu_time_limit: 5,
      memory_limit: 256_000,
    }))

    // Submit all test cases in a single batch request
    let judgeResults: Judge0Result[]
    try {
      judgeResults = await submitBatch(submissions)
    } catch (err) {
      // If the entire batch fails, mark every case as errored
      const results: CaseResult[] = testCases.map((tc) => ({
        label: tc.label,
        passed: false,
        status: `Submission error: ${(err as Error).message}`,
        hidden: !!tc.hidden,
      }))
      const response: RunCodeResponse = { passed: 0, total: testCases.length, results }
      return NextResponse.json(response)
    }

    // Process each result against its corresponding test case
    const results: CaseResult[] = []
    let passed = 0

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i]!
      const judgeResult = judgeResults[i]!

      const actual = compareNormalize(judgeResult.stdout)
      const expected = compareNormalize(tc.expectedOutput)
      const statusId = judgeResult?.status?.id ?? -1
      const isPassed = statusId === 3 && actual === expected

      const derivedStatus = isPassed
        ? "Accepted"
        : statusId === 3
          ? "Wrong Answer"
          : judgeResult?.status?.description ?? "Unknown status"

      if (isPassed) passed++

      // Keep stderr readable
      const rawStderr = displayTrim(judgeResult.stderr) || displayTrim(judgeResult.compile_output) || undefined

      // Translate script-level line numbers → editor line numbers
      const offset = wrapperLineOffset(language)
      let stderrDisplay = rawStderr
      let userErrorLine: number | null = null
      if (rawStderr && offset > 0) {
        stderrDisplay = rawStderr.replace(
          /((?:line\s+|:))(\d+)/gi,
          (_match, prefix, num) => {
            const scriptLine = Number.parseInt(num, 10)
            const editorLine = Math.max(1, scriptLine - offset)
            if (userErrorLine === null) userErrorLine = editorLine
            return `${prefix}${editorLine}`
          },
        )
        // Replace internal filenames with "Your code"
        stderrDisplay = stderrDisplay.replace(
          /"?script\.py"?|"?Main\.java"?|"?Solution\.[a-z]+"?/gi,
          "Your code",
        )

        // Filter out internal wrapper frames, keep only user code frames + error
        stderrDisplay = filterUserErrors(stderrDisplay)
      }

      results.push({
        label: tc.label,
        passed: isPassed,
        status: derivedStatus,
        input: tc.hidden ? undefined : tc.input,
        expectedOutput: tc.hidden ? undefined : tc.expectedOutput,
        actualOutput: tc.hidden ? undefined : displayTrim(judgeResult.stdout),
        stderr: tc.hidden ? undefined : stderrDisplay || undefined,
        userErrorLine: tc.hidden ? undefined : userErrorLine,
        time: judgeResult.time,
        hidden: !!tc.hidden,
      })
    }

    const response: RunCodeResponse = { passed, total: testCases.length, results }
    return NextResponse.json(response)
  } catch (error: unknown) {
    console.error("run-code error:", error)
    const message =
      error instanceof Error ? error.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
