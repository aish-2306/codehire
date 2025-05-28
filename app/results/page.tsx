"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code2,
  ArrowLeft,
  Clock,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Lightbulb,
  Download,
  Share2,
} from "lucide-react"

interface AnalysisResult {
  overallScore: number
  timeComplexity: string
  spaceComplexity: string
  languagePerformance: "High" | "Medium" | "Low"
  dataStructures: "Optimal" | "Good" | "Suboptimal"
  redundantLogic: number
  codeModularity: "Excellent" | "Good" | "Fair" | "Poor"
  companyBenchmark: string
  suggestions: string[]
  strengths: string[]
  weaknesses: string[]
  explanation: string
  detailedFeedback: {
    algorithmEfficiency: string
    codeReadability: string
    bestPractices: string
    performanceOptimization: string
  }
}

interface CodeAnalysis {
  id: string
  title: string
  language: string
  target_company: string
  overall_score: number
  time_complexity: string
  space_complexity: string
  analysis_result: AnalysisResult
  created_at: string
  code: string
}

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    let isMounted = true

    const loadAnalysis = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to get analysis ID from URL params first
        const analysisId = searchParams.get("id")

        if (analysisId) {
          console.log("Loading analysis from API:", analysisId)
          try {
            const response = await fetch(`/api/analysis/${analysisId}`)
            const data = await response.json()

            if (data.success && isMounted) {
              setAnalysis(data.analysis)
              setLoading(false)
              return
            }
          } catch (error) {
            console.error("Failed to fetch analysis from API:", error)
          }
        }

        // Fallback to localStorage
        const storedAnalysis = localStorage.getItem("latestAnalysis")
        if (storedAnalysis && isMounted) {
          try {
            const parsedAnalysis = JSON.parse(storedAnalysis)
            setAnalysis(parsedAnalysis)
            console.log("✅ Analysis loaded from localStorage")
          } catch (error) {
            console.error("❌ Failed to parse stored analysis:", error)
            setError("Failed to load analysis data")
          }
        } else if (isMounted) {
          console.log("❌ No analysis found")
          setError("No analysis found")
        }
      } catch (error) {
        console.error("Error loading analysis:", error)
        if (isMounted) {
          setError("Failed to load analysis")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAnalysis()

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false
    }
  }, [searchParams]) // Only depend on searchParams

  const downloadAnalysis = () => {
    if (!analysis) return

    const reportData = {
      title: analysis.title,
      language: analysis.language,
      targetCompany: analysis.target_company,
      score: analysis.overall_score,
      timeComplexity: analysis.time_complexity,
      spaceComplexity: analysis.space_complexity,
      analysis: analysis.analysis_result,
      timestamp: analysis.created_at,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${analysis.title.replace(/\s+/g, "_")}_analysis.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareAnalysis = async () => {
    if (!analysis) return

    const shareData = {
      title: `CodeHire Analysis: ${analysis.title}`,
      text: `I scored ${analysis.overall_score}% on my code analysis for ${analysis.target_company}!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      alert("Analysis link copied to clipboard!")
    }
  }

  const handleGoBack = () => {
    router.push("/")
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "No analysis found"}</p>
            <Button onClick={handleGoBack}>Go Back to Editor</Button>
          </div>
        </div>
      </div>
    )
  }

  const results = analysis.analysis_result

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-100 dark:bg-green-900"
    if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900"
    return "bg-red-100 dark:bg-red-900"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeHire
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={shareAnalysis}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={downloadAnalysis}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overall Score */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Analysis Complete</CardTitle>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}%
            </div>
            <Badge variant="secondary" className={`text-lg px-4 py-2 ${getScoreBgColor(results.overallScore)}`}>
              {results.overallScore >= 85
                ? "Highly Efficient"
                : results.overallScore >= 70
                  ? "Moderately Efficient"
                  : "Needs Improvement"}
            </Badge>
            <CardDescription className="mt-4 text-lg">
              Your code has been analyzed against{" "}
              {analysis.target_company.charAt(0).toUpperCase() + analysis.target_company.slice(1)} standards
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="code">Code Review</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Technical Analysis */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Time Complexity</span>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {results.timeComplexity}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Space Complexity</span>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {results.spaceComplexity}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Language Performance</span>
                      <Badge variant={results.languagePerformance === "High" ? "default" : "secondary"}>
                        {results.languagePerformance}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Data Structure Usage</span>
                      <Badge variant={results.dataStructures === "Optimal" ? "default" : "secondary"}>
                        {results.dataStructures}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Company Benchmark</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">{results.companyBenchmark}</div>
                      <Progress value={results.overallScore} className="mb-4" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Based on {analysis.target_company.charAt(0).toUpperCase() + analysis.target_company.slice(1)}{" "}
                        interview standards
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {results.weaknesses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span>Areas for Improvement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <span>Suggestions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Algorithm Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">{results.detailedFeedback.algorithmEfficiency}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Code Readability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">{results.detailedFeedback.codeReadability}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">{results.detailedFeedback.bestPractices}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">
                    {results.detailedFeedback.performanceOptimization}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{results.explanation}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{results.redundantLogic}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Redundant Logic Issues</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{results.codeModularity}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Code Modularity</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      {analysis.language.charAt(0).toUpperCase() + analysis.language.slice(1)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Programming Language</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Code</CardTitle>
                <CardDescription>
                  {analysis.language.charAt(0).toUpperCase() + analysis.language.slice(1)} •{" "}
                  {analysis.code.split("\n").length} lines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{analysis.code}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button onClick={handleGoBack} variant="outline" size="lg">
            Analyze Another Code
          </Button>
          <Button onClick={handleGoToDashboard} size="lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}
