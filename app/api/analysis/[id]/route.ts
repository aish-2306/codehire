import { type NextRequest, NextResponse } from "next/server"
import { getCodeAnalysis } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ success: false, error: "Analysis ID is required" }, { status: 400 })
    }

    const analysis = await getCodeAnalysis(id)

    if (!analysis) {
      return NextResponse.json({ success: false, error: "Analysis not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Error fetching analysis:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analysis" }, { status: 500 })
  }
}
