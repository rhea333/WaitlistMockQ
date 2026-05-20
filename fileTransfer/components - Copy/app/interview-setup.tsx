"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ResumeUpload } from "@/components/app/resume-upload"
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react"

const roles = [
  "Software Engineer", "Product Manager", "UI/UX Designer", "Data Scientist", "DevOps Engineer", "Marketing Manager", "Machine Learning Engineer",
  "Data Engineer", "Site Reliability Engineer", "Security Engineer", "Mobile Engineer", "Frontend Engineer", "Backend Engineer", "Cloud Engineer",
  "Platform Engineer", "QA Engineer", "Solutions Architect", "Technical Program Manager", "Product Marketing Manager", "Growth Manager", "Business Intelligence Analyst",
  "UX Researcher", "Technical Writer", "Sales Engineer", "Customer Success Manager", "Operations Manager", "Program Manager"
]


const companies = [
  "Google", "Meta", "Apple", "Amazon", "Microsoft", "Netflix", "Shopify", "Intuit",
  "OpenAI", "NVIDIA", "Tesla", "Adobe", "Salesforce", "Oracle", "IBM", "Uber",
  "Airbnb", "Stripe", "Square", "PayPal", "LinkedIn", "Snap", "Pinterest", "Spotify",
  "Zoom", "Slack", "Atlassian", "Palantir", "Snowflake", "Databricks", "Figma",
  "Notion", "Twilio", "Dropbox", "Lyft", "Coinbase", "Robinhood", "DoorDash"
]

const experienceLevels = [
  { value: "entry", label: "Entry (0-2 years)" },
  { value: "mid", label: "Mid-Level (3-6 years)" },
  { value: "senior", label: "Senior (7+ years)" },
]

