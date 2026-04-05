"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, GraduationCap, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface LoginFormProps {
  onSwitchToSignup: () => void
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter()
  const [role, setRole] = useState<"user" | "admin">("user")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user data in localStorage for the profile dropdown
      const userData = {
        name: "Shree",
        email: email,
        role: role === "admin" ? "Admin" : "Student",
      }
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("isAuthenticated", "true")

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch {
      // setError("Invalid email or password") // setError is not defined in the original code
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={role} onValueChange={(value) => setRole(value as "user" | "admin")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="w-4 h-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-0">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              <GraduationCap className="w-3 h-3 mr-1" />
              Student Access
            </Badge>
          </TabsContent>

          <TabsContent value="admin" className="mt-0">
            <Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-500 border-amber-500/20">
              <Shield className="w-3 h-3 mr-1" />
              Admin Access
            </Badge>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : `Sign in as ${role === "admin" ? "Admin" : "Student"}`}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/50 pt-6">
        <p className="text-sm text-muted-foreground">
          {"Don't have an account? "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}
