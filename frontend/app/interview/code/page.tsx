import { headers } from "next/headers"
import { getAppConfig } from "@/lib/utils"
import { CodeSessionView } from "@/components/app/code-session-view"

export default async function CodeInterviewPage() {
  const hdrs = await headers()
  const appConfig = await getAppConfig(hdrs)

  return (
    <main className="h-[100dvh] text-white flex flex-col">
      <CodeSessionView appConfig={appConfig} />
    </main>
  )
}
