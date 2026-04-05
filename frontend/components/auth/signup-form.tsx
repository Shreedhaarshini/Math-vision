"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface SignupFormProps {
  onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: "Weak", color: "bg-destructive" }
    if (score === 3) return { score, label: "Fair", color: "bg-amber-500" }
    if (score === 4) return { score, label: "Good", color: "bg-primary" }
    return { score, label: "Strong", color: "bg-primary" }
  }, [password])

  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const passwordsMismatch = password && confirmPassword && password !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    
    setIsLoading(true)

    // Simulate signup delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push("/dashboard")
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Start your AI-powered math learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-input/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signupEmail">Email</Label>
            <Input
              id="signupEmail"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signupPassword">Password</Label>
            <div className="relative">
              <Input
                id="signupPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength indicator */}
            {password && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.score ? passwordStrength.color : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${
                  passwordStrength.score <= 2 ? "text-destructive" : 
                  passwordStrength.score === 3 ? "text-amber-500" : "text-primary"
                }`}>
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`bg-input/50 pr-10 ${
                  passwordsMismatch ? "border-destructive focus-visible:border-destructive" : ""
                } ${passwordsMatch ? "border-primary focus-visible:border-primary" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password match indicator */}
            {confirmPassword && (
              <p className={`text-xs flex items-center gap-1 ${
                passwordsMatch ? "text-primary" : "text-destructive"
              }`}>
                {passwordsMatch ? (
                  <>
                    <Check className="w-3 h-3" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3" />
                    Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || passwordsMismatch || !password || !confirmPassword}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/50 pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}
