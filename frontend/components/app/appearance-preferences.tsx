"use client"

import { useEffect } from "react"

const STORAGE_KEY = "mockq-appearance"
const DEFAULT_SCHEME = "mockq-dark"
const DEFAULT_TYPING_FONT = "commit-mono"

const typingFonts: Record<string, string> = {
  "commit-mono": "var(--font-commit-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  "jetbrains": "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  "system-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  "system-sans": "var(--font-public-sans), ui-sans-serif, system-ui, sans-serif",
}

export function applyAppearancePreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    const scheme = parsed.scheme || DEFAULT_SCHEME
    const typingFont = parsed.typingFont || DEFAULT_TYPING_FONT

    document.documentElement.dataset.mockqScheme = scheme
    document.documentElement.style.setProperty(
      "--mockq-typing-font",
      typingFonts[typingFont] || typingFonts[DEFAULT_TYPING_FONT]
    )
  } catch {
    document.documentElement.dataset.mockqScheme = DEFAULT_SCHEME
    document.documentElement.style.setProperty("--mockq-typing-font", typingFonts[DEFAULT_TYPING_FONT])
  }
}

export function AppearancePreferences() {
  useEffect(() => {
    applyAppearancePreferences()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) applyAppearancePreferences()
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return null
}

export { STORAGE_KEY as APPEARANCE_STORAGE_KEY }
