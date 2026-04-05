"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GraduationCap, Sparkles, Eye, ArrowRight, User, Mail, Settings, LogOut, Bell, HelpCircle } from "lucide-react"
import Link from "next/link"

interface WelcomeSectionProps {
  userName?: string
  userEmail?: string
  userRole?: "student" | "admin"
}

const getInitials = (name: string): string => {
  if (!name) return "U"
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
}

export function WelcomeSection({ 
  userName = "User", 
  userEmail = "email@example.com",
  userRole = "student"
}: WelcomeSectionProps) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Welcome, {userName.split(" ")[0]} 👋</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <GraduationCap className="w-3 h-3 mr-1" />
              {userRole === "student" ? "Student" : "Admin"}
            </Badge>
          </div>
          <p className="text-muted-foreground">Continue your learning journey with AI-powered assistance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              {/* Profile Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/30">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{userName}</p>
                    <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                    <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-primary/20 text-xs">
                      {userRole === "student" ? "Student" : "Admin"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Personal Info */}
              <div className="p-2">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Sign Out */}
              <div className="p-2">
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" asChild>
                  <Link href="/">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign out</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

{/* Dynamic insight banner */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {"You're improving in Geometry concepts"}
              </p>
              <p className="text-sm text-muted-foreground">
                Try AR visualization to understand concepts better
              </p>
            </div>
          </div>
          <Button size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Try AR
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </header>
  )
}
