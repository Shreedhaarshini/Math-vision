import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, BookOpen, Settings, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your platform and users.</p>
          </div>
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">2,543</div>
              <p className="text-xs text-primary flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +12% this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">48</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lessons Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">324</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">78%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>Manage students and instructors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Students</p>
                  <p className="text-sm text-muted-foreground">2,458 registered users</p>
                </div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Instructors</p>
                  <p className="text-sm text-muted-foreground">85 active instructors</p>
                </div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Content Management
              </CardTitle>
              <CardDescription>Manage courses and lessons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Courses</p>
                  <p className="text-sm text-muted-foreground">48 active courses</p>
                </div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">AI Models</p>
                  <p className="text-sm text-muted-foreground">Configure learning AI</p>
                </div>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/">Sign out</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
