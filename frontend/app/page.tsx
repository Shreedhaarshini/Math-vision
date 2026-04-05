"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function AuthPage() {
  const [view, setView] = useState<"login" | "signup">("login")

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">MathMind AI</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Learn math with AI and AR visualization
          </p>
        </div>

        {/* Auth forms */}
        {view === "login" ? (
          <LoginForm onSwitchToSignup={() => setView("signup")} />
        ) : (
          <SignupForm onSwitchToLogin={() => setView("login")} />
        )}
      </div>
    </main>
  )
}
