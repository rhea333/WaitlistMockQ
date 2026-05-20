"use client"

import React, { useMemo } from 'react'
import { TokenSource } from 'livekit-client'
import { SessionProvider, useSession, useSessionContext } from '@livekit/components-react'
import type { AppConfig } from '@/app-config'
import { InterviewPlan } from './interview-plan'
import { getSandboxTokenSource } from '@/lib/utils'

interface Props {
  appConfig: AppConfig
}

export default function InterviewPlanPageClient({ appConfig }: Props) {
  const tokenSource = useMemo(() => {
    return typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string'
      ? getSandboxTokenSource(appConfig)
      : TokenSource.endpoint('/api/connection-details')
  }, [appConfig])

  const session = useSession(
    tokenSource,
    appConfig.agentName ? { agentName: appConfig.agentName } : undefined
  )

  return (
    <SessionProvider session={session}>
      <Inner appConfig={appConfig} />
    </SessionProvider>
  )
}

function Inner({ appConfig }: Props) {
  const { start } = useSessionContext()

  return <InterviewPlan startButtonText={appConfig.startButtonText} onStartCall={start} />
}
