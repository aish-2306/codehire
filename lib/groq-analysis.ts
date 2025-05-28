import Groq from "groq-sdk"

export interface AnalysisResult {
  overallScore: number
  timeComplexity: string
  spaceComplexity: string
  languagePerformance: "High" | "Medium" | "Low"
  dataStructures: "Optimal" | "Good" | "Suboptimal"
  redundantLogic: number
  codeModularity: "Excellent" | "Good" | "Fair" | "Poor"
  companyBenchmark: string
  suggestions: string[]
  strengths: string[]
  weaknesses: string[]
  explanation: string
  detailedFeedback: {
    algorithmEfficiency: string
    codeReadability: string
    bestPractices: string
    performanceOptimization: string
  }
}

// Initialize Groq client only on server-side
let groqClient: Groq | null = null

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return groqClient
}

export async function analyzeCodeWithGroq(
  code: string,
  language: string,
  targetCompany: string,
): Promise<AnalysisResult> {
  console.log("🤖 Starting Groq AI analysis...")

  // Check if we're running on the server
  if (typeof window !== "undefined") {
    console.warn("⚠️ Running in browser, using enhanced fallback analysis")
    return getEnhancedFallbackAnalysis(code, language, targetCompany)
  }

  // Check if Groq API key is available
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️ GROQ_API_KEY not found, using enhanced fallback analysis")
    return getEnhancedFallbackAnalysis(code, language, targetCompany)
  }

  try {
    const groq = getGroqClient()

    if (!groq) {
      throw new Error("Failed to initialize Groq client")
    }

    const prompt = `You are an expert code reviewer for ${targetCompany}. Analyze this ${language} code thoroughly and provide a comprehensive, specific assessment.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Analyze this code carefully and provide a detailed JSON response. Be specific about the actual code provided, not generic advice.

Requirements:
1. Calculate the ACTUAL time and space complexity by analyzing the loops, recursion, and data structures used
2. Provide SPECIFIC suggestions based on the actual code issues you see
3. Identify REAL strengths and weaknesses in this particular code
4. Give a realistic score based on ${targetCompany} standards
5. Be critical but constructive

Respond with ONLY valid JSON in this exact format:
{
  "overallScore": number (0-100, be realistic based on actual code quality),
  "timeComplexity": "O(...)" (analyze actual loops/recursion),
  "spaceComplexity": "O(...)" (analyze actual memory usage),
  "languagePerformance": "High|Medium|Low",
  "dataStructures": "Optimal|Good|Suboptimal",
  "redundantLogic": number (count actual redundant patterns),
  "codeModularity": "Excellent|Good|Fair|Poor",
  "companyBenchmark": "Exceeds Expectations|Meets Requirements|Below Expectations",
  "suggestions": [
    "specific suggestion 1 based on actual code",
    "specific suggestion 2 based on actual code",
    "specific suggestion 3 based on actual code"
  ],
  "strengths": [
    "specific strength 1 found in code",
    "specific strength 2 found in code"
  ],
  "weaknesses": [
    "specific weakness 1 found in code",
    "specific weakness 2 found in code"
  ],
  "explanation": "detailed explanation of why this code got this score, mentioning specific parts of the code",
  "detailedFeedback": {
    "algorithmEfficiency": "specific analysis of the algorithm used in this code",
    "codeReadability": "specific analysis of this code's readability",
    "bestPractices": "specific analysis of best practices in this code",
    "performanceOptimization": "specific performance suggestions for this code"
  }
}

Focus on:
- ACTUAL algorithm complexity analysis (count loops, analyze recursion depth)
- SPECIFIC code issues and improvements for THIS code
- ${targetCompany} interview standards and expectations
- REAL performance bottlenecks in the provided code
- Concrete, actionable feedback based on what you see`

    console.log("🔄 Sending request to Groq AI...")

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a senior software engineer and code reviewer specializing in ${targetCompany} technical interviews. You must analyze the ACTUAL code provided and give specific, detailed feedback. Always respond with valid JSON only. Be thorough, specific, and critical but constructive.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.1,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from Groq AI")
    }

    console.log("📥 Raw Groq response:", response.substring(0, 200) + "...")

    // Clean the response to ensure it's valid JSON
    let cleanedResponse = response.trim()

    // Remove any markdown code blocks if present
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    // Parse JSON response
    let analysis
    try {
      analysis = JSON.parse(cleanedResponse) as AnalysisResult
      console.log("✅ Groq AI analysis parsed successfully")
    } catch (parseError) {
      console.error("❌ Failed to parse Groq response:", parseError)
      console.error("Raw response:", response)
      throw new Error("Invalid JSON response from AI")
    }

    // Validate and sanitize the response
    const result = {
      overallScore: Math.max(0, Math.min(100, analysis.overallScore || 0)),
      timeComplexity: analysis.timeComplexity || "O(n)",
      spaceComplexity: analysis.spaceComplexity || "O(1)",
      languagePerformance: analysis.languagePerformance || "Medium",
      dataStructures: analysis.dataStructures || "Good",
      redundantLogic: Math.max(0, analysis.redundantLogic || 0),
      codeModularity: analysis.codeModularity || "Good",
      companyBenchmark: analysis.companyBenchmark || "Meets Requirements",
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.slice(0, 8) : [],
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths.slice(0, 6) : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses.slice(0, 6) : [],
      explanation: analysis.explanation || "Analysis completed successfully.",
      detailedFeedback: {
        algorithmEfficiency:
          analysis.detailedFeedback?.algorithmEfficiency || "Algorithm efficiency analysis completed.",
        codeReadability: analysis.detailedFeedback?.codeReadability || "Code readability analysis completed.",
        bestPractices: analysis.detailedFeedback?.bestPractices || "Best practices analysis completed.",
        performanceOptimization:
          analysis.detailedFeedback?.performanceOptimization || "Performance optimization analysis completed.",
      },
    }

    console.log("✅ Groq AI analysis completed successfully with score:", result.overallScore)
    return result
  } catch (error) {
    console.error("❌ Error analyzing code with Groq:", error)
    console.log("🔄 Falling back to enhanced local analysis")
    return getEnhancedFallbackAnalysis(code, language, targetCompany)
  }
}

