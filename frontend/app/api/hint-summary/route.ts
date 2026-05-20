import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/hint-summary
 *
 * Takes a full hint + line range and returns a brief, voice-friendly summary
 * that the LiveKit voice agent can speak aloud. The summary should reference
 * the line numbers and give a conversational nudge — NOT repeat the hint verbatim.
 */
export async function POST(req: NextRequest) {
  try {
    const { hint, lineStart, lineEnd } = await req.json()

    if (!hint || typeof hint !== "string") {
      return NextResponse.json(
        { error: "hint string is required" },
        { status: 400 },
      )
    }

    const systemPrompt = `You are a friendly interview coach speaking to a candidate during a live coding interview. You've just given them a written hint in their code editor. Now you need to BRIEFLY guide them with your voice.

Rules:
• Speak in 1-2 short sentences MAX. Be conversational, like a friend nudging them.
• Reference the line numbers so they know where to look (e.g. "Take a look around lines 3 to 5").
• Summarize the IDEA of the hint — do NOT repeat it word for word.
• Be encouraging but brief. No code in your response.
• Do NOT say "hint" or "the hint says". Just naturally guide them.

Example good response: "Hey, check out lines 4 through 6 — think about what data structure could help you avoid that nested loop."
Example bad response: "The hint I gave you says to use a hash map to store complements. Look at lines 4-6 where you have a nested loop and consider replacing it with a dictionary lookup."
`

    const userContent = `Hint text: "${hint}"
${lineStart && lineEnd ? `Relevant lines: ${lineStart}-${lineEnd}` : "No specific line range."}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: 150,
      temperature: 0.8,
    })

    const summary = completion.choices[0]?.message?.content || ""

    return NextResponse.json({ summary })
  } catch (error: unknown) {
    console.error("Hint summary API error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to generate summary"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
