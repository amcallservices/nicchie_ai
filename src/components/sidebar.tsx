"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  Layers,
  Key,
  Users,
  TrendingUp,
  BookOpen,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Niche Research', href: '/research', icon: Search },
  { name: 'Micro-Niches', href: '/micro-niches', icon: Layers },
  { name: 'Keywords', href: '/keywords', icon: Key },
  { name: 'Competitors', href: '/competitors', icon: Users },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
  { name: 'Book Generator', href: '/book-generator', icon: BookOpen },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 lg:hidden p-2 rounded-lg bg-zinc-800 border border-zinc-700"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-zinc-100" />
        ) : (
          <Menu className="h-5 w-5 text-zinc-100" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          !isMobileOpen && '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-100">KDP</span>
              <span className="text-xs text-zinc-500">Niche Hunter</span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-1 rounded hover:bg-zinc-800"
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 text-zinc-400 transition-transform',
                !isOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-violet-600/20 text-violet-400 border-l-2 border-violet-500'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 py-4 px-3">
          <ul className="space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-violet-600/20 text-violet-400 border-l-2 border-violet-500'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* User Profile */}
          <div className="mt-4 flex items-center gap-3 px-3 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">John Doe</p>
              <p className="text-xs text-zinc-500 truncate">john@example.com</p>
            </div>
            <button className="p-1.5 rounded hover:bg-zinc-800">
              <LogOut className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}