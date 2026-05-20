import { StaticCodingPreview } from './static-coding-preview'

export function LandingInterviewSection() {
  return (
    <>
      <div className="mb-12 w-full max-w-5xl rounded-xl bg-white/10 p-[1px]">
        <div className="h-[500px] overflow-hidden rounded-xl bg-black/60 backdrop-blur-xl">
          <StaticCodingPreview />
        </div>
      </div>
    </>
  )
}
