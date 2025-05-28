"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuthRedirectUrl } from "@/lib/auth-config"
import { supabase } from "@/lib/supabase"

export function AuthTest() {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    setConfig({
      redirectUrl: getAuthRedirectUrl(),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      currentOrigin: typeof window !== "undefined" ? window.location.origin : "N/A",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    })
  }, [])

  const testGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthRedirectUrl(),
        },
      })
      console.log("Google auth test:", { data, error })
    } catch (error) {
      console.error("Google auth test error:", error)
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 max-w-sm">
      <CardHeader>
        <CardTitle className="text-sm">Auth Configuration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs">
          <strong>Redirect URL:</strong> {config?.redirectUrl}
        </div>
        <div className="text-xs">
          <strong>Site URL:</strong> {config?.siteUrl || "Not set"}
        </div>
        <div className="text-xs">
          <strong>Current Origin:</strong> {config?.currentOrigin}
        </div>
        <Button size="sm" onClick={testGoogleAuth} className="w-full">
          Test Google Auth
        </Button>
      </CardContent>
    </Card>
  )
}
