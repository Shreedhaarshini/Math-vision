"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { StepByStepSolution } from "@/components/step-by-step-solution"
import { 
  Upload, 
  MessageSquare, 
  Brain,
  Eye,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  XCircle, 
  Download,
  ImageIcon,
  Loader2,
  FileWarning,
  User,
  Bot
} from "lucide-react"

interface Solution {
  topic: string
  steps: string[]
  final_answer: string
}

interface UploadError {
  type: 'type' | 'size' | 'generic'
  message: string
}

// Chat Message Bubble Component
interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: React.ReactNode
  isLoading?: boolean
}

function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const isUser = role === 'user'
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted border border-border'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      {/* Message Bubble */}
      <div className={`relative max-w-[85%] rounded-2xl px-5 py-4 overflow-hidden ${
        isUser 
          ? 'bg-primary text-primary-foreground rounded-br-sm' 
          : 'bg-muted border border-border rounded-bl-sm'
      }`}>
        {isLoading ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        ) : (
          <div className="text-sm leading-relaxed min-w-[200px] max-w-full break-words whitespace-pre-wrap overflow-hidden">
            {content}
          </div>
        )}
      </div>
    </div>
  )
}

// Math Renderer Component for LaTeX support
function MathRenderer({ content }: { content: string }) {
  // Convert LaTeX delimiters from \[ ... \] to $$ ... $$ and \( ... \) to $ ... $
  const formattedText = content
    .replace(/\\\[/g, '$$$')
    .replace(/\\\]/g, '$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
  
  return (
    <div className="math-content prose prose-sm dark:prose-invert max-w-none text-left">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="m-0 mb-6 last:mb-0 leading-relaxed text-left">{children}</p>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-6 my-6 marker:font-bold marker:text-primary text-left">{children}</ol>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-3 my-6 text-left">{children}</ul>,
          li: ({ children }) => <li className="leading-relaxed mb-2 text-left">{children}</li>,
          h1: ({ children }) => <h1 className="text-lg font-semibold mb-6 mt-8 text-left">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold mb-4 mt-6 text-left">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold mb-3 mt-4 text-left">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-3 my-6 bg-slate-50 dark:bg-slate-900/30 rounded-r text-left">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm font-mono text-left">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 text-left">
              {children}
            </pre>
          ),
        }}
      >
        {formattedText}
      </ReactMarkdown>
      
      {/* Transparent math block styling */}
      <style jsx global>{`
        .math-content .katex-display {
          background: transparent !important;
          border: none !important;
          padding: 0.75rem 0;
          margin: 1rem 0;
          overflow-x: auto;
          text-align: left;
        }
        .math-content .katex {
          font-size: 1.15em;
          color: inherit !important;
        }
        .math-content .katex-display .katex {
          font-size: 1.25em;
        }
        /* Ensure KaTeX text inherits parent color */
        .math-content .katex * {
          color: inherit !important;
        }
        .math-content p:last-child {
          margin-bottom: 0;
        }
        /* Ensure all text is left-aligned */
        .math-content * {
          text-align: left !important;
        }
        /* Better list item spacing */
        .math-content li > p {
          margin-bottom: 0.5rem;
        }
        .math-content li:last-child > p {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}

// Parse message with exact extraction logic from user requirements
function parseMessage(message: string | any): string {
  let finalDisplayText = typeof message === 'string' ? message : JSON.stringify(message);

  try {
    // Force parse the JSON wrapper
    const parsedObject = JSON.parse(finalDisplayText);
    if (parsedObject && typeof parsedObject.answer === 'string') {
      finalDisplayText = parsedObject.answer; // Extract ONLY the math text
    }
  } catch (error) {
    // If it's normal text, leave it alone
  }

  // Convert raw LaTeX brackets to standard Math markdown delimiters
  finalDisplayText = finalDisplayText
    .replace(/\\\[/g, '$$$')
    .replace(/\\\]/g, '$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');
  
  return finalDisplayText;
}

// Clean Math Renderer that applies the exact parsing logic
function CleanMathRenderer({ content }: { content: string | any }) {
  const cleanText = parseMessage(content);
  
  return (
    <div className="math-content prose prose-sm dark:prose-invert max-w-none text-left">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="m-0 mb-6 last:mb-0 leading-relaxed text-left">{children}</p>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-6 my-6 marker:font-bold marker:text-primary text-left">{children}</ol>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-3 my-6 text-left">{children}</ul>,
          li: ({ children }) => <li className="leading-relaxed mb-2 text-left">{children}</li>,
          h1: ({ children }) => <h1 className="text-lg font-semibold mb-6 mt-8 text-left">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold mb-4 mt-6 text-left">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold mb-3 mt-4 text-left">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-3 my-6 bg-slate-50 dark:bg-slate-900/30 rounded-r text-left">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm font-mono text-left">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 text-left">
              {children}
            </pre>
          ),
        }}
      >
        {cleanText}
      </ReactMarkdown>
    </div>
  )
}

// Loading Skeleton for Chat
function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2 max-w-[80%]">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function ProblemSolver() {
  const [inputMethod, setInputMethod] = useState<"upload" | "text">("text")
  const [isSolved, setIsSolved] = useState(false)
  const [solution, setSolution] = useState<any>(null)
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [showARModal, setShowARModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [originalExtractedProblem, setOriginalExtractedProblem] = useState<string>("");
  const [uploadError, setUploadError] = useState<UploadError | null>(null);
  const [activePractice, setActivePractice] = useState<{
    question: string;
    solution: string | null;
    finalAnswer: string | null;
    loading: boolean;
    userGuess: string;
    isSubmitted: boolean;
    isCorrect: boolean;
    error: string | null;
  } | null>(null)
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/webp']

  const arSupportedTopics = [
    "Trigonometry",
    "3D Geometry",
    "Arithmetic Progression",
    "Factors"
  ]

  const isARAvailable = arSupportedTopics.includes(solution?.topic)

  // AR Images mapping by topic
  const arImages: Record<string, string> = {
    "trigonometry": "/image/ar4.jpeg",
    "3d geometry": "/image/ar1.jpeg",
    "arithmetic progression": "/image/ar5.jpeg",
    "factors": "/image/ar3.jpeg"
  };

  // Get current image based on topic
  const topic = solution?.topic?.toLowerCase().trim();
  const currentImage = arImages[topic || ""] || "/image/ar_image.jpeg";

  const APK_URL = "https://drive.google.com/uc?export=download&id=1XmPF7wQuyPaZZ0U1aJ0yn8ajEpbiZPhY"

  // Auto-scroll to bottom when solution updates
  useEffect(() => {
    if (scrollAreaRef.current && isSolved) {
      const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [solution, isSolved])

  const validateFile = (file: File): UploadError | null => {
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return {
        type: 'type',
        message: `Invalid file type. Please upload ${ALLOWED_TYPES.map(t => t.replace('image/', '').toUpperCase()).join(', ')} files only.`
      }
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        type: 'size',
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      }
    }
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError(null)
    
    if (!file) return

    const error = validateFile(file)
    if (error) {
      setUploadError(error)
      setSelectedImage(null)
      setImagePreview(null)
      return
    }

    setSelectedImage(file)
    
    // Create image preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleARClick = () => {
    setShowARModal(true);
  }

  const handleCloseModal = () => {
    setShowARModal(false);
  }

  const solveProblem = async () => {
    if (inputMethod === "upload" && !selectedImage) {
      setUploadError({ type: 'generic', message: "Please upload an image first." })
      return
    }

    try {
      setLoading(true);
      setUploadError(null);

      let res;
      if (inputMethod === "upload" && selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        res = await fetch("http://localhost:5000/api/solve-image", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("http://localhost:5000/api/solve-universal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        });
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json();
      
      // Store the original problem text for practice question generation
      const extractedProblem = data?.question || data?.problem || data?.prompt || data?.input || "";
      setOriginalExtractedProblem(extractedProblem);
      console.log("[Solve] Original problem extracted:", extractedProblem);
      
      setSolution(data);
      setIsSolved(true);
    } catch (err) {
      console.error("Solve failed:", err);
      setUploadError({ 
        type: 'generic', 
        message: "Failed to solve problem. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSolver = () => {
    setIsSolved(false)
    setSolution(null)
    setQuestion("")
    setOriginalExtractedProblem("")
    setActivePractice(null)
    setShowPractice(false)
    clearImage()
  }

  const [showPractice, setShowPractice] = useState(false)

  // Generate a similar practice question based on the solved problem
  const generatePracticeQuestion = async () => {
    console.log("[Practice] Starting practice question generation...");
    
    // Universal Context Grabber - ensure we have valid context to send
    // 1. Try to get the active problem (from text input or stored extracted problem)
    let contextToSend = inputMethod === "text" ? question : (originalExtractedProblem || solution?.question || solution?.problem || "");
    
    // 2. If still empty, try other solution fields
    if (!contextToSend || contextToSend.trim() === "") {
      contextToSend = solution?.full_response?.substring(0, 500) || "";
    }
    
    // 3. Stop it from making a blank API call
    if (!contextToSend || contextToSend.trim() === "") {
      console.error("CRITICAL: No math problem found to send to AI.");
      setActivePractice(prev => prev ? { 
        ...prev, 
        error: "No problem context found. Please solve a problem first.",
        loading: false 
      } : null);
      return; 
    }
    
    console.log("SUCCESS: Sending this context to AI:", contextToSend.substring(0, 200));
    
    if (!solution) {
      console.error("[Practice] No solution available to base practice question on");
      return;
    }
    
    setShowPractice(true);
    setActivePractice({
      question: "",
      solution: null,
      finalAnswer: null,
      loading: true,
      userGuess: "",
      isSubmitted: false,
      isCorrect: false,
      error: null
    });

    try {
      // Initialize variables at the top of the function
      let parsedQuestion = "";
      let parsedSolution = "";
      let parsedFinalAnswer = "";
      
      const originalProblem = contextToSend;
      const originalSolution = solution?.full_response || solution?.answer || solution?.solution || "";
      
      console.log("[Practice] Input method:", inputMethod);
      console.log("[Practice] Original problem:", originalProblem);
      console.log("[Practice] Solution object keys:", Object.keys(solution || {}));
      console.log("[Practice] Original solution:", originalSolution?.substring(0, 100) + "...");
      console.log("[Practice] Sending request to backend...");
      
      const prompt = `Based on this math problem and solution, generate ONE new practice problem that tests the exact same concept using different numbers or a different scenario.

Original Problem: ${originalProblem || "Solve the quadratic equation x^2 - 5x + 6 = 0"}

Original Solution: ${originalSolution || "Factor: (x-2)(x-3) = 0, so x = 2 or x = 3"}

Return ONLY a raw JSON object with EXACTLY three keys: "question" (the problem text), "solution" (step-by-step breakdown), and "finalAnswer" (just the final numerical/short string answer to check against).`;

      console.log("Sending to Practice API:", prompt.substring(0, 200) + "...");

      const res = await fetch("http://localhost:5000/api/solve-universal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          messages: [
            { role: 'system', content: "Return ONLY a raw JSON object with EXACTLY three keys: question (the problem text), solution (step-by-step breakdown), and finalAnswer (just the final numerical/short string answer). No markdown blocks, no extra text. CRITICAL: You MUST return a raw JSON object with exactly two keys: 'question' (the new math problem) and 'answer' (the solution). DO NOT return empty strings. DO NOT use markdown." },
            { role: 'user', content: prompt }
          ]
        }),
      });

      console.log("[Practice] Response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("EXACT AI RESPONSE:", data);
      
      // Hard-fix: Directly map AI response to state
      let rawSolution = data.solution || data.practice_answer || data.steps || "No solution provided by AI";
      let safeSolutionString = "";

      // 1. If it's already a string, keep it.
      if (typeof rawSolution === 'string') {
        safeSolutionString = rawSolution;
      } 
      // 2. If the AI sent an array of steps, join them with line breaks.
      else if (Array.isArray(rawSolution)) {
        safeSolutionString = rawSolution.join('\n\n');
      } 
      // 3. If it's a nested object, extract the values into text so it doesn't crash.
      else if (typeof rawSolution === 'object') {
        safeSolutionString = Object.values(rawSolution)
          .map(val => (typeof val === 'string' ? val : JSON.stringify(val)))
          .join('\n\n');
      } 
      // 4. Ultimate fallback
      else {
        safeSolutionString = String(rawSolution);
      }
      
      const solutionToDisplay = safeSolutionString;
      const questionToDisplay = data?.practice_question || data?.question || data?.practice_problem || data?.problem || data?.text || "Error: AI returned empty data.";
      const finalAnswerToDisplay = String(data.finalAnswer || data.practice_answer || data.answer || "");
      
      console.log("SYNC CHECK: Solution saved as:", solutionToDisplay.substring(0, 100) + "...");
      
      setActivePractice(prev => prev ? {
        ...prev,
        question: questionToDisplay,
        solution: solutionToDisplay,
        finalAnswer: finalAnswerToDisplay,
        loading: false,
        error: null
      } : null);
      
      console.log("[Practice] Practice data saved to state successfully");
    } catch (err) {
      console.error("[Practice] Failed to generate practice question:", err);
      setActivePractice(prev => prev ? {
        ...prev,
        question: "",
        loading: false,
        error: err instanceof Error ? err.message : "Failed to generate practice question. Please try again."
      } : null);
    }
  };

  // Check the user's answer against the final answer
  const checkPracticeAnswer = () => {
    if (!activePractice?.finalAnswer) return;
    
    const userGuess = activePractice.userGuess.toLowerCase().trim();
    const correctAnswer = activePractice.finalAnswer.toLowerCase().trim();
    
    // Loose comparison - check if user's answer is included in or includes the correct answer
    const isCorrect = userGuess === correctAnswer || 
                      userGuess.includes(correctAnswer) || 
                      correctAnswer.includes(userGuess);
    
    setActivePractice(prev => prev ? {
      ...prev,
      isSubmitted: true,
      isCorrect: isCorrect
    } : null);
    
    console.log("[Practice] Answer checked:", { userGuess, correctAnswer, isCorrect });
  };

  const closePractice = () => {
    setShowPractice(false);
    setActivePractice(null);
  };

  // Extract clean text from markdown code blocks and JSON
  const extractCleanText = (rawText: string | any, targetKey: string): string => {
    if (!rawText) return "";
    // 1. Strip markdown code block formatting if it exists
    let cleanString = typeof rawText === 'string' ? rawText : JSON.stringify(rawText);
    cleanString = cleanString.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // 2. Try to parse as JSON and extract the specific key ('question' or 'answer')
    try {
      const parsed = JSON.parse(cleanString);
      if (parsed[targetKey]) {
        cleanString = parsed[targetKey];
      }
    } catch (e) {
      // Not JSON or failed to parse, use the cleaned string as fallback
    }

    // 3. Fix LaTeX brackets for ReactMarkdown
    return cleanString
      .replace(/\\\[/g, '$$$')
      .replace(/\\\]/g, '$$$')
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Smart Problem Solving
          <Badge className="bg-primary text-primary-foreground text-xs">AI Powered</Badge>
        </CardTitle>
        <CardDescription>Upload an image or enter your math problem to get step-by-step solutions</CardDescription>
      </CardHeader>
      <CardContent>
        {!isSolved ? (
          <div className="space-y-4">
            <Tabs value={inputMethod} onValueChange={(v) => {
              setInputMethod(v as "upload" | "text")
              clearImage()
              setUploadError(null)
            }}>
              <TabsList className="w-full">
                <TabsTrigger value="upload" className="flex-1 gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </TabsTrigger>
                <TabsTrigger value="text" className="flex-1 gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Enter Problem
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4 space-y-4">
                {uploadError && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <FileWarning className="h-4 w-4" />
                    <AlertDescription>{uploadError.message}</AlertDescription>
                  </Alert>
                )}
                
                {!imagePreview ? (
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ALLOWED_TYPES.join(',')}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop an image here, or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PNG, JPG, HEIC (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full max-h-64 object-contain bg-muted"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedImage?.name} ({(selectedImage!.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="text" className="mt-4">
                <textarea
                  className="w-full h-32 p-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your math problem here... e.g., Find the value of x if sin(x) = 0.5&#10;&#10;You can use LaTeX: $\\frac{1}{2}$ or $$x^2 + 2x + 1$$"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Use $...$ for inline math and $$...$$ for display math
                </p>
              </TabsContent>
            </Tabs>
            
            <Button 
              onClick={solveProblem} 
              disabled={loading || (inputMethod === "text" ? !question.trim() : !selectedImage)} 
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Solving...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Solve with AI
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-medium text-foreground">Problem Solved</span>
              </div>
              <Badge variant="outline">{solution?.topic}</Badge>
            </div>

            <ScrollArea className="h-[450px] rounded-lg border border-border/50 bg-background p-4" ref={scrollAreaRef}>
              <div className="space-y-2">
                {/* User Message - The Question */}
                <ChatMessage 
                  role="user" 
                  content={inputMethod === "upload" ? (
                    <div className="space-y-2">
                      <p>Uploaded image for solving</p>
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="Problem" 
                          className="max-w-[200px] max-h-32 rounded-lg object-contain"
                        />
                      )}
                    </div>
                  ) : (
                    <MathRenderer content={question} />
                  )} 
                />
                
                {/* AI Message - The Solution */}
                {loading ? (
                  <ChatMessage role="assistant" isLoading={true} content={null} />
                ) : (
                  <ChatMessage 
                    role="assistant" 
                    content={(() => {
                      // Get raw solution content
                      let displayContent = solution?.full_response || solution?.answer || "";
                      
                      // 1. Remove the conversational filler about JSON
                      displayContent = displayContent.replace(/Here's the JSON object with the solution:?/ig, '');
                      // 2. Strip out the entire markdown JSON code block
                      displayContent = displayContent.replace(/```json[\s\S]*?```/gi, '');
                      // 3. Trim extra whitespace
                      displayContent = displayContent.trim();
                      
                      return <CleanMathRenderer content={displayContent} />;
                    })()} 
                  />
                )}
              </div>
            </ScrollArea>

            <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              {/* Practice Mode Button */}
              <Button
                variant="secondary"
                onClick={generatePracticeQuestion}
                disabled={activePractice?.loading}
                className="w-full"
              >
                {activePractice?.loading && !activePractice?.question ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Practice Similar Question
                  </>
                )}
              </Button>

              {/* Practice Question Card */}
              {activePractice && (
                <Card className="mt-4 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-blue-800 dark:text-blue-400">
                        Practice Question
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closePractice}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Generated Question - Failsafe rendering */}
                    <div className="p-5 bg-muted/50 border-l-4 border-primary rounded-r-lg my-6">
                      <div className="text-lg md:text-xl font-medium leading-relaxed text-foreground">
                        {activePractice?.loading ? (
                          <span className="text-orange-500 italic">Generating practice question...</span>
                        ) : (
                          <div className="text-white text-lg font-medium">{activePractice?.question || "CRITICAL FAILURE: AI still returning empty data."}</div>
                        )}
                      </div>
                    </div>

                    {/* Error Display */}
                    {activePractice.error && (
                      <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{activePractice.error}</AlertDescription>
                      </Alert>
                    )}

                    {/* User Guess Input - Only show if not submitted yet */}
                    {!activePractice.isSubmitted && (
                      <div className="space-y-3">
                        <Input
                          type="text"
                          value={activePractice.userGuess}
                          onChange={(e) => setActivePractice(prev => prev ? { ...prev, userGuess: e.target.value } : null)}
                          placeholder="Type your final answer..."
                          className="w-full"
                        />

                        <Button
                          onClick={checkPracticeAnswer}
                          disabled={!activePractice.userGuess.trim() || activePractice.loading}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Check Answer
                        </Button>
                      </div>
                    )}

                    {/* Manual Reveal Button - DEBUG ONLY */}
                    {!activePractice.isSubmitted && activePractice.solution && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("[DEBUG] Manual reveal clicked");
                          console.log("[DEBUG] Current activePractice:", activePractice);
                          setActivePractice(prev => prev ? { ...prev, isSubmitted: true } : null);
                        }}
                        className="w-full border-dashed border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        🐛 DEBUG: Reveal Solution
                      </Button>
                    )}

                    {/* Result Badge - Show after submission */}
                    {activePractice.isSubmitted && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          {activePractice.isCorrect ? (
                            <Badge className="bg-emerald-500 text-white px-4 py-2 text-lg">
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              Correct!
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="px-4 py-2 text-lg">
                              <XCircle className="h-5 w-5 mr-2" />
                              Incorrect!
                            </Badge>
                          )}
                        </div>
                        
                        {/* Solution Display - Show after submission */}
                        {activePractice.isSubmitted && (
                          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border min-h-[100px]">
                            <h4 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              Step-by-Step Solution
                            </h4>
                            <div className="mt-2 text-sm text-foreground">
                              {activePractice?.solution ? (
                                <CleanMathRenderer content={activePractice.solution} />
                              ) : (
                                <span className="text-orange-500 italic">Processing AI breakdown...</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex gap-3">
              {isARAvailable ? (
                <div className="flex-1 space-y-4">
                  {/* AR Concept Preview */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-2">AR Concept Preview</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      This concept can be explored using Augmented Reality.
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside mb-3 space-y-1">
                      <li>Download the AR app</li>
                      <li>Use the image provided</li>
                      <li>Scan it inside the app to visualize the concept</li>
                    </ul>
                    {/* AR Image Preview with fallback */}
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt="AR Target"
                        className="w-[200px] mx-auto rounded-lg border border-primary/20"
                        onError={() => console.error("[AR] Failed to load image:", currentImage)}
                      />
                    ) : (
                      <div className="w-[200px] mx-auto rounded-lg border-2 border-red-500 bg-red-50 p-4 text-center">
                        <p className="text-red-500 font-semibold">No AR image available</p>
                        <p className="text-xs text-red-400 mt-1">Topic: {solution?.topic || "N/A"}</p>
                      </div>
                    )}
                  </div>

                  {/* AR Button */}
                  <Button
                    size="sm"
                    className="gap-1.5 shrink-0 w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("[AR] Button clicked, opening modal");
                      setShowARModal(true);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Explore in AR
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    If the app is not installed, it will be downloaded.
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">AR not available</span>
                </div>
              )}
              <Button variant="outline" onClick={resetSolver}>
                New Problem
              </Button>
            </div>

            {/* AR Modal - FORCED TOP VISIBILITY */}
            {showARModal && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999] p-4">
                {/* Debug: Show state */}
                {console.log("AR Modal State:", showARModal, "Topic:", solution?.topic)}
                
                {/* Fallback error if no AR data */}
                {!currentImage && (
                  <div className="fixed z-[99999] text-red-500 bg-white p-4 rounded-lg shadow-lg border-2 border-red-500">
                    Error: 3D Model data missing for this problem. Topic: {solution?.topic || "unknown"}
                  </div>
                )}
                
                <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-2xl relative z-[99999]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Explore this concept in AR
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseModal}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Instructions */}
                    <div className="space-y-2">
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li>Step 1: Download the AR images</li>
                        <li>Step 2: Install the AR app</li>
                        <li>Step 3: Open the app and scan any of the images</li>
                      </ul>
                    </div>

                    {/* Download All Images Button */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const images = [
                          "/image/ar1.jpeg",
                          "/image/ar2.jpeg",
                          "/image/ar3.jpeg",
                          "/image/ar4.jpeg",
                          "/image/ar5.jpeg"
                        ];

                        images.forEach((img, index) => {
                          const link = document.createElement("a");
                          link.href = img;
                          link.download = `ar_image_${index + 1}.jpeg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        });
                      }}
                      className="w-full gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download AR Images
                    </Button>

                    {/* Download AR App */}
                    <Button
                      onClick={() => {
                        window.open(
                          "https://drive.google.com/uc?export=download&id=1XmPF7wQuyPaZZ0U1aJ0yn8ajEpbiZPhY",
                          "_blank"
                        );
                      }}
                      className="w-full gap-2 bg-primary hover:bg-primary/90"
                    >
                      <Eye className="w-4 h-4" />
                      Download AR App
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setShowARModal(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
