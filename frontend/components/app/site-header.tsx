"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Home, LayoutDashboard, BookOpen, HelpCircle, Plus, Settings, CreditCard, LogOut, UserCog } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const links = [
    { href: "/practice", label: "Practice", icon: LayoutDashboard },
    { href: "/stats", label: "Stats", icon: Home },
  ]

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="app-viewport-container">
        <div className="relative flex items-center justify-between px-6 liquid-glass-header rounded-full h-16">
          <Link href="/" className="flex items-center z-10">
            <Image
              src="/mockq-navbar-logo.png"
              alt="MockQ"
              width={80}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Nav - Absolutely Centered */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80 absolute left-1/2 -translate-x-[calc(50%+60px)] ml-2">
            {links.map((l) => {
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`transition-colors flex items-center gap-2 ${isActive ? "text-white-800 font-bold" : "hover:scale-110 hover:text-white transition-all duration-200"}`}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 z-10">
            {/* Profile Avatar Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-10 h-10 rounded-full overflow-hidden glass-border hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Image
                    src="/user-femi.png"
                    alt="User profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 liquid-glass border-gray-800 text-white">
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-gray-200"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings & Privacy</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/preferences")}
                  className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-gray-200"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Interview Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/billing")}
                  className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-gray-200"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={() => {
                    // Add logout logic here
                    router.push("/login")
                  }}
                  className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-red-400 focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 bg-gray-900/80 text-gray-200 hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-gray-800 p-0 w-64 flex flex-col">
                {/* Brand Header */}
                <div className="flex items-center px-4 py-4 border-b border-gray-800">
                  <Image
                    src="/mockq-logo-navbar.png"
                    alt="MockQ"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-gray-200">
                  {links.map((l) => {
                    const isActive = pathname === l.href
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-900 transition-colors ${isActive ? "bg-white/5 text-lime-400" : "hover:text-purple-300"}`}
                      >
                        <span className={`inline-flex items-center justify-center w-5 h-5 ${isActive ? "text-lime-400" : "text-gray-400"}`}>
                          <l.icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium">{l.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/*CTA Button at Bottom*/}
                <div className="mt-auto border-t border-gray-800 p-4">
                  <Button
                    onClick={() => router.push("/interview-setup")}
                    className="w-full bg-lime-400 text-black font-semibold rounded-lg px-6 py-2.5
                               hover:bg-lime-300 hover:shadow-md hover:scale-[1.02]
                               transition-all hover:cursor-pointer"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Start New Interview
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
