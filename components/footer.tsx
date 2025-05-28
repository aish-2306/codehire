import { Code2, Github, Linkedin, Mail, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeHire
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              AI-powered code efficiency evaluator designed to help developers prepare for technical interviews at top
              tech companies.
            </p>
            <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for developers</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Features</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• AI Code Analysis</li>
              <li>• Company Benchmarks</li>
              <li>• Progress Tracking</li>
              <li>• Multiple Languages</li>
              <li>• Detailed Feedback</li>
              <li>• Performance Metrics</li>
            </ul>
          </div>

          {/* Companies */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Target Companies</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Google</li>
              <li>• Amazon</li>
              <li>• Microsoft</li>
              <li>• Meta</li>
              <li>• Apple</li>
              <li>• Netflix</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/aish-2306"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/vaishnavi-somarouthu-2b99522b4/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:vaishnaviraosomarouthu@gmail.com"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p>© 2024 CodeHire. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Powered by Groq AI, Supabase, Neon, and Vercel
            </div>
            <div className="flex space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="/support" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
