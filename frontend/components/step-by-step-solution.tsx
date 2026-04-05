"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { Lightbulb, CheckCircle2, ChevronDown, ChevronRight, Calculator, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StepByStepSolutionProps {
  content: string
  className?: string
}

interface ParsedSections {
  overview: string
  given: string[]
  steps: string[]
  finalAnswer: string
}

// Math Renderer for LaTeX
function MathRenderer({ content }: { content: string }) {
  // Convert LaTeX delimiters from \[ ... \] to $$ ... $$ and \( ... \) to $ ... $
  const formattedText = content
    .replace(/\\\[/g, '$$$')
    .replace(/\\\]/g, '$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
  
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-left">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="m-0 mb-4 last:mb-0 leading-relaxed text-left">{children}</p>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-4 my-4 marker:font-bold marker:text-primary text-left">{children}</ol>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4 text-left">{children}</ul>,
          li: ({ children }) => <li className="leading-relaxed text-left">{children}</li>,
        }}
      >
        {formattedText}
      </ReactMarkdown>
    </div>
  )
}

// Parse the 4-section structure from AI response
function parseSolution(content: string): ParsedSections {
  const sections: ParsedSections = {
    overview: "",
    given: [],
    steps: [],
    finalAnswer: ""
  }

  // Extract sections using regex patterns
  const overviewMatch = content.match(/\*\*1\.\s*Concept Overview:?\*\*:?\s*([\s\S]*?)(?=\*\*2\.|\*\*Given|$)/i)
  const givenMatch = content.match(/\*\*2\.\s*Given Information:?\*\*:?\s*([\s\S]*?)(?=\*\*3\.|\*\*Step|$)/i)
  const stepsMatch = content.match(/\*\*3\.\s*Step-by-Step Solution:?\*\*:?\s*([\s\S]*?)(?=\*\*4\.|\*\*Final|$)/i)
  const finalMatch = content.match(/\*\*4\.\s*Final Answer:?\*\*:?\s*([\s\S]*?)$/i)

  if (overviewMatch) {
    sections.overview = overviewMatch[1].trim()
  }

  if (givenMatch) {
    const givenText = givenMatch[1].trim()
    sections.given = givenText
      .split(/\n|[-•]/)
      .map(item => item.trim())
      .filter(item => item.length > 0 && !item.match(/^\*+$/))
  }

  if (stepsMatch) {
    const stepsText = stepsMatch[1].trim()
    sections.steps = stepsText
      .split(/\n(?=\d+[.):]|[-•]\s)/)
      .map(step => step.trim())
      .filter(step => step.length > 0 && !step.match(/^\*+$/))
  }

  if (finalMatch) {
    sections.finalAnswer = finalMatch[1].trim()
  }

  return sections
}

// Individual Step Component with Hint Toggle
function SolutionStep({ step, index }: { step: string; index: number }) {
  const [showExplanation, setShowExplanation] = useState(true)
  const hasMath = step.includes("\\(") || step.includes("\\[") || step.includes("$$") || step.includes("$")

  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      {/* Step Number Circle */}
      <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center border border-primary/30">
        {index + 1}
      </div>
      
      {/* Vertical Connector Line */}
      <div className="absolute left-[11px] top-7 w-0.5 h-[calc(100%-28px)] bg-gradient-to-b from-primary/30 to-transparent" />
      
      {/* Step Content */}
      <div className="space-y-2">
        {hasMath && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? (
              <><ChevronDown className="w-3 h-3 mr-1" /> Hide explanation</>
            ) : (
              <><ChevronRight className="w-3 h-3 mr-1" /> Show explanation</>
            )}
          </Button>
        )}
        
        {showExplanation ? (
          <div className="text-sm text-foreground">
            <MathRenderer content={step} />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic p-2 bg-muted/30 rounded">
            Try to solve this step yourself! Click &quot;Show explanation&quot; to see the math.
          </div>
        )}
      </div>
    </div>
  )
}

export function StepByStepSolution({ content, className }: StepByStepSolutionProps) {
  const sections = parseSolution(content)

  return (
    <div className={cn("space-y-4", className)}>
      {/* 1. Concept Overview - Blue Callout */}
      {sections.overview && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                Concept Overview
              </h4>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <MathRenderer content={sections.overview} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Given Information - Badge Style */}
      {sections.given.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Hash className="w-3 h-3" />
            Given Information
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections.given.map((item, index) => (
              <Badge key={index} variant="secondary" className="font-normal text-xs">
                <MathRenderer content={item} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 3. Step-by-Step Solution - Stepper UI */}
      {sections.steps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Calculator className="w-3 h-3" />
            Step-by-Step Solution
          </h4>
          <div className="space-y-0">
            {sections.steps.map((step, index) => (
              <SolutionStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Final Answer - Highlighted Box */}
      {sections.finalAnswer && (
        <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-medium text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1">
                Final Answer
              </h4>
              <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                <MathRenderer content={sections.finalAnswer} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
