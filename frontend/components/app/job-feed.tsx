"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MapPin, Briefcase, ArrowRight, Search, ChevronDown, Clock } from "lucide-react"
import {
  getJobs,
  toggleFavoriteJob,
  isFavorited,
  normalizeJobTitleToRole,
  formatPostedDate,
  type Job,
} from "@/lib/job-data"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { addInterview, INTERVIEW_PLANS, ROLE_SCORE_CATEGORIES } from "@/lib/interview-data"
import { useRouter } from "next/navigation"

export function JobFeed() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [favorited, setFavorited] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"relevance" | "recent" | "salary">("relevance")
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("All Roles")
  const [companyFilter, setCompanyFilter] = useState<string>("All Companies")
  const [experienceFilter, setExperienceFilter] = useState<string>("All Levels")
  const [locationFilter, setLocationFilter] = useState<string>("All Locations")

  useEffect(() => {
    const allJobs = getJobs()
    setJobs(allJobs)
    const favIds = new Set(allJobs.filter((job) => isFavorited(job.id)).map((job) => job.id))
    setFavorited(favIds)
    if (allJobs.length > 0) {
      setSelectedJob(allJobs[0])
    }
  }, [])

  const handleFavorite = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const isFav = toggleFavoriteJob(jobId)
    setFavorited((prev) => {
      const newSet = new Set(prev)
      if (isFav) {
        newSet.add(jobId)
      } else {
        newSet.delete(jobId)
      }
      return newSet
    })
    window.dispatchEvent(new Event("storage"))
  }

  const handleApply = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    // Auto-favorite when applying
    if (!favorited.has(job.id)) {
      toggleFavoriteJob(job.id)
      setFavorited((prev) => {
        const newSet = new Set(prev)
        newSet.add(job.id)
        return newSet
      })
      window.dispatchEvent(new Event("storage"))
    }

    // Open external link
    window.open(job.href, "_blank")
  }

  // Function for creating personalized interview plan based off of job feed
  const handleCreatePlan = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    // Normalize job title to interview role
    const interviewRole = normalizeJobTitleToRole(job.title)

    // Store interview context including job title
    localStorage.setItem(
      "mockq_current_interview",
      JSON.stringify({
        role: interviewRole,
        company: job.company,
        jobTitle: job.title,
        jobLink: job.href,
      }),
    )

    router.push("/interview-setup")
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "All Roles" || job.role === roleFilter
    const matchesCompany = companyFilter === "All Companies" || job.company === companyFilter
    const matchesExperience = experienceFilter === "All Levels" || job.experience === experienceFilter
    const matchesLocation =
      locationFilter === "All Locations" ||
      (locationFilter === "Remote" && job.location.includes("Remote")) ||
      (locationFilter === "Hybrid" && job.location.includes("Hybrid")) ||
      (locationFilter === "On-site" && !job.location.includes("Remote") && !job.location.includes("Hybrid"))

    return matchesSearch && matchesRole && matchesCompany && matchesExperience && matchesLocation
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "recent") {
      return b.id.localeCompare(a.id)
    }
    if (sortBy === "salary") {
      const getSalaryMax = (salaryStr: string = "") => {
        const match = salaryStr.match(/\$(\d+)k\s*-\s*\$(\d+)k/)
        return match ? Number.parseInt(match[2]) : 0
      }
      return getSalaryMax(b.salary) - getSalaryMax(a.salary)
    }
    return 0
  })

  const uniqueRoles = Array.from(new Set(jobs.map((j) => j.role)))
  const uniqueCompanies = Array.from(new Set(jobs.map((j) => j.company)))
  const uniqueExperience = Array.from(new Set(jobs.map((j) => j.experience)))

  return (
    <section className="relative isolate overflow-hidden py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search jobs, companies, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="glass-border hover:bg-white/5 text-white min-w-[140px] bg-transparent hover:cursor-pointer"
                >
                  Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10">
                <DropdownMenuItem onClick={() => setSortBy("relevance")} className="text-white hover:bg-white/10">
                  Relevance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("recent")} className="text-white hover:bg-white/10">
                  Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("salary")} className="text-white hover:bg-white/10">
                  Salary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${roleFilter !== "All Roles" ? "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer" : "glass-border hover:bg-white/5 hover:cursor-pointer"} text-white`}
                >
                  {roleFilter}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10">
                <DropdownMenuItem onClick={() => setRoleFilter("All Roles")} className="text-white hover:bg-white/10">
                  All Roles
                </DropdownMenuItem>
                {uniqueRoles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className="text-white hover:bg-white/10"
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${companyFilter !== "All Companies" ? "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer" : "glass-border hover:bg-white/5 hover:cursor-pointer"} text-white`}
                >
                  {companyFilter}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10">
                <DropdownMenuItem
                  onClick={() => setCompanyFilter("All Companies")}
                  className="text-white hover:bg-white/10"
                >
                  All Companies
                </DropdownMenuItem>
                {uniqueCompanies.map((company) => (
                  <DropdownMenuItem
                    key={company}
                    onClick={() => setCompanyFilter(company)}
                    className="text-white hover:bg-white/10"
                  >
                    {company}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${experienceFilter !== "All Levels" ? "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer" : "glass-border hover:bg-white/5 hover:cursor-pointer"} text-white`}
                >
                  {experienceFilter}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10">
                <DropdownMenuItem
                  onClick={() => setExperienceFilter("All Levels")}
                  className="text-white hover:bg-white/10"
                >
                  All Levels
                </DropdownMenuItem>
                {uniqueExperience.map((exp) => (
                  <DropdownMenuItem
                    key={exp}
                    onClick={() => setExperienceFilter(exp)}
                    className="text-white hover:bg-white/10"
                  >
                    {exp}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${locationFilter !== "All Locations" ? "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer" : "glass-border hover:bg-white/5 hover:cursor-pointer"} text-white`}
                >
                  {locationFilter}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10">
                <DropdownMenuItem
                  onClick={() => setLocationFilter("All Locations")}
                  className="text-white hover:bg-white/10"
                >
                  All Locations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocationFilter("Remote")} className="text-white hover:bg-white/10">
                  Remote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocationFilter("Hybrid")} className="text-white hover:bg-white/10">
                  Hybrid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocationFilter("On-site")} className="text-white hover:bg-white/10">
                  On-site
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job List */}
          <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 glass-scrollbar mt-2">
            {sortedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`liquid-glass rounded-lg p-4 cursor-pointer transition-all relative transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_8px_30px_rgba(0,0,0,0.6)] ${selectedJob?.id === job.id
                  ? "ring-2 ring-purple-500 liquid-glass-enhanced"
                  : "hover:liquid-glass-enhanced"
                  }`}
              >
                <button
                  onClick={(e) => handleFavorite(job.id, e)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-all z-10 hover:cursor-pointer"
                  aria-label={favorited.has(job.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={`h-4 w-4 ${favorited.has(job.id) ? "fill-red-500 text-red-500" : "text-white/60 hover:text-white"
                      }`}
                  />
                </button>

                <div className="flex gap-3 pr-8">
                  <div className="w-10 h-10 flex-shrink-0">
                    <Image
                      src={job.logo || "/placeholder.svg"}
                      alt={`${job.company} logo`}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-white mb-0.5 truncate">{job.title}</h3>
                    <p className="text-xs text-white/70 mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {job.experience}
                      </div>
                      <span className="text-white">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-white/50">
                      <Clock className="h-3 w-3" />
                      <span>{formatPostedDate(job.postedDate)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills?.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full glass-border text-[10px] text-white/70">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Full Job Detail */}
          {selectedJob && (
            <div className="lg:col-span-2 liquid-glass rounded-xl p-8 max-h-[calc(100vh-280px)] overflow-y-auto glass-scrollbar mt-2">
              {/* Primary CTAs at top */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={() => handleApply(selectedJob)}
                  variant="outline"
                  className="glass-border bg-transparent hover:bg-white/5 text-white hover:text-white transition-transform duration-300 hover:scale-110 hover:cursor-pointer"
                >
                  Apply
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleCreatePlan(selectedJob)}
                  className="bg-white text-black font-medium transform transition-transform duration-300 hover:scale-110 hover:bg-gray-100 hover:shadow-md hover:cursor-pointer"
                  title="Generate personalized interview plan"
                >
                  Create Interview Plan
                </Button>
              </div>

              {/* Job Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 flex-shrink-0">
                  <Image
                    src={selectedJob.logo || "/placeholder.svg"}
                    alt={`${selectedJob.company} logo`}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{selectedJob.title}</h1>
                  <p className="text-lg text-white/80 mb-2">{selectedJob.company}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {selectedJob.experience}
                    </div>
                    <span className="text-white font-semibold">{selectedJob.salary}</span>
                    <div className="px-2 py-1 rounded-full glass-border text-xs text-white/70">{selectedJob.type}</div>
                  </div>
                </div>
              </div>

              {/* About the Role */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">About the Role</h3>
                <p className="text-white/70 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Responsibilities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities?.map((resp, i) => (
                    <li key={i} className="text-white/70 flex items-start gap-2">
                      <span className="text-white mt-1">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Qualifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Required Qualifications</h3>
                <ul className="space-y-2">
                  {selectedJob.qualifications?.required.map((qual, i) => (
                    <li key={i} className="text-white/70 flex items-start gap-2">
                      <span className="text-white mt-1">•</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preferred Qualifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Preferred Qualifications</h3>
                <ul className="space-y-2">
                  {selectedJob.qualifications?.preferred?.map((qual, i) => (
                    <li key={i} className="text-white/70 flex items-start gap-2">
                      <span className="text-white mt-1">•</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Tech Stack & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.techStack?.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full glass-border text-sm text-white/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Benefits & Perks</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedJob.benefits?.map((benefit, i) => (
                    <li key={i} className="text-white/70 flex items-start gap-2">
                      <span className="text-white mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Overview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">About {selectedJob.company}</h3>
                <p className="text-white/70 leading-relaxed">{selectedJob.companyOverview}</p>
              </div>

              {/* Interview Process */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Interview Process</h3>
                <p className="text-white/70 leading-relaxed">{selectedJob.interviewProcess}</p>
              </div>

              {/* Why This Role */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Why This Role Matters</h3>
                <p className="text-white/70 leading-relaxed">
                  This {selectedJob.experience} position at {selectedJob.company} is ideal for experienced professionals
                  looking to make an impact at scale. You'll work with cutting-edge technology, collaborate with
                  world-class teams, and contribute to products used by millions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
