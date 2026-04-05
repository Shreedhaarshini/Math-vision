"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, Sparkles } from "lucide-react"

interface TopicPerformance {
  name: string
  score: number
  status: "weak" | "moderate" | "strong"
  arSupported: boolean
}

const topicPerformances: TopicPerformance[] = [
  { name: "Trigonometry", score: 35, status: "weak", arSupported: true },
  { name: "Algebra", score: 85, status: "strong", arSupported: false },
  { name: "3D Geometry", score: 62, status: "moderate", arSupported: true },
  { name: "Calculus", score: 78, status: "strong", arSupported: false },
  { name: "Arithmetic Progression", score: 45, status: "weak", arSupported: true },
  { name: "Statistics", score: 70, status: "moderate", arSupported: false },
]

export function TopicPerformance() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Topic Performance
        </CardTitle>
        <CardDescription>Your performance across different math topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topicPerformances.map((topic) => (
            <div key={topic.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{topic.name}</span>
                  {topic.status === "weak" && (
                    <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                  )}
                  {topic.status === "strong" && (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {topic.arSupported && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AR
                    </Badge>
                  )}
                  {!topic.arSupported && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      AI Only
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      topic.status === "weak"
                        ? "text-destructive border-destructive/30"
                        : topic.status === "strong"
                        ? "text-emerald-500 border-emerald-500/30"
                        : "text-amber-500 border-amber-500/30"
                    }`}
                  >
                    {topic.status === "weak" ? "Weak" : topic.status === "strong" ? "Strong" : "Moderate"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={topic.score}
                  className={`h-2 flex-1 ${
                    topic.status === "weak"
                      ? "[&>div]:bg-destructive"
                      : topic.status === "strong"
                      ? "[&>div]:bg-emerald-500"
                      : "[&>div]:bg-amber-500"
                  }`}
                />
                <span className="text-sm text-muted-foreground w-10 text-right">{topic.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
