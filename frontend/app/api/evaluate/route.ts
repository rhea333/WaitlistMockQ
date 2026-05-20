import { NextRequest, NextResponse } from "next/server"

const EVAL_BACKEND_URL = process.env.EVAL_BACKEND_URL ?? "http://localhost:8001"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { question, testCases, codeSubmission, interviewTranscript } = body

    // ---- DEBUG: dump raw inputs ----
    console.log("=".repeat(70))
    console.log("[evaluate] DEBUG — RAW INPUTS FROM FRONTEND")
    console.log("=".repeat(70))
    console.log("[evaluate] INTERVIEW TRANSCRIPT (%d chars):", (interviewTranscript ?? "").length)
    console.log(interviewTranscript ?? "(empty)")
    console.log("-".repeat(70))
    console.log("[evaluate] CODE SUBMISSION (%d chars):", (codeSubmission ?? "").length)
    console.log(codeSubmission ?? "(empty)")
    console.log("=".repeat(70))

    if (!question || !codeSubmission || !interviewTranscript) {
      return NextResponse.json(
        { error: "Missing required fields: question, codeSubmission, interviewTranscript" },
        { status: 400 },
      )
    }

    const res = await fetch(`${EVAL_BACKEND_URL}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        testCases: testCases ?? [],
        codeSubmission,
        interviewTranscript,
      }),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      console.error("[evaluate] Backend error:", res.status, errBody)
      return NextResponse.json(
        { error: errBody.detail ?? "Evaluation backend error" },
        { status: res.status },
      )
    }

    const data = await res.json()

    console.log("=".repeat(70))
    console.log("EVALUATION RESULT")
    console.log("=".repeat(70))
    console.log(data.evaluation)
    console.log("=".repeat(70))
    console.log("Overall Score:", data.overallScore)
    console.log("Hire Recommendation:", data.hireRecommendation)
    console.log("=".repeat(70))

    return NextResponse.json(data)
  } catch (err) {
    console.error("[evaluate] Error:", err)
    return NextResponse.json(
      { error: "Failed to run evaluation" },
      { status: 500 },
    )
  }
}
