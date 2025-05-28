"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Mail } from "lucide-react"
import { authConfig } from "@/lib/auth-config"

interface ResendConfirmationProps {
  email: string
}

export function ResendConfirmation({ email }: ResendConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleResend = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: authConfig.emailRedirectTo,
        },
      })

      if (error) throw error

      setMessage("Confirmation email sent! Please check your inbox and spam folder.")
    } catch (error: any) {
      setMessage(error.message || "Failed to resend confirmation email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center space-y-2">
      <Button variant="outline" onClick={handleResend} disabled={isLoading} className="w-full">
        <Mail className="w-4 h-4 mr-2" />
        {isLoading ? "Sending..." : "Resend Confirmation Email"}
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
