export const getAuthRedirectUrl = () => {
  // Use the configured site URL in production, localhost in development
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

  return `${baseUrl}/auth/callback`
}

export const authConfig = {
  redirectTo: getAuthRedirectUrl(),
  emailRedirectTo: getAuthRedirectUrl(),
}
