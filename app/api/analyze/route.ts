import { type NextRequest, NextResponse } from "next/server"
import { analyzeCodeWithGroq } from "@/lib/groq-analysis"
import {
  createCodeAnalysis,
  updateUserProgress,
  getUserProgress,
  initializeDatabase,
  testConnection,
} from "@/lib/database"

export async function GET() {
  try {
    console.log("=== GET /api/analyze called ===")

    // Test database connection
    const dbConnected = await testConnection()

    const features = {
      groqAI: !!process.env.GROQ_API_KEY,
      database: dbConnected,
      blobStorage: !!process.env.BLOB_READ_WRITE_TOKEN,
    }

    return NextResponse.json({
      success: true,
      message: "Analysis API is working",
      timestamp: new Date().toISOString(),
      features,
    })
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "GET failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  console.log("=== 🚀 Analysis API Called ===")

  try {
    // Initialize database tables if they don't exist
    await initializeDatabase()

    // Parse request body
    const body = await request.json()
    const { code, language, targetCompany, userId, title } = body

    console.log("📝 Request data:", {
      language,
      targetCompany,
      userId,
      title,
      codeLength: code?.length,
    })

    // Validate required fields
    if (!code || !language || !targetCompany || !userId) {
      console.error("❌ Missing required fields")
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    console.log("🤖 Starting AI analysis...")

    // Analyze code with Groq AI (with enhanced fallback)
    let analysis
    try {
      analysis = await analyzeCodeWithGroq(code, language, targetCompany)
      console.log("✅ AI analysis completed with score:", analysis.overallScore)
    } catch (analysisError) {
      console.error("❌ Analysis failed:", analysisError)
      return NextResponse.json({ success: false, error: "Failed to analyze code" }, { status: 500 })
    }

    // Save code file to Blob storage (optional)
    let codeBlob = { url: null }
    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        console.log("💾 Saving code to blob storage...")
        const { put } = await import("@vercel/blob")
        const fileName = `code-files/${userId}/${Date.now()}.${language}`
        codeBlob = await put(fileName, code, {
          access: "public",
        })
        console.log("✅ Code file saved to blob storage")
      }
    } catch (blobError) {
      console.log("⚠️ Blob storage failed (non-critical):", blobError.message)
    }

    // Save analysis to database
    let savedAnalysis
    try {
      console.log("💾 Saving analysis to database...")
      savedAnalysis = await createCodeAnalysis({
        user_id: userId,
        title: title || `${language} Analysis`,
        code,
        language,
        target_company: targetCompany,
        overall_score: analysis.overallScore,
        time_complexity: analysis.timeComplexity,
        space_complexity: analysis.spaceComplexity,
        analysis_result: analysis,
        file_url: codeBlob.url,
      })
      console.log("✅ Analysis saved to database:", savedAnalysis.id)
    } catch (dbError) {
      console.error("❌ Database save failed:", dbError)
      return NextResponse.json({ success: false, error: "Failed to save analysis" }, { status: 500 })
    }

    // Update user progress
    try {
      console.log("📊 Updating user progress...")
      const currentProgress = await getUserProgress(userId)
      const newTotalAnalyses = (currentProgress?.total_analyses || 0) + 1
      const newAverageScore = currentProgress
        ? (currentProgress.average_score * currentProgress.total_analyses + analysis.overallScore) / newTotalAnalyses
        : analysis.overallScore
      const newBestScore = Math.max(currentProgress?.best_score || 0, analysis.overallScore)

      await updateUserProgress(userId, {
        total_analyses: newTotalAnalyses,
        average_score: Math.round(newAverageScore * 100) / 100,
        best_score: newBestScore,
        favorite_language: language,
        target_companies: [targetCompany],
      })
      console.log("✅ User progress updated")
    } catch (progressError) {
      console.log("⚠️ Progress update failed (non-critical):", progressError.message)
    }

    console.log("=== ✅ Analysis API Success ===")
    return NextResponse.json({
      success: true,
      analysis: savedAnalysis,
    })
  } catch (error) {
    console.error("=== ❌ Unexpected error in analyze API ===")
    console.error("Error details:", error)

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
