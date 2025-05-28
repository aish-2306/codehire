"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setStatus("error")
          setTimeout(() => router.push("/?error=auth_error"), 2000)
          return
        }

        if (data.session) {
          setStatus("success")
          // User is authenticated, redirect to home with success message
          setTimeout(() => router.push("/?success=auth_success"), 1000)
        } else {
          // Try to get the session again after a short delay
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession()
            if (retryData.session) {
              setStatus("success")
              router.push("/?success=auth_success")
            } else {
              setStatus("error")
              router.push("/?error=no_session")
            }
          }, 1000)
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        setStatus("error")
        setTimeout(() => router.push("/?error=unexpected_error"), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
        {status === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Authentication</h2>
            <p className="text-slate-600 dark:text-slate-400">Please wait while we confirm your account...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">Success!</h2>
            <p className="text-slate-600 dark:text-slate-400">Authentication successful. Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Authentication Error</h2>
            <p className="text-slate-600 dark:text-slate-400">There was an issue with authentication. Redirecting...</p>
          </>
        )}
      </div>
    </div>
  )
}
