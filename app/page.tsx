"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code2, Zap, Target, Users, Moon, Sun, User, LogOut, History, Upload } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { AuthModal } from "@/components/auth-modal"

const companies = [
  { value: "google", label: "Google", color: "bg-blue-500" },
  { value: "amazon", label: "Amazon", color: "bg-orange-500" },
  { value: "microsoft", label: "Microsoft", color: "bg-green-500" },
  { value: "meta", label: "Meta", color: "bg-blue-600" },
  { value: "apple", label: "Apple", color: "bg-gray-600" },
  { value: "netflix", label: "Netflix", color: "bg-red-500" },
  { value: "infosys", label: "Infosys", color: "bg-purple-500" },
  { value: "tcs", label: "TCS", color: "bg-indigo-500" },
]

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
]

const exampleCode = `def two_sum(nums, target):
    """
    Find two numbers in array that add up to target
    Time: O(n), Space: O(n)
    """
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    
    return []

# Example usage
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(f"Indices: {result}")  # Output: [0, 1]`

export default function HomePage() {
  const [code, setCode] = useState("")
  const [title, setTitle] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>("Testing...")
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("🔍 Testing API connection...")
        const response = await fetch("/api/analyze", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        console.log("Response status:", response.status)
        console.log("Response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API test failed with status:", response.status, errorText)
          setApiStatus(`❌ API Error ${response.status}`)
          return
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text()
          console.error("Non-JSON response:", responseText)
          setApiStatus("❌ Non-JSON Response")
          return
        }

        const data = await response.json()
        console.log("✅ API test response:", data)
        setApiStatus(data.success ? "✅ API Connected" : "❌ API Error")
      } catch (error) {
        console.error("❌ API test failed:", error)
        setApiStatus("❌ Connection Failed")
      }
    }
    testAPI()
  }, [])

  const handleAnalyze = async () => {
    console.log("=== 🚀 Starting Analysis ===")

    if (!code.trim() || !selectedCompany) {
      alert("Please enter code and select a target company")
      return
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsAnalyzing(true)

    try {
      const requestData = {
        code: code.trim(),
        language: selectedLanguage,
        targetCompany: selectedCompany,
        userId: user.id,
        title: title.trim() || `${selectedLanguage} Analysis`,
      }

      console.log("📤 Sending request:", {
        codeLength: requestData.code.length,
        language: requestData.language,
        targetCompany: requestData.targetCompany,
        userId: requestData.userId,
        title: requestData.title,
      })

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("📥 Response status:", response.status, response.statusText)
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API response not ok:", response.status, errorText)
        throw new Error(`API Error ${response.status}: ${errorText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.error("❌ Non-JSON response:", responseText)
        throw new Error(`Expected JSON but got: ${responseText}`)
      }

      const data = await response.json()
      console.log("✅ Response data:", data)

      if (data.success) {
        localStorage.setItem("latestAnalysis", JSON.stringify(data.analysis))
        console.log("✅ Analysis stored, redirecting to results...")
        router.push("/results")
      } else {
        console.error("❌ Analysis failed:", data.error)
        alert(`Analysis failed: ${data.error}`)
      }
    } catch (error: any) {
      console.error("❌ Error analyzing code:", error)
      alert(`Failed to analyze code: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const loadExample = () => {
    setCode(exampleCode)
    setSelectedLanguage("python")
    setTitle("Two Sum Algorithm")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCode(content)
        setTitle(file.name.split(".")[0])

        // Auto-detect language from file extension
        const extension = file.name.split(".").pop()?.toLowerCase()
        const langMap: Record<string, string> = {
          py: "python",
          js: "javascript",
          java: "java",
          cpp: "cpp",
          c: "c",
          go: "go",
          rs: "rust",
        }
        if (extension && langMap[extension]) {
          setSelectedLanguage(langMap[extension])
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodeHire
            </h1>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{apiStatus}</span>
          </div>

          <div className="flex items-center space-x-2">
            {user && (
              <>
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                  <History className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
            {!user && (
              <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI-Powered Code Efficiency Evaluator
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Get instant, intelligent feedback on your code efficiency using advanced AI analysis. Perfect for technical
            interview preparation and competitive programming.
          </p>

          {user && (
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                Welcome back, {user.user_metadata?.name || user.email}! Your analyses are automatically saved.
              </p>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <Zap className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Advanced AI analyzes complexity, performance, and best practices
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <Target className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Company Standards</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Benchmarked against top tech company requirements
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Save your analyses and track improvement over time
              </p>
            </div>
          </div>
        </div>

        {/* Main Analysis Interface */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code2 className="w-5 h-5" />
                <span>AI Code Analysis</span>
              </CardTitle>
              <CardDescription>Upload a file or paste your code below for intelligent analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title">Analysis Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="e.g., Two Sum Algorithm, Binary Search Implementation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Company and Language Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Company</label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.value} value={company.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${company.color}`} />
                            <span>{company.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Code File</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".py,.js,.java,.cpp,.c,.go,.rs,.txt"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Your Code</label>
                  <Button variant="outline" size="sm" onClick={loadExample}>
                    Load Example
                  </Button>
                </div>
                <Textarea
                  placeholder="Paste your code here or upload a file above..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              {/* Analysis Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!code.trim() || !selectedCompany || isAnalyzing}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI is analyzing your code...</span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>

              {!user && (
                <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                  Sign in to save your analysis history and track your progress over time
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  )
}
