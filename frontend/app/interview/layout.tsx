import { headers } from 'next/headers'
import InterviewLayoutClient from '@/components/app/interview-layout-client'
import { getAppConfig } from '@/lib/utils'

interface Props {
  children: React.ReactNode
}

export default async function InterviewLayout({ children }: Props) {
  const hdrs = await headers()
  const appConfig = await getAppConfig(hdrs)

  return (
    // client layout handles session/provider
    <InterviewLayoutClient appConfig={appConfig}>{children}</InterviewLayoutClient>
  )
}
