import { headers } from 'next/headers'
import InterviewPlanPageClient from '@/components/app/interview-plan-page-client'
import { getAppConfig } from '@/lib/utils'

export default async function InterviewPlanPage() {
  const hdrs = await headers()
  const appConfig = await getAppConfig(hdrs)

  return (
    <main className="min-h-[100dvh] text-white flex flex-col">
      {/* Client wrapper creates session and passes start/startButtonText */}
      <InterviewPlanPageClient appConfig={appConfig} />
    </main>
  )
}