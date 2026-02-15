'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Moon,
  Compass,
  Zap,
  Radar,
  Glasses,
  MessageSquare,
  Users,
  Sparkles,
  User,
  LogIn,
  UserPlus,
  BookOpen,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tonight', label: "Tonight's Sky", icon: Moon },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/impact', label: 'Impact', icon: Zap },
  { href: '/radar', label: 'Radar', icon: Radar },
  { href: '/ar', label: 'AR Sky', icon: Glasses },
  { href: '/chat', label: 'Ask Astro', icon: MessageSquare },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/desi', label: 'Desi Space', icon: Sparkles },
  { href: '/solar-system', label: 'Learn', icon: BookOpen },
]

const authItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/login', label: 'Login', icon: LogIn },
  { href: '/signup', label: 'Sign Up', icon: UserPlus },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo/Brand */}
      <div className="border-b border-sidebar-border px-6 py-6">
        <Link href="/" className="group flex flex-col gap-1 transition-opacity hover:opacity-80">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sidebar-primary to-accent shadow-[0_0_10px_rgba(var(--sidebar-primary),0.3)] transition-transform group-hover:scale-110" />
            <div className="font-bold text-xl tracking-tight text-sidebar-foreground">Stargazer</div>
          </div>
          <p className="text-xs text-sidebar-foreground/60">Unlock the mysteries of the cosmos</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Auth Links */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <div className="space-y-1">
          {authItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="border-t border-sidebar-border px-4 py-3 text-xs text-sidebar-foreground/60">
        <p>© 2024 Stargazer</p>
        <p>Hackathon Project</p>
      </div>
    </div>
  )
}
