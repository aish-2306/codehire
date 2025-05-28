import { type NextRequest, NextResponse } from "next/server"
import { getTopAnalyses } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const topAnalyses = await getTopAnalyses(limit)

    return NextResponse.json({
      success: true,
      leaderboard: topAnalyses,
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
