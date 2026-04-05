"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Zap, Trophy, Star } from "lucide-react"

interface StreakPointsProps {
  currentStreak?: number
  longestStreak?: number
  totalPoints?: number
  weeklyGoal?: number
  weeklyProgress?: number
}

export function StreakPoints({
  currentStreak = 7,
  longestStreak = 14,
  totalPoints = 2450,
  weeklyGoal = 500,
  weeklyProgress = 320,
}: StreakPointsProps) {
  const weeklyPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100)
  const isOnFire = currentStreak >= 5

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Streak Counter */}
          <div className="flex items-center gap-3">
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
              isOnFire 
                ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30" 
                : "bg-muted/50 border border-border"
            }`}>
              <Flame className={`w-6 h-6 ${isOnFire ? "text-orange-400" : "text-muted-foreground"}`} />
              {isOnFire && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-foreground" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{currentStreak}</span>
                <span className="text-sm text-muted-foreground">day streak</span>
              </div>
              <p className="text-xs text-muted-foreground">Best: {longestStreak} days</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-border/50" />

          {/* Points */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">{totalPoints.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">XP</span>
              </div>
              <p className="text-xs text-muted-foreground">Total points</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-border/50" />

          {/* Weekly Progress */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Weekly Goal</span>
              <span className="text-xs font-medium text-foreground">
                {weeklyProgress}/{weeklyGoal} XP
              </span>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                style={{ width: `${weeklyPercentage}%` }}
              />
            </div>
          </div>

          {/* Achievement Badge */}
          <Badge 
            variant="secondary" 
            className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1"
          >
            <Trophy className="w-3 h-3" />
            Level 5
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
