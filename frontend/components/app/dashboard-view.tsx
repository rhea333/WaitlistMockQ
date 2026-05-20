"use client"

import type React from "react"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getInterviews, type InterviewData } from "@/lib/interview-data"
import { getFavoritedJobs, toggleFavoriteJob, normalizeJobTitleToRole, type Job } from "@/lib/job-data"

import { ProblemTracker } from "@/components/app/problem-tracker"

export function DashboardView() {
  const router = useRouter()
  const interviews = getInterviews().filter((interview) => interview.completedRounds > 0)
  const [favoritedJobs, setFavoritedJobs] = useState<Job[]>(getFavoritedJobs())


  useEffect(() => {
    setFavoritedJobs(getFavoritedJobs())

    const handleStorageChange = () => {
      setFavoritedJobs(getFavoritedJobs())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleFavoritedJobClick = (job: Job) => {
    const role = normalizeJobTitleToRole(job.title)
    const setup = {
      role: role,
      company: job.company,
      jobTitle: job.title
    }
    localStorage.setItem("mockq_current_interview", JSON.stringify(setup))
    // Clear any previous ID to ensure new creation
    localStorage.removeItem("mockq_current_interview_id")
    router.push("/interview-plan")
  }

  const handleUnfavorite = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavoriteJob(jobId)
    setFavoritedJobs(getFavoritedJobs())
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <section className="relative isolate overflow-hidden py-12">
      <div className="app-viewport-container flex">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
        {/* Problem Tracker */}
        <ProblemTracker interviews={interviews} />

        {favoritedJobs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-6">Favorited Jobs</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {favoritedJobs.map((job) => (
                <div
                  key={job.id}
                  className="liquid-glass rounded-xl p-6 hover:liquid-glass-enhanced transition-all cursor-pointer relative transform transition-transform duration-300 hover:scale-103"
                  onClick={() => handleFavoritedJobClick(job)}
                >
                  <button
                    onClick={(e) => handleUnfavorite(job.id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-all z-10 hover:cursor-pointer"
                    aria-label="Remove from favorites"
                  >
                    <X className="h-4 w-4 text-white/60 hover:text-white" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={job.logo || "/placeholder.svg"}
                        alt={`${job.company} logo`}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-sm text-white/70">{job.company}</p>
                      <p className="text-xs text-white/50 mt-1">{job.location}</p>
                      <p className="text-xs text-white mt-2 font-medium hover:text-white/80 transition-colors">Click to create interview plan</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  )
}
