"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const getDebugInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setDebugInfo({
        session: !!session,
        user: !!user,
        userEmail: user?.email,
        userConfirmed: user?.email_confirmed_at,
        currentUrl: window.location.href,
        origin: window.location.origin,
      })
    }

    getDebugInfo()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      getDebugInfo()
    })

    return () => subscription.unsubscribe()
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black text-white text-xs rounded-lg max-w-sm">
      <h4 className="font-bold mb-2">Auth Debug Info:</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  )
}
