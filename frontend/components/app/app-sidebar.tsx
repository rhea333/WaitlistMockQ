'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';

const primaryLinks = [
  { href: '/practice', label: 'Practice', icon: LayoutDashboard },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
];

const settingsLinks = [
  { href: '/settings', label: 'Public profile', icon: User },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

const pageNames: Record<string, string> = {
  '/practice': 'Practice',
  '/stats': 'Stats',
  '/settings': 'Public Profile',
  '/notifications': 'Notifications',
  '/billing': 'Billing',
  '/jobs': 'Jobs',
  '/interview-setup': 'Interview Setup',
  '/interview-plan': 'Interview Plan',
  '/company-interviews': 'Company Interviews',
  '/analytics': 'Analytics',
  '/scorecard': 'Scorecard',
};

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="bg-background min-h-screen text-white">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg backdrop-blur md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className={`fixed top-1/2 z-[60] hidden h-16 w-8 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-white/15 bg-black/75 text-white/75 shadow-lg backdrop-blur transition-[left,color,border-color] duration-200 hover:border-white/35 hover:text-white md:inline-flex ${
          collapsed ? 'left-0' : 'left-72'
        }`}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl transition-transform duration-200 ${
          collapsed ? 'md:-translate-x-full' : 'md:translate-x-0'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <Link href="/practice" className="flex min-w-0 items-center gap-3">
            <Image
              src="/mockq-navbar-logo.png"
              alt="MockQ"
              width={84}
              height={42}
              className="object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-white/30 hover:text-white md:inline-flex"
            aria-label="Collapse sidebar"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/70 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <SidebarGroup title="MockQ">
            {primaryLinks.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} />
            ))}
          </SidebarGroup>

          <SidebarGroup title="Profile">
            {settingsLinks.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} />
            ))}
          </SidebarGroup>
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-red-300 transition-colors hover:bg-white/8"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div
        className={`min-h-screen transition-[padding] duration-200 ${collapsed ? 'md:pl-0' : 'md:pl-72'}`}
      >
        <header className="border-b border-white/10 bg-black/35 px-6 pt-20 pb-5 text-white backdrop-blur md:px-10">
          <h1 className="text-3xl font-thin tracking-normal">{getPageName(pathname)}</h1>
        </header>
        {children}
      </div>
    </div>
  );
}

function getPageName(pathname: string) {
  const exact = pageNames[pathname];
  if (exact) return exact;

  const matchingPath = Object.keys(pageNames)
    .filter((path) => pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];

  if (matchingPath) return pageNames[matchingPath];

  return (
    pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? 'MockQ'
  );
}

function SidebarGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2 px-3 text-xs font-semibold tracking-wide text-white/40 uppercase">
        {title}
      </p>
      <nav className="space-y-1">{children}</nav>
    </div>
  );
}

function SidebarLink({
  item,
  pathname,
}: {
  item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
  pathname: string;
}) {
  const Icon = item.icon;
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
        active ? 'bg-white text-black' : 'text-white/72 hover:bg-white/8 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}
