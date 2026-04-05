"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, TrendingDown, Sparkles, Eye, Lightbulb, AlertCircle } from "lucide-react"

interface PerformanceData {
  weakTopics: string[]
  strongTopics: string[]
  allTopics: { topic: string; accuracy: number }[]
}

const arSupportedTopics = ["Trigonometry", "3D Geometry", "Arithmetic Progression", "Factors"]

export function AIInsightPanel() {
  const [performance, setPerformance] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/performance")

        if (!res.ok) {
          throw new Error("Backend not reachable");
        }

        const data = await res.json()
        setPerformance(data)

      } catch (err) {
        console.error("Performance fetch failed:", err);
        setPerformance(null);
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  // Check if there's any performance data
  const hasData = performance && (
    performance.weakTopics.length > 0 ||
    performance.strongTopics.length > 0 ||
    performance.allTopics.length > 0
  )

  // Get AR-supported weak topics
  const arWeakTopics = performance?.weakTopics.filter(topic =>
    arSupportedTopics.includes(topic)
  ) || []

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading insights...</p>
        </CardContent>
      </Card>
    )
  }

  if (!hasData) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-primary" />
            AI Insights
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
              Personalized
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!performance ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Insights unavailable (backend not connected)</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <Lightbulb className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Solve some problems to see insights</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary" />
          AI Insights
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Weak Topics */}
        {performance?.weakTopics.map((topic) => (
          <div
            key={`weak-${topic}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-destructive/20">
              <TrendingDown className="w-4 h-4 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">You are weak in {topic}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {topic}
              </Badge>
            </div>
          </div>
        ))}

        {/* Strong Topics */}
        {performance?.strongTopics.map((topic) => (
          <div
            key={`strong-${topic}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">You performed well in {topic}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {topic}
              </Badge>
            </div>
          </div>
        ))}

        {/* AR Suggestions for Weak Topics */}
        {arWeakTopics.length > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/20">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">AR visualization available for this topic</p>
              <div className="flex items-center gap-2 mt-1">
                {arWeakTopics.map(topic => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AR Supported
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
