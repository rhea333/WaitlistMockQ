"use client"

import Image from "next/image"
import Link from "next/link"
import { Linkedin } from "lucide-react"
import { usePathname } from "next/dist/client/components/navigation"

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="container mx-auto px-6 py-8">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-6">
          {/* Left: Logo + Slogan */}
          <div className="flex flex-col gap-2">
            <Image
              src="/mockq-footer-logo-v3.png"
              alt="MockQ"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4 self-end">
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Discord"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t mb-6" style={{ borderTopColor: 'rgba(51,51,51,0.5)' }}></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            © {new Date().getFullYear()} MockQ. All rights reserved.
          </p>

          {/* Right: Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/#features" className="text-sm transition-colors" style={{ color: 'var(--muted-foreground)' }}>
              Features
            </Link>
            <Link href="/pricing" className="text-sm transition-colors" style={{ color: 'var(--muted-foreground)' }}>
              Pricing
            </Link>
            <Link href="/privacy" className="text-sm transition-colors" style={{ color: 'var(--muted-foreground)' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm transition-colors" style={{ color: 'var(--muted-foreground)' }}>
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname.startsWith("/interview")) return null
  return <SiteFooter />
}
