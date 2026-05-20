"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Loader2 } from "lucide-react"
import { StaticCodingPreview } from "@/components/app/static-coding-preview"
import type { AppConfig } from "@/app-config"

// Lazy-load the heavy modal contents (LiveKit + Monaco + CodingSessionView)
// so they are only fetched when the user clicks "Start Interview"
const InterviewModal = dynamic(
  () => import("@/components/app/interview-modal"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
          <p className="text-sm text-white/40">Loading interview environment…</p>
        </div>
      </div>
    ),
  }
)

interface Props {
  appConfig: AppConfig
}

export function LandingInterviewSection({ appConfig }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  const handleOpen = useCallback(() => {
    setModalOpen(true)
    setHasOpened(true)
  }, [])

  const handleClose = useCallback(() => {
    setModalOpen(false)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [modalOpen])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleClose])

  return (
    <>
      {/* Static Preview */}
      <div className="w-full max-w-5xl rounded-xl p-[1px] bg-white/10 mb-12">
        <div className="bg-black/60 backdrop-blur-xl rounded-xl overflow-hidden h-[500px]">
          <StaticCodingPreview />
        </div>
      </div>

      {/* Start Interview Button */}
      <button
        onClick={handleOpen}
        className="text-base font-medium bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 rounded-full transition-all h-12 px-8 shadow-sm mb-4 flex items-center gap-2 cursor-pointer"
      >
        Start Interview <ArrowRight className="w-5 h-5" />
      </button>

      {/* Modal Overlay — only mounts the heavy InterviewModal after first open */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-xl"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Container */}
            <motion.div
              className="relative w-[95vw] max-w-6xl h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              style={{
                background: "rgba(10, 10, 10, 0.85)",
                backdropFilter: "blur(40px) saturate(180%)",
                boxShadow: "0 32px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Dynamically-loaded interview session */}
              <InterviewModal
                appConfig={appConfig}
                onClose={handleClose}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
