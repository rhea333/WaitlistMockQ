import DotPattern from "@/components/app/DotPattern";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X as XIcon } from "lucide-react";
import { CompanyTicker } from "@/components/app/company-ticker";
import { WorkflowSection } from "@/components/app/workflow-section";
import { ScrollAnimation } from "@/components/app/scroll-animation";
import { LandingInterviewSection } from "@/components/app/landing-interview-section";
import { getAppConfig } from "@/lib/utils";
import { headers } from "next/headers";

export default async function LandingPage() {
  const hdrs = await headers()
  const appConfig = await getAppConfig(hdrs)
  return (
    <main className="min-h-screen flex flex-col relative bg-black text-white selection:bg-purple-500/30 overflow-hidden">
      {/* Background Pattern */}
      <DotPattern className="absolute inset-0 opacity-30 pointer-events-none" />

      {/* Top Bar Navigation Elements */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between p-6 md:p-8 z-[100] pointer-events-auto">
        {/* Logo to the far top left */}
        <Link href="/" className="flex items-center">
          <Image
            src="/mockq-navbar-logo.png"
            alt="MockQ"
            width={120}
            height={48}
            className="object-contain"
          />
        </Link>

        {/* Buttons to the far top right */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium liquid-glass text-white hover:bg-white/10 rounded-full h-10 px-6 transition-all"
          >
            <Link href="/login?mode=login">
              Sign In
            </Link>
          </Button>
          <Button
            asChild
            className="text-sm font-medium bg-white/90 backdrop-blur-md text-black hover:bg-white border border-white/20 rounded-full transition-all h-10 px-6 shadow-sm"
          >
            <Link href="/login?mode=signup">
              Sign Up
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-50 px-4 pt-32 pb-8 pointer-events-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-4 tracking-tight">
          <span className="text-7xl md:text-8xl
    font-extrabold
    tracking-tight
    text-white
    bg-clip-text
    text-transparent
  ">Ace Your Next</span>
          <br />
          <span className="text-white">SWE Interview</span>
        </h1>

        <p className="text-gray-400 text-center max-w-4xl mb-12 text-lg md:text-xl">
          Practice with real-time AI interviewers that follow your code and reasoning.
        </p>

        {/* Static preview + modal trigger */}
        <LandingInterviewSection appConfig={appConfig} />
      </div>

      {/* Social Proof / Companies Section */}
      <CompanyTicker />

      {/* The Workflow Section */}
      <WorkflowSection />



      {/* Comparison Table */}
      <ScrollAnimation direction="right" className="w-full max-w-4xl mx-auto px-6 py-24 relative z-10 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 max-w-2xl leading-tight">
          Bridging the gap between knowing the answer and delivering it under pressure.
        </h2>

        <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="py-5 px-6 font-medium text-gray-400">Feature</th>
                <th className="py-5 px-6 font-medium text-gray-400 text-center">Final Round AI</th>
                <th className="py-5 px-6 font-medium text-gray-400 text-center">interviewing.io</th>
                <th className="py-5 px-6 font-bold text-white text-center">MockQ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-gray-300">Real-time AI Voice Interviewer</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><XIcon className="w-5 h-5 text-red-500 mx-auto opacity-70" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-gray-300">Sub-2000ms Conversational Latency</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><XIcon className="w-5 h-5 text-red-500 mx-auto opacity-70" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <td className="py-4 px-6 text-gray-300">Edge Case &amp; Assumption Verification</td>
                <td className="py-4 px-6 text-center text-yellow-500 font-bold opacity-70">—</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-gray-300">Live Code Execution &amp; Testing</td>
                <td className="py-4 px-6 text-center"><XIcon className="w-5 h-5 text-red-500 mx-auto opacity-70" /></td>
                <td className="py-4 px-6 text-center text-yellow-500 font-bold opacity-70">—</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-300">Multi-Language Support</td>
                <td className="py-4 px-6 text-center text-yellow-500 font-bold opacity-70">—</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-300">FAANG Interview Questions</td>
                <td className="py-4 px-6 text-center text-yellow-500 font-bold opacity-70">—</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-300">Structured Rubric Scoring</td>
                <td className="py-4 px-6 text-center text-yellow-500 font-bold opacity-70">—</td>
                <td className="py-4 px-6 text-center text-yellow-500 font-bold opacity-70">—</td>
                <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Yes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 font-bold opacity-70">—</span>
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <XIcon className="w-4 h-4 text-red-500 opacity-70" />
            <span>No</span>
          </div>
        </div>
      </ScrollAnimation>

      {/* Bottom CTA */}
      <ScrollAnimation direction="down" className="w-full py-32 relative z-10 flex flex-col items-center text-center px-4 mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 max-w-2xl">
          Stop grinding blindly. Start practicing with real-time feedback.
        </h2>
        <Button
          asChild
          className="text-base font-medium bg-white text-black hover:bg-gray-200 rounded-full transition-all h-12 px-8 shadow-sm"
        >
          <Link href="/login">
            Get started
          </Link>
        </Button>
      </ScrollAnimation>

    </main >
  );
}