export function InterviewSetup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    company: "",
    jobUrl: "",
  })
  const [resumeFileName, setResumeFileName] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [roleOpen, setRoleOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [experienceOpen, setExperienceOpen] = useState(false)
  const [autofilledFields, setAutofilledFields] = useState<Set<string>>(new Set())
  // Preserve job context (e.g. jobTitle, company) from the job feed for downstream pages
  const [jobContext, setJobContext] = useState<Record<string, string>>({})

  // Autofill form from localStorage when navigating from job feed
  useEffect(() => {
    const stored = localStorage.getItem("mockq_current_interview")
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      const updates: Partial<typeof formData> = {}
      const filled = new Set<string>()

      if (parsed.jobLink) {
        updates.jobUrl = parsed.jobLink
        filled.add("jobUrl")
      }

      // Preserve metadata that doesn't map to form fields
      const context: Record<string, string> = {}
      if (parsed.jobTitle) context.jobTitle = parsed.jobTitle
      if (parsed.company) context.company = parsed.company
      if (parsed.role) context.role = parsed.role
      setJobContext(context)

      if (Object.keys(updates).length > 0) {
        setFormData((prev) => ({ ...prev, ...updates }))
        setAutofilledFields(filled)
      }

      // Clean up so stale data doesn't persist on future visits
      localStorage.removeItem("mockq_current_interview")
    } catch {
      // Ignore malformed JSON
    }
  }, [])

  const handleGenerate = () => {
    const payload = {
      ...jobContext,
      ...formData,
      // Keep explicit company/role from the form; fall back to job context
      company: formData.company || jobContext.company || "",
      role: formData.role || jobContext.role || "",
    }
    localStorage.setItem("mockq_current_interview", JSON.stringify(payload))
    router.push("/interview-plan")
  }

  return (
    <section className="relative isolate overflow-hidden py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white/70 hover:text-white hover:bg-white/5 hover:cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Practice
        </Button>

        {/* Setup Form */}
        <div className="liquid-glass-enhanced rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">Interview Setup</h1>
          <p className="text-white/60 mb-8">Configure your interview parameters</p>

          <div className="space-y-6">
            {/* Target Role */}
            <div className="space-y-2">
              <Label className="text-sm text-white/90">Target Role *</Label>
              <Popover open={roleOpen} onOpenChange={setRoleOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={roleOpen}
                    className="min-w-[200px] justify-between glass-border bg-transparent text-white hover:bg-blue-600"
                  >
                    {formData.role || "Select a role"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-black/90 border-white/10" align="start">
                  <Command className="bg-black/90 [&_[cmdk-input-wrapper]]:border-white/10">
                    <CommandInput placeholder="Search roles..." className="text-white placeholder:text-white/60" />
                    <CommandList className="max-h-[200px] overflow-y-auto glass-scrollbar">
                      <CommandEmpty className="text-white/60 py-6 text-center text-sm">No role found.</CommandEmpty>
                      <CommandGroup>
                        {roles.map((role) => (
                          <CommandItem
                            key={role}
                            value={role}
                            onSelect={(currentValue: string) => {
                              setFormData({ ...formData, role: currentValue === formData.role ? "" : currentValue })
                              setRoleOpen(false)
                            }}
                            className="text-white hover:bg-white/10 hover:cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${formData.role === role ? "opacity-100" : "opacity-0"}`}
                            />
                            {role}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <Label className="text-sm text-white/90">Experience Level *</Label>
              <Popover open={experienceOpen} onOpenChange={setExperienceOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={experienceOpen}
                    className="min-w-[200px] justify-between glass-border bg-transparent text-white hover:bg-white/5"
                  >
                    {formData.experience
                      ? experienceLevels.find((level) => level.value === formData.experience)?.label
                      : "Select experience level"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-black/90 border-white/10" align="start">
                  <Command className="bg-black/90">
                    <CommandList className="max-h-[200px] overflow-y-auto glass-scrollbar">
                      <CommandEmpty className="text-white/60 py-6 text-center text-sm">No level found.</CommandEmpty>
                      <CommandGroup>
                        {experienceLevels.map((level) => (
                          <CommandItem
                            key={level.value}
                            value={level.label}
                            onSelect={(currentValue: string) => {
                              const selectedLevel = experienceLevels.find(
                                (l) => l.label.toLowerCase() === currentValue.toLowerCase()
                              )
                              setFormData({
                                ...formData,
                                experience: selectedLevel?.value === formData.experience ? "" : selectedLevel?.value || ""
                              })
                              setExperienceOpen(false)
                            }}
                            className="text-white hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${formData.experience === level.value ? "opacity-100" : "opacity-0"}`}
                            />
                            {level.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label className="text-sm text-white/90">Company (optional)</Label>
              <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={companyOpen}
                    className="min-w-[200px] justify-between glass-border bg-transparent text-white hover:bg-white/5"
                  >
                    {formData.company || "Select a company"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-black/90 border-white/10" align="start">
                  <Command className="bg-black/90 [&_[cmdk-input-wrapper]]:border-white/10">
                    <CommandInput placeholder="Search companies..." className="text-white placeholder:text-white/60" />
                    <CommandList className="max-h-[200px] overflow-y-auto glass-scrollbar">
                      <CommandEmpty className="text-white/60 py-6 text-center text-sm">No company found.</CommandEmpty>
                      <CommandGroup>
                        {companies.map((company) => (
                          <CommandItem
                            key={company}
                            value={company}
                            onSelect={(currentValue: string) => {
                              setFormData({ ...formData, company: currentValue === formData.company ? "" : currentValue })
                              setCompanyOpen(false)
                            }}
                            className="text-white hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${formData.company === company ? "opacity-100" : "opacity-0"}`}
                            />
                            {company}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/50">Or</span>
              </div>
            </div>

            {/* Job Posting URL */}
            <div className="space-y-2">
              <Label htmlFor="jobUrl" className="text-sm text-white/90">
                Job Posting URL
              </Label>
              <Input
                id="jobUrl"
                type="url"
                value={formData.jobUrl}
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                className="glass-border bg-transparent text-white placeholder:text-white/40"
                placeholder="https://company.com/jobs/12345"
              />
              <p className="text-xs text-white/50">
                {autofilledFields.has("jobUrl")
                  ? "Autofilled from your job selection. MockQ will infer role, level, and company from this posting."
                  : "MockQ will automatically infer role, level, and company context"}
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/50">Optional</span>
              </div>
            </div>

            {/* Tailored Resume Upload */}
            <div className="space-y-2">
              <ResumeUpload
                resumeFileName={resumeFileName}
                onFileSelected={(file, fileName) => {
                  setResumeFile(file)
                  setResumeFileName(fileName)
                }}
                label="Tailored Resume"
                subtitle="(optional — upload a resume tailored to this job posting)"
              />
              <p className="text-xs text-white/50">Upload a resume customized for this role to get more targeted interview questions</p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!formData.role && !formData.jobUrl}
              className="w-full bg-white text-black font-semibold rounded-lg py-6 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform duration-300 hover:scale-110 hover:cursor-pointer"
            >
              Generate Interview
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
