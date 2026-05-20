"use client"

import React, { useRef, useCallback } from "react"
import { CodingSessionView } from "@/components/app/coding-session-view"
import InterviewLayoutClient from "@/components/app/interview-layout-client"
import type { AppConfig } from "@/app-config"

interface InterviewModalProps {
  appConfig: AppConfig
  onClose: () => void
}

export default function InterviewModal({ appConfig, onClose }: InterviewModalProps) {
  const sessionRef = useRef<{ cleanup: () => Promise<void> } | null>(null)

  const handleClose = useCallback(async () => {
    if (sessionRef.current) {
      await sessionRef.current.cleanup()
    }
    onClose()
  }, [onClose])

  return (
    <InterviewLayoutClient appConfig={appConfig}>
      <CodingSessionView
        ref={sessionRef}
        appConfig={appConfig}
        onClose={handleClose}
      />
    </InterviewLayoutClient>
  )
}
