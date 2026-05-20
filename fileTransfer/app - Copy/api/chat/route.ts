import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 },
      )
    }

    const system =
      systemPrompt ||
      "You are a helpful coding assistant. Keep answers concise and focused on code. Use markdown formatting for code blocks."

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 2048,
    })

    const reply = completion.choices[0]?.message?.content || ""

    return NextResponse.json({ reply })
  } catch (error: unknown) {
    console.error("OpenAI API error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to get response"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
