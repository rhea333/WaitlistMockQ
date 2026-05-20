import { headers } from 'next/headers'
import { getAppConfig } from '@/lib/utils'
import { SessionView } from '@/components/app/session-view'

export default async function InterviewPage() {
  const hdrs = await headers()
  const appConfig = await getAppConfig(hdrs)

  return (
    <main className="min-h-[100dvh] text-white flex flex-col">
      <SessionView appConfig={appConfig} />
    </main>
  )
}