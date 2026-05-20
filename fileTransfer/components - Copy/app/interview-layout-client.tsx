"use client"

import React, { useMemo, useEffect } from 'react'
import { TokenSource } from 'livekit-client'
import { SessionProvider, useSession, useSessionContext, StartAudio, RoomAudioRenderer } from '@livekit/components-react'
import { Toaster } from '@/components/livekit/toaster'
import type { AppConfig } from '@/app-config'
import { getSandboxTokenSource } from '@/lib/utils'
import { useAgentErrors } from '@/hooks/useAgentErrors'
import { useDebugMode } from '@/hooks/useDebug'

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production'

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT })
  useAgentErrors()
  return null
}

interface Props {
  appConfig: AppConfig
  children: React.ReactNode
}

export default function InterviewLayoutClient({ appConfig, children }: Props) {
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
      <AppInner appConfig={appConfig}>{children}</AppInner>
    </SessionProvider>
  )
}

function AppInner({ appConfig, children }: Props) {
  const session = useSessionContext()
  const { start } = session

  useEffect(() => {
    // auto-start when landing on interview pages if not already connected
    if (!session.isConnected) {
      ;(async () => {
        try {
          await start()
        } catch (e) {
          // swallow — UI shows errors via hooks
          console.error('Auto-start failed', e)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <AppSetup />
      {children}
      <StartAudio label="Start Audio" />
      <RoomAudioRenderer />
      <Toaster />
    </>
  )
}
