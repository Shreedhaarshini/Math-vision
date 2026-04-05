"use client"

import { StreakPoints } from "@/components/dashboard/streak-points"
import { AIInsightPanel } from "@/components/dashboard/ai-insight-panel"
import { ProblemSolver } from "@/components/dashboard/problem-solver"
import { ARConcepts } from "@/components/dashboard/ar-concepts"
import { TopicPerformance } from "@/components/dashboard/topic-performance"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { FeatureClarity } from "@/components/dashboard/feature-clarity"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Streak & Points */}
      <StreakPoints />

      {/* Feature Clarity Section - Top */}
      <FeatureClarity />

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Primary Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insight Panel */}
          <AIInsightPanel />

          {/* Smart Problem Solving */}
          <ProblemSolver />

          {/* AR Concepts Available */}
          <ARConcepts />
        </div>

        {/* Right Column - Performance & Activity */}
        <div className="space-y-6">
          {/* Topic Performance */}
          <TopicPerformance />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
