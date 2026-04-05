"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Eye, Sparkles, CheckCircle2 } from "lucide-react"

export function FeatureClarity() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Understanding Your Tools
        </CardTitle>
        <CardDescription>Know when to use AI solving vs AR visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {/* AI Solving Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Solve with AI</p>
                <Badge className="bg-primary text-primary-foreground text-xs mt-1">Universal</Badge>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Works for ALL math problems
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Step-by-step solutions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Instant explanations
              </li>
            </ul>
          </div>

          {/* AR Visualization Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Explore in AR</p>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-xs mt-1">
                  Selected Concepts
                </Badge>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                3D Geometry, Trigonometry
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                AP, Factors, Complex Shapes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Interactive 3D models
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
