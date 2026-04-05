"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Brain, Eye, BookOpen, CheckCircle2 } from "lucide-react"

interface Activity {
  type: "ai-solved" | "ar-viewed" | "practice-completed"
  title: string
  topic: string
  time: string
}

const activities: Activity[] = [
  {
    type: "ai-solved",
    title: "Solved quadratic equation",
    topic: "Algebra",
    time: "2 minutes ago",
  },
  {
    type: "ar-viewed",
    title: "Visualized 3D pyramid",
    topic: "3D Geometry",
    time: "15 minutes ago",
  },
  {
    type: "practice-completed",
    title: "Completed trigonometry quiz",
    topic: "Trigonometry",
    time: "1 hour ago",
  },
  {
    type: "ai-solved",
    title: "Solved derivative problem",
    topic: "Calculus",
    time: "2 hours ago",
  },
  {
    type: "ar-viewed",
    title: "Explored sine wave visualization",
    topic: "Trigonometry",
    time: "3 hours ago",
  },
]

const activityConfig = {
  "ai-solved": {
    icon: Brain,
    color: "text-primary",
    bg: "bg-primary/20",
    badge: "AI Solved",
  },
  "ar-viewed": {
    icon: Eye,
    color: "text-emerald-500",
    bg: "bg-emerald-500/20",
    badge: "AR Viewed",
  },
  "practice-completed": {
    icon: CheckCircle2,
    color: "text-amber-500",
    bg: "bg-amber-500/20",
    badge: "Practice",
  },
}

export function RecentActivity() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your learning activity from today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type]
            const Icon = config.icon
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {activity.topic}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {config.badge}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
