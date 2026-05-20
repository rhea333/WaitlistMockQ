import { Mic, PhoneOff, Play, X } from 'lucide-react'

const TWO_SUM_PROBLEM = {
  id: '1',
  title: 'Two Sum',
  difficulty: 'Easy',
  description: {
    paragraphs: [
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      'You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      'You can return the answer in any order.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ]
  }
}

const STATIC_CODE = `# Write your solution here

def twoSum(nums, target):
    pass`

export function StaticCodingPreview() {
  return (
    <section className="bg-background relative flex h-full w-full select-none flex-col overflow-hidden">
      <div className="bg-background/80 z-50 flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500/50" />
          <span className="text-sm font-medium text-white/50">{TWO_SUM_PROBLEM.title}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/30">
            Python
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="bg-background/50 flex w-[30%] min-w-[300px] max-w-[440px] flex-col overflow-hidden border-r border-white/10">
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="text-sm font-medium text-white/50">Problem Statement</span>
            <button disabled className="cursor-not-allowed rounded p-1 text-white/20">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed opacity-70">
            <h2 className="mb-2 text-xl font-bold text-white/60">
              {TWO_SUM_PROBLEM.id}. {TWO_SUM_PROBLEM.title}
            </h2>
            <div className="mb-5 flex items-center gap-2">
              <span className="rounded-full border border-green-500/10 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400/50">
                {TWO_SUM_PROBLEM.difficulty}
              </span>
            </div>
            {TWO_SUM_PROBLEM.description.paragraphs.map((p, i) => (
              <p key={p} className={`text-white/40 ${i === TWO_SUM_PROBLEM.description.paragraphs.length - 1 ? 'mb-6' : 'mb-4'}`}>
                {p}
              </p>
            ))}
            {TWO_SUM_PROBLEM.description.examples.map((ex, i) => (
              <div key={ex.input} className={i === TWO_SUM_PROBLEM.description.examples.length - 1 ? 'mb-6' : 'mb-5'}>
                <h3 className="mb-2 text-sm font-semibold text-white/50">Example {i + 1}:</h3>
                <div className="space-y-1 rounded-lg border border-white/5 bg-white/[0.03] p-3 font-mono text-xs">
                  <p>
                    <span className="text-white/30">Input:</span> <span className="text-white/50">{ex.input}</span>
                  </p>
                  <p>
                    <span className="text-white/30">Output:</span> <span className="text-white/50">{ex.output}</span>
                  </p>
                  {ex.explanation ? <p className="mt-1 text-white/20">{ex.explanation}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-hidden bg-[#1e1e1e] p-4 font-mono text-sm">
            <div className="flex">
              <div className="flex select-none flex-col items-end pr-4 text-white/20">
                {STATIC_CODE.split('\n').map((_, i) => (
                  <span key={i} className="text-xs leading-6">
                    {i + 1}
                  </span>
                ))}
              </div>
              <pre className="leading-6 text-white/40">
                <code>
                  {STATIC_CODE.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {line.startsWith('#') ? (
                        <span className="text-green-500/40">{line}</span>
                      ) : line.startsWith('def') ? (
                        <>
                          <span className="text-blue-400/50">def </span>
                          <span className="text-yellow-300/50">twoSum</span>
                          <span className="text-white/40">(nums, target):</span>
                        </>
                      ) : line.includes('pass') ? (
                        <span className="text-purple-400/50">    pass</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          <div className="bg-background/80 border-t border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs text-white/20">Test Results</span>
              <button disabled className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-green-600/30 px-4 py-1.5 text-sm font-medium text-white/30">
                <Play className="h-4 w-4" />
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="bg-background/50 flex w-[30%] min-w-[280px] max-w-[400px] flex-col border-l border-white/10">
          <div className="border-b border-white/10 p-3">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/20">Interviewer</div>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-black/50">
              <div className="flex h-16 items-center justify-center gap-1.5">
                {[0.6, 0.3, 0.8, 0.4, 0.5].map((h, i) => (
                  <div key={i} className="w-2 rounded-full bg-white/10" style={{ height: `${h * 40}px` }} />
                ))}
              </div>
              <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white/30">
                AI Interviewer
              </div>
            </div>
          </div>

          <div className="mt-12 shrink-0 p-3">
            <div className="bg-background flex flex-col rounded-[31px] border border-white/10 p-3">
              <div className="flex gap-1">
                <div className="flex grow gap-1">
                  <button disabled className="flex cursor-not-allowed items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-white/20">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button disabled className="flex cursor-not-allowed items-center gap-2 rounded-full bg-red-500/15 px-4 py-2 font-mono text-sm text-red-400/30">
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
