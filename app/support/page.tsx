"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Code2, ArrowLeft, HelpCircle, Mail, MessageSquare, Book, Bug } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the form data to a support system
    alert("Thank you for your message! We'll get back to you within 24 hours.")
  }

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
            <HelpCircle className="w-8 h-8 mr-3 text-blue-600" />
            Support Center
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Get help with CodeHire or report issues</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Quick Help */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="w-5 h-5 mr-2 text-green-600" />
                  Quick Help
                </CardTitle>
                <CardDescription>Common questions and solutions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">How does the AI analysis work?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Our AI analyzes your code for time/space complexity, best practices, and company-specific standards
                    using advanced language models.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Why are my analyses not saving?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Make sure you're signed in to your account. Analyses are only saved for authenticated users.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I delete my analysis history?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Yes, you can download your data and delete your account from the dashboard settings.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Which programming languages are supported?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We support Python, JavaScript, Java, C++, C, Go, and Rust with more languages coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="w-5 h-5 mr-2 text-red-600" />
                  Report a Bug
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Found a bug? Help us improve by reporting it:</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:vaishnaviraosomarouthu@gmail.com?subject=CodeHire Bug Report"
                      className="text-blue-600 hover:underline"
                    >
                      vaishnaviraosomarouthu@gmail.com
                    </a>
                  </p>
                  <p className="text-sm">
                    <strong>GitHub Issues:</strong>{" "}
                    <a
                      href="https://github.com/aish-2306"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Create an issue
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Contact Us
              </CardTitle>
              <CardDescription>Send us a message and we'll respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question in detail..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Direct Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Direct Contact</CardTitle>
            <CardDescription>Reach out to us directly through these channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Email</h3>
                <a href="mailto:vaishnaviraosomarouthu@gmail.com" className="text-blue-600 hover:underline text-sm">
                  vaishnaviraosomarouthu@gmail.com
                </a>
              </div>
              <div className="text-center">
                <Code2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">GitHub</h3>
                <a
                  href="https://github.com/aish-2306"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  @aish-2306
                </a>
              </div>
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/in/vaishnavi-somarouthu-2b99522b4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Connect with us
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <HelpCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 dark:text-green-200 text-sm">
              We typically respond to support requests within 24 hours
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
