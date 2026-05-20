"use client"

import React, { useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import type { editor } from "monaco-editor"

// Re-export the Monaco type for consumers
export type MonacoInstance = Parameters<OnMount>[1]

// Language mapping from display names to Monaco language IDs
export const LANGUAGE_MAP: Record<string, string> = {
  Python: "python",
  JavaScript: "javascript",
  Java: "java",
  "C++": "cpp",
  Go: "go",
  Rust: "rust",
  TypeScript: "typescript",
}

// Default starter code per language
const STARTER_CODE: Record<string, string> = {
  python: `# Write your solution here\n\ndef twoSum(nums, target):\n    pass\n`,
  javascript: `// Write your solution here\n\nfunction twoSum(nums, target) {\n  \n}\n`,
  java: `// Write your solution here\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n`,
  cpp: `// Write your solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n`,
  go: `// Write your solution here\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello")\n}\n`,
  rust: `// Write your solution here\n\nfn main() {\n    \n}\n`,
  typescript: `// Write your solution here\n\nfunction twoSum(nums: number[], target: number): number[] | null {\n  return null\n}\n`,
}

interface CodeEditorProps {
  language?: string
  defaultValue?: string
  onChange?: (value: string | undefined) => void
  onEditorReady?: (
    editor: editor.IStandaloneCodeEditor,
    monaco: MonacoInstance,
  ) => void
  className?: string
}

export function CodeEditor({
  language = "Python",
  defaultValue,
  onChange,
  onEditorReady,
  className,
}: CodeEditorProps) {
  const monacoLang = LANGUAGE_MAP[language] || "python"
  const starterCode = defaultValue || STARTER_CODE[monacoLang] || ""
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null)

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    // Disable all IntelliSense / autocomplete for interview fairness
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnCommitCharacter: false,
    acceptSuggestionOnEnter: "off",
    wordBasedSuggestions: "off",
    parameterHints: { enabled: false },
    hover: { enabled: false },
    codeLens: false,

    // Editor appearance
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
    fontLigatures: true,
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: "line",
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    bracketPairColorization: { enabled: true },
    automaticLayout: true,
    tabSize: 4,
    wordWrap: "on",
    glyphMargin: true,
  }

  const handleMount: OnMount = (editor, monaco) => {
    setEditorInstance(editor)
    onEditorReady?.(editor, monaco)
    editor.focus()
  }

  return (
    <div className={className} style={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language={monacoLang}
        defaultValue={starterCode}
        options={editorOptions}
        onChange={onChange}
        onMount={handleMount}
        theme="vs-dark"
        loading={
          <div className="flex items-center justify-center h-full text-white/50 text-sm">
            Loading editor...
          </div>
        }
      />
    </div>
  )
}
