"use client"

import React, { useCallback, useRef, useState } from "react"
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/onboarding-types"

export interface ResumeUploadProps {
  /** Current file name (empty string if none) */
  resumeFileName: string
  /** Called when a valid file is selected */
  onFileSelected: (file: File, fileName: string) => void
  /** Optional label override */
  label?: string
  /** Optional subtitle shown next to the label */
  subtitle?: string
}

export function ResumeUpload({
  resumeFileName,
  onFileSelected,
  label = "Resume",
  subtitle = "(PDF, DOCX, or TXT — max 5 MB)",
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndSet = useCallback(
    (file: File) => {
      setError(null)
      const ext = file.name.split(".").pop()?.toLowerCase()
      if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
        setError("Please upload a PDF, DOCX, or TXT file.")
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("File must be under 5 MB.")
        return
      }
      onFileSelected(file, file.name)
    },
    [onFileSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files?.[0]
      if (file) validateAndSet(file)
    },
    [validateAndSet]
  )

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">
        {label}{" "}
        <span className="text-white/40 text-xs">{subtitle}</span>
      </label>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4
          transition-colors cursor-pointer hover:border-white/60
          ${
            dragActive
              ? "border-white/50 bg-white/10"
              : resumeFileName
              ? "border-white/30 bg-white/[0.04]"
              : "border-white/15 bg-white/[0.02] hover:border-white/25"
          }
        `}
      >
        {resumeFileName ? (
          <>
            <DocumentIcon />
            <span className="text-sm text-white/70">{resumeFileName}</span>
            <span className="text-xs text-white/40">Click or drag to replace</span>
          </>
        ) : (
          <>
            <UploadIcon />
            <span className="text-sm text-white/60">
              Drag & drop your resume here, or{" "}
              <span className="underline text-white/80">browse</span>
            </span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) validateAndSet(file)
        }}
      />

      {error && (
        <p className="text-xs text-red-400 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function UploadIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/40"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/60"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
