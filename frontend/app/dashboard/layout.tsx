'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calculator,
  BookOpen,
  Trophy,
  Settings,
  Menu,
  ChevronRight,
  Sparkles,
  User,
  LogOut,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserProfileDropdown } from '@/components/auth/user-profile-dropdown'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Problem Solver',
    href: '/dashboard/solver',
    icon: Calculator,
  },
  {
    title: 'Learn',
    href: '/dashboard/learn',
    icon: BookOpen,
  },
  {
    title: 'Achievements',
    href: '/dashboard/achievements',
    icon: Trophy,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

function SidebarNav({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col gap-1 p-3', className)}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'hover:bg-accent/50 hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive && [
                'bg-accent/80 text-accent-foreground',
                'border-l-2 border-l-primary',
                'shadow-sm',
              ],
              !isActive && 'border-l-2 border-l-transparent'
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                isActive && 'text-primary'
              )}
            />
            <span className="truncate">{item.title}</span>
            {isActive && (
              <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length > 1 && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {segments[segments.length - 1].replace(/-/g, ' ')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">MathMind AI</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-2">
          <SidebarNav />
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Student</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden px-4">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card p-0">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold">MathMind AI</span>
              </SheetTitle>
            </SheetHeader>
            <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <span className="text-lg font-semibold">MathMind AI</span>
        </div>

        <UserProfileDropdown />
      </header>

      {/* Desktop Header */}
      <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 md:flex md:ml-64">
        <div className="flex flex-1 items-center gap-4">
          <AppBreadcrumb />
        </div>
        <div className="flex items-center gap-4">
          <UserProfileDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)] bg-background p-4 md:ml-64 md:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