function getEnhancedFallbackAnalysis(code: string, language: string, targetCompany: string): AnalysisResult {
  console.log("🔄 Using enhanced fallback analysis for actual code analysis")

  // Detailed code analysis
  const codeLength = code.length
  const lines = code.split("\n").filter((line) => line.trim().length > 0).length
  const codeLines = code.split("\n")

  // Algorithm complexity analysis
  const forLoops = (code.match(/\bfor\b/g) || []).length
  const whileLoops = (code.match(/\bwhile\b/g) || []).length
  const nestedLoops = code.includes("for") && code.split("for").length > 2
  const recursivePattern = /\breturn\s+\w+\s*\(/g.test(code)
  const hasHashMap = /\b(Map|HashMap|dict|{}|Set|object)\b/gi.test(code)
  const hasArray = /\[\]|\barray\b|\blist\b/gi.test(code)

  // Code quality analysis
  const hasFunctions = /\b(def|function|=>|func|class|method)\b/gi.test(code)
  const hasComments = /\/\/|\/\*|#|"""|'''/g.test(code)
  const hasErrorHandling = /\b(try|catch|except|finally|throw|raise)\b/gi.test(code)
  const hasValidation = /\b(if|validate|check|assert)\b/gi.test(code)
  const hasConstants = /\b(const|final|readonly|[A-Z_]{2,})\b/g.test(code)
  const hasDocstrings = /"""[\s\S]*?"""|'''[\s\S]*?'''/g.test(code)

  // Performance patterns
  const hasEarlyReturn = /\breturn\b/g.test(code) && code.split("return").length > 2
  const hasBreakContinue = /\b(break|continue)\b/g.test(code)
  const hasOptimizedSearch = hasHashMap || /\bbinary.?search\b/gi.test(code)

  // Calculate complexities based on actual code patterns
  let timeComplexity = "O(1)"
  let spaceComplexity = "O(1)"

  if (recursivePattern && !hasOptimizedSearch) {
    timeComplexity = "O(2^n)"
    spaceComplexity = "O(n)"
  } else if (nestedLoops) {
    timeComplexity = "O(n²)"
    spaceComplexity = hasHashMap ? "O(n)" : "O(1)"
  } else if (forLoops > 0 || whileLoops > 0) {
    timeComplexity = "O(n)"
    spaceComplexity = hasHashMap || hasArray ? "O(n)" : "O(1)"
  } else if (hasOptimizedSearch) {
    timeComplexity = "O(n)"
    spaceComplexity = "O(n)"
  }

  // Calculate base score with more sophisticated logic
  let baseScore = 50

  // Algorithm efficiency scoring
  if (hasOptimizedSearch) baseScore += 20
  if (timeComplexity === "O(n)" && !nestedLoops) baseScore += 15
  if (timeComplexity === "O(log n)") baseScore += 25
  if (hasEarlyReturn) baseScore += 5
  if (hasBreakContinue) baseScore += 3

  // Code quality scoring
  if (hasFunctions) baseScore += 10
  if (hasComments || hasDocstrings) baseScore += 8
  if (hasErrorHandling) baseScore += 7
  if (hasValidation) baseScore += 6
  if (hasConstants) baseScore += 4

  // Code structure scoring
  if (lines > 5 && lines < 50) baseScore += 5
  if (codeLength > 50 && codeLength < 500) baseScore += 3

  // Penalties
  if (nestedLoops && !hasOptimizedSearch) baseScore -= 15
  if (timeComplexity === "O(2^n)") baseScore -= 20
  if (!hasFunctions && lines > 20) baseScore -= 10
  if (!hasComments && lines > 15) baseScore -= 8
  if (lines > 100) baseScore -= 5

  // Company-specific adjustments
  const companyMultipliers: Record<string, number> = {
    google: 1.1,
    amazon: 1.05,
    microsoft: 1.08,
    meta: 1.12,
    apple: 1.03,
    netflix: 1.02,
    infosys: 1.0,
    tcs: 0.98,
  }

  const finalScore = Math.min(
    98,
    Math.max(15, Math.round(baseScore * (companyMultipliers[targetCompany.toLowerCase()] || 1))),
  )

  // Generate specific suggestions based on code analysis
  const suggestions = []
  const strengths = []
  const weaknesses = []

  // Specific suggestions based on actual code
  if (!hasOptimizedSearch && (forLoops > 0 || whileLoops > 0)) {
    suggestions.push("Consider using hash maps or sets for O(1) lookup operations instead of linear search")
  }
  if (nestedLoops) {
    suggestions.push("Optimize nested loops - consider using hash maps to reduce time complexity from O(n²) to O(n)")
  }
  if (!hasErrorHandling && lines > 10) {
    suggestions.push("Add error handling with try-catch blocks for robustness")
  }
  if (!hasComments && lines > 15) {
    suggestions.push("Add meaningful comments to explain complex logic and algorithm choices")
  }
  if (!hasValidation) {
    suggestions.push("Add input validation to handle edge cases and invalid inputs")
  }
  if (lines > 50 && !hasFunctions) {
    suggestions.push("Break down the code into smaller, reusable functions for better modularity")
  }
  if (!hasConstants && /\d+/.test(code)) {
    suggestions.push("Replace magic numbers with named constants for better maintainability")
  }

  // Identify strengths
  if (hasOptimizedSearch) {
    strengths.push("Efficient use of hash maps/sets for optimal time complexity")
  }
  if (hasFunctions) {
    strengths.push("Good code organization with proper function decomposition")
  }
  if (hasComments || hasDocstrings) {
    strengths.push("Well-documented code with clear explanations")
  }
  if (hasErrorHandling) {
    strengths.push("Robust error handling implementation")
  }
  if (hasEarlyReturn) {
    strengths.push("Efficient early return patterns to avoid unnecessary computation")
  }
  if (timeComplexity === "O(n)" && !nestedLoops) {
    strengths.push("Linear time complexity achieved for the problem")
  }

  // Identify weaknesses
  if (nestedLoops && !hasOptimizedSearch) {
    weaknesses.push("Quadratic time complexity due to nested loops - can be optimized")
  }
  if (!hasErrorHandling && lines > 10) {
    weaknesses.push("Missing error handling for edge cases and invalid inputs")
  }
  if (!hasComments && lines > 15) {
    weaknesses.push("Lack of documentation makes code harder to understand and maintain")
  }
  if (timeComplexity === "O(2^n)") {
    weaknesses.push("Exponential time complexity - consider dynamic programming or memoization")
  }
  if (lines > 50 && !hasFunctions) {
    weaknesses.push("Monolithic code structure - lacks modularity and reusability")
  }

  // Ensure we have at least some feedback
  if (suggestions.length === 0) {
    suggestions.push(
      "Consider adding more comprehensive test cases",
      "Review algorithm efficiency for potential optimizations",
    )
  }
  if (strengths.length === 0) {
    strengths.push("Code compiles and runs correctly", "Basic problem-solving approach is sound")
  }
  if (weaknesses.length === 0 && finalScore < 80) {
    weaknesses.push("Code could benefit from optimization", "Consider improving code documentation")
  }

  return {
    overallScore: finalScore,
    timeComplexity,
    spaceComplexity,
    languagePerformance: (language === "python" || language === "javascript" ? "Medium" : "High") as
      | "High"
      | "Medium"
      | "Low",
    dataStructures: (hasOptimizedSearch ? "Optimal" : hasHashMap || hasArray ? "Good" : "Suboptimal") as
      | "Optimal"
      | "Good"
      | "Suboptimal",
    redundantLogic: Math.max(0, Math.floor((nestedLoops ? 2 : 0) + (!hasOptimizedSearch && forLoops > 1 ? 1 : 0))),
    codeModularity: (hasFunctions && hasComments
      ? "Excellent"
      : hasFunctions
        ? "Good"
        : lines > 30
          ? "Poor"
          : "Fair") as "Excellent" | "Good" | "Fair" | "Poor",
    companyBenchmark:
      finalScore > 85 ? "Exceeds Expectations" : finalScore > 70 ? "Meets Requirements" : "Below Expectations",
    suggestions: suggestions.slice(0, 6),
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    explanation: `Code analysis reveals ${timeComplexity} time complexity and ${spaceComplexity} space complexity. Score: ${finalScore}/100. ${hasOptimizedSearch ? "Excellent algorithmic approach with efficient data structures." : "Algorithm could be optimized for better performance."} ${hasComments ? "Good documentation practices observed." : "Documentation could be improved."} ${hasErrorHandling ? "Proper error handling implemented." : "Consider adding error handling for robustness."}`,
    detailedFeedback: {
      algorithmEfficiency: `Time complexity: ${timeComplexity}, Space complexity: ${spaceComplexity}. ${hasOptimizedSearch ? "Optimal algorithm with efficient data structure usage." : nestedLoops ? "Nested loops detected - consider optimization with hash maps." : "Linear approach is reasonable but could potentially be optimized."}`,
      codeReadability: `${hasComments || hasDocstrings ? "Code is well-documented with clear comments." : "Code lacks sufficient documentation."} ${hasFunctions ? "Good function organization and structure." : "Consider breaking code into smaller functions."} Variable naming and structure ${lines < 30 ? "is clean and manageable." : "could be improved for better readability."}`,
      bestPractices: `${hasErrorHandling ? "Good error handling practices implemented." : "Missing error handling - add try-catch blocks."} ${hasValidation ? "Input validation is present." : "Add input validation for edge cases."} ${hasConstants ? "Good use of constants." : "Consider using named constants instead of magic numbers."} ${language === "python" && hasDocstrings ? "Proper Python docstring usage." : ""}`,
      performanceOptimization: `${hasOptimizedSearch ? "Efficient data structures used for optimal performance." : "Consider using hash maps/sets for O(1) lookups."} ${hasEarlyReturn ? "Good use of early returns to avoid unnecessary computation." : "Consider early returns where applicable."} ${nestedLoops ? "Nested loops present - major optimization opportunity." : "No obvious performance bottlenecks detected."} Memory usage is ${spaceComplexity === "O(1)" ? "optimal" : spaceComplexity === "O(n)" ? "reasonable" : "could be optimized"}.`,
    },
  }
}
