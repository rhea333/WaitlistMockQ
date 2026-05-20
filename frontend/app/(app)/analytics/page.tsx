import { Lock } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <main className="min-h-[100dvh] text-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Lock className="h-12 w-12 text-white/40" />
        <h1 className="text-2xl font-bold text-white/80">Coming Soon</h1>
        <p className="text-sm text-white/40 max-w-sm text-center">
          Advanced analytics and insights are on the way. Stay tuned!
        </p>
      </div>
    </main>
  )
}
