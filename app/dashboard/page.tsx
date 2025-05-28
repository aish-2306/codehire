"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Code2,
  ArrowLeft,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  Eye,
  Download,
  Plus,
  BarChart3,
  Clock,
  Database,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface CodeAnalysis {
  id: string
  title: string
  language: string
  target_company: string
  overall_score: number
  time_complexity: string
  space_complexity: string
  created_at: string
  code: string
  analysis_result: any
}

interface UserProgress {
  total_analyses: number
  average_score: number
  best_score: number
  favorite_language: string
  target_companies: string[]
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<CodeAnalysis[]>([])
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return

    if (!user) {
      router.push("/")
      return
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Loading dashboard data for user:", user.id)

        // Fetch user analyses
        const analysesResponse = await fetch(`/api/user/analyses?userId=${user.id}&limit=50`)
        console.log("Analyses response status:", analysesResponse.status)

        if (analysesResponse.ok) {
          const analysesData = await analysesResponse.json()
          console.log("Analyses data:", analysesData)

          if (analysesData.success && analysesData.analyses) {
            setAnalyses(analysesData.analyses)

            // Calculate progress from analyses
            if (analysesData.analyses.length > 0) {
              const totalScore = analysesData.analyses.reduce(
                (sum: number, analysis: CodeAnalysis) => sum + analysis.overall_score,
                0,
              )
              const avgScore = totalScore / analysesData.analyses.length
              const bestScore = Math.max(...analysesData.analyses.map((a: CodeAnalysis) => a.overall_score))

              // Find most used language
              const languageCounts = analysesData.analyses.reduce(
                (acc: Record<string, number>, analysis: CodeAnalysis) => {
                  acc[analysis.language] = (acc[analysis.language] || 0) + 1
                  return acc
                },
                {} as Record<string, number>,
              )

              const favoriteLanguage =
                Object.entries(languageCounts).length > 0
                  ? Object.entries(languageCounts).reduce((a, b) =>
                      languageCounts[a[0]] > languageCounts[b[0]] ? a : b,
                    )?.[0] || "N/A"
                  : "N/A"

              // Get unique companies
              const companies = [...new Set(analysesData.analyses.map((a: CodeAnalysis) => a.target_company))]

              setProgress({
                total_analyses: analysesData.analyses.length,
                average_score: Math.round(avgScore * 100) / 100,
                best_score: bestScore,
                favorite_language: favoriteLanguage,
                target_companies: companies,
              })
            } else {
              // No analyses yet
              setProgress({
                total_analyses: 0,
                average_score: 0,
                best_score: 0,
                favorite_language: "N/A",
                target_companies: [],
              })
            }
          } else {
            console.log("No analyses found or API error")
            setAnalyses([])
            setProgress({
              total_analyses: 0,
              average_score: 0,
              best_score: 0,
              favorite_language: "N/A",
              target_companies: [],
            })
          }
        } else {
          console.error("Failed to fetch analyses:", analysesResponse.status)
          // Still set empty state instead of error
          setAnalyses([])
          setProgress({
            total_analyses: 0,
            average_score: 0,
            best_score: 0,
            favorite_language: "N/A",
            target_companies: [],
          })
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        // Set empty state instead of error to allow user to continue
        setAnalyses([])
        setProgress({
          total_analyses: 0,
          average_score: 0,
          best_score: 0,
          favorite_language: "N/A",
          target_companies: [],
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, router, authLoading])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 85) return "default"
    if (score >= 70) return "secondary"
    return "destructive"
  }

  const viewAnalysis = (analysisId: string) => {
    router.push(`/results?id=${analysisId}`)
  }

  const downloadAnalysis = (analysis: CodeAnalysis) => {
    const reportData = {
      title: analysis.title,
      language: analysis.language,
      targetCompany: analysis.target_company,
      score: analysis.overall_score,
      timeComplexity: analysis.time_complexity,
      spaceComplexity: analysis.space_complexity,
      timestamp: analysis.created_at,
      code: analysis.code,
      fullAnalysis: analysis.analysis_result,
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

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeHire Dashboard
              </h1>
            </div>
          </div>
          <Button onClick={() => router.push("/")}>
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user.user_metadata?.name || user.email?.split("@")[0] || "User"}!
          </h2>
          <p className="text-slate-600 dark:text-slate-300">Here's an overview of your code analysis journey</p>
        </div>

        {/* Progress Overview */}
        {progress && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress.total_analyses}</div>
                <p className="text-xs text-muted-foreground">Code submissions analyzed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(progress.average_score)}`}>
                  {progress.average_score > 0 ? `${progress.average_score}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Across all analyses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(progress.best_score)}`}>
                  {progress.best_score > 0 ? `${progress.best_score}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Personal best</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Language</CardTitle>
                <Code2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{progress.favorite_language}</div>
                <p className="text-xs text-muted-foreground">Most used language</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Analyses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Your Code Analyses</span>
            </CardTitle>
            <CardDescription>
              {analyses.length > 0
                ? `You have completed ${analyses.length} code analysis${analyses.length === 1 ? "" : "es"}`
                : "No analyses yet. Start by analyzing your first piece of code!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            )}

            {analyses.length === 0 && !error && (
              <div className="text-center py-12">
                <Code2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start your coding journey by analyzing your first piece of code
                </p>
                <Button onClick={() => router.push("/")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Analyze Code
                </Button>
              </div>
            )}

            {analyses.length > 0 && (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{analysis.title}</h3>
                        <Badge variant="outline" className="capitalize">
                          {analysis.language}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {analysis.target_company}
                        </Badge>
                        <Badge variant={getScoreBadgeVariant(analysis.overall_score)}>{analysis.overall_score}%</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(analysis.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Time: {analysis.time_complexity || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Database className="w-4 h-4" />
                          <span>Space: {analysis.space_complexity || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => viewAnalysis(analysis.id)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadAnalysis(analysis)}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Chart */}
        {progress && progress.total_analyses > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Your coding improvement journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{progress.average_score}%</span>
                  </div>
                  <Progress value={progress.average_score} className="h-2" />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-semibold mb-2">Target Companies</h4>
                    <div className="flex flex-wrap gap-2">
                      {progress.target_companies.length > 0 ? (
                        progress.target_companies.map((company) => (
                          <Badge key={company} variant="secondary" className="capitalize">
                            {company}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No companies analyzed yet</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Statistics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Best Score:</span>
                        <span className={getScoreColor(progress.best_score)}>
                          {progress.best_score > 0 ? `${progress.best_score}%` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Submissions:</span>
                        <span>{progress.total_analyses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Favorite Language:</span>
                        <span className="capitalize">{progress.favorite_language}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
