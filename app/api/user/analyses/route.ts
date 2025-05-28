import { type NextRequest, NextResponse } from "next/server"
import { getUserAnalyses } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const analyses = await getUserAnalyses(userId, limit)

    return NextResponse.json({
      success: true,
      analyses,
    })
  } catch (error) {
    console.error("Error fetching user analyses:", error)
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
  }
}
