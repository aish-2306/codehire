import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Terms of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Last updated: December 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                By accessing and using CodeHire, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                CodeHire is an AI-powered code analysis platform that provides:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Automated code efficiency evaluation</li>
                <li>• Performance metrics and complexity analysis</li>
                <li>• Company-specific benchmarking</li>
                <li>• Progress tracking and history</li>
                <li>• Technical interview preparation assistance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Acceptable Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-green-600">You may:</h3>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Submit your own code for analysis</li>
                  <li>• Use the service for learning and interview preparation</li>
                  <li>• Share analysis results (your own)</li>
                  <li>• Download your analysis reports</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-red-600">You may not:</h3>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Submit copyrighted code without permission</li>
                  <li>• Use the service for malicious purposes</li>
                  <li>• Attempt to reverse engineer our AI models</li>
                  <li>• Share your account credentials</li>
                  <li>• Submit code containing malware or harmful content</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Your Code</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You retain all rights to the code you submit. We do not claim ownership of your code submissions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Our Service</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  CodeHire, including its AI models, analysis algorithms, and user interface, is protected by
                  intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Analysis Results</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  The analysis results generated by our AI are provided to you for your use, but the underlying analysis
                  methodology remains our intellectual property.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We strive for 99.9% uptime but cannot guarantee uninterrupted service. Maintenance and updates may
                  cause temporary unavailability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Analysis Accuracy</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  While our AI provides sophisticated analysis, results are for educational purposes and should not be
                  considered as definitive assessments for production code.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Interview Success</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  CodeHire is a preparation tool. We do not guarantee interview success or job placement outcomes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                We reserve the right to terminate accounts that violate these terms. You may also delete your account at
                any time through the dashboard.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Upon termination, your analysis history will be permanently deleted within 30 days unless you export it
                beforehand.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                CodeHire is provided "as is" without warranties. We are not liable for any damages arising from the use
                of our service, including but not limited to data loss, interview outcomes, or business decisions based
                on our analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                We may update these terms from time to time. Users will be notified of significant changes via email or
                platform notifications. Continued use of the service constitutes acceptance of updated terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                For questions about these Terms of Service, please contact us:
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
