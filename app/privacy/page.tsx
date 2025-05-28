import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeHire
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Last updated: December 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Information</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  When you create an account, we collect your email address, name, and authentication data through
                  Supabase Auth.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Code Analysis Data</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We store the code you submit for analysis, along with the analysis results, to provide you with
                  history and progress tracking.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We collect anonymous usage data to improve our service, including analysis frequency and feature usage
                  patterns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Provide AI-powered code analysis services</li>
                <li>• Save your analysis history and track progress</li>
                <li>• Improve our AI models and analysis accuracy</li>
                <li>• Send important service updates and notifications</li>
                <li>• Provide customer support when requested</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-purple-600" />
                Data Security & Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Secure Infrastructure</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your data is stored securely using industry-standard encryption with Supabase and Neon PostgreSQL,
                  hosted on secure cloud infrastructure.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Code Privacy</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your code submissions are private and only accessible to you. We do not share your code with third
                  parties or use it for training purposes without explicit consent.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Retention</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We retain your analysis data for as long as your account is active. You can request data deletion at
                  any time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">CodeHire uses the following third-party services:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  • <strong>Supabase:</strong> Authentication and database services
                </li>
                <li>
                  • <strong>Groq AI:</strong> Code analysis and AI processing
                </li>
                <li>
                  • <strong>Vercel:</strong> Hosting and deployment
                </li>
                <li>
                  • <strong>Neon:</strong> PostgreSQL database hosting
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400">
                Each service has its own privacy policy, and we ensure they meet our security standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">You have the right to:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Access your personal data and analysis history</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your account and associated data</li>
                <li>• Export your analysis data</li>
                <li>• Opt out of non-essential communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                If you have any questions about this Privacy Policy or your data, please contact us:
              </p>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <p>
                  Email:{" "}
                  <a href="mailto:vaishnaviraosomarouthu@gmail.com" className="text-blue-600 hover:underline">
                    vaishnaviraosomarouthu@gmail.com
                  </a>
                </p>
                <p>
                  GitHub:{" "}
                  <a
                    href="https://github.com/aish-2306"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @aish-2306
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
