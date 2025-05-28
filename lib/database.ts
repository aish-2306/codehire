import { neon } from "@neondatabase/serverless"

// Use the correct environment variable name
const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL!)

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface CodeAnalysis {
  id: string
  user_id: string
  title: string
  code: string
  language: string
  target_company: string
  overall_score: number
  time_complexity: string | null
  space_complexity: string | null
  analysis_result: any
  file_url: string | null
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  total_analyses: number
  average_score: number
  best_score: number
  favorite_language: string | null
  target_companies: string[]
  created_at: string
  updated_at: string
}

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Create tables if they don't exist - Updated to use UUIDs
export async function initializeDatabase() {
  try {
    console.log("🔧 Initializing database...")

    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    // Drop and recreate tables with proper UUID support
    await sql`DROP TABLE IF EXISTS user_progress CASCADE`
    await sql`DROP TABLE IF EXISTS code_analyses CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`

    // Create users table with UUID
    await sql`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create code_analyses table with UUID foreign key
    await sql`
      CREATE TABLE code_analyses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        code TEXT NOT NULL,
        language VARCHAR(50) NOT NULL,
        target_company VARCHAR(100) NOT NULL,
        overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
        time_complexity VARCHAR(50),
        space_complexity VARCHAR(50),
        analysis_result JSONB NOT NULL,
        file_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create user_progress table with UUID foreign key
    await sql`
      CREATE TABLE user_progress (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_analyses INTEGER DEFAULT 0,
        average_score DECIMAL(5,2) DEFAULT 0,
        best_score INTEGER DEFAULT 0,
        favorite_language VARCHAR(50),
        target_companies TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_code_analyses_user_id ON code_analyses(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_code_analyses_created_at ON code_analyses(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_code_analyses_overall_score ON code_analyses(overall_score DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)`

    console.log("✅ Database tables created successfully with UUID support")
    return true
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return false
  }
}

export async function createUser(userData: Partial<User>) {
  try {
    const result = await sql`
      INSERT INTO users (id, email, name, avatar_url)
      VALUES (${userData.id}, ${userData.email}, ${userData.name}, ${userData.avatar_url})
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW()
      RETURNING *
    `
    return result[0] as User
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `
    return result[0] as User | undefined
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw new Error("Failed to get user")
  }
}

export async function getUserById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `
    return result[0] as User | undefined
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw new Error("Failed to get user")
  }
}

export async function createCodeAnalysis(analysisData: Omit<CodeAnalysis, "id" | "created_at">) {
  try {
    // Ensure user exists in our database
    const existingUser = await getUserById(analysisData.user_id)
    if (!existingUser) {
      // Create user record if it doesn't exist
      await sql`
        INSERT INTO users (id, email, name)
        VALUES (${analysisData.user_id}, 'user@example.com', 'User')
        ON CONFLICT (id) DO NOTHING
      `
    }

    const result = await sql`
      INSERT INTO code_analyses (
        user_id, title, code, language, target_company, 
        overall_score, time_complexity, space_complexity, 
        analysis_result, file_url
      )
      VALUES (
        ${analysisData.user_id}, ${analysisData.title}, ${analysisData.code},
        ${analysisData.language}, ${analysisData.target_company},
        ${analysisData.overall_score}, ${analysisData.time_complexity},
        ${analysisData.space_complexity}, ${JSON.stringify(analysisData.analysis_result)},
        ${analysisData.file_url}
      )
      RETURNING *
    `
    return result[0] as CodeAnalysis
  } catch (error) {
    console.error("Error creating code analysis:", error)
    throw new Error("Failed to save analysis")
  }
}

export async function getCodeAnalysis(id: string) {
  try {
    const result = await sql`
      SELECT * FROM code_analyses WHERE id = ${id} LIMIT 1
    `
    return result[0] as CodeAnalysis | undefined
  } catch (error) {
    console.error("Error getting code analysis:", error)
    throw new Error("Failed to get analysis")
  }
}

export async function getUserAnalyses(userId: string, limit = 10) {
  try {
    const result = await sql`
      SELECT * FROM code_analyses 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return result as CodeAnalysis[]
  } catch (error) {
    console.error("Error getting user analyses:", error)
    throw new Error("Failed to get analyses")
  }
}

export async function getUserProgress(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM user_progress WHERE user_id = ${userId} LIMIT 1
    `
    return result[0] as UserProgress | undefined
  } catch (error) {
    console.error("Error getting user progress:", error)
    return undefined
  }
}

export async function updateUserProgress(userId: string, progressData: Partial<UserProgress>) {
  try {
    const result = await sql`
      INSERT INTO user_progress (
        user_id, total_analyses, average_score, best_score, 
        favorite_language, target_companies
      )
      VALUES (
        ${userId}, ${progressData.total_analyses}, ${progressData.average_score},
        ${progressData.best_score}, ${progressData.favorite_language},
        ${progressData.target_companies}
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET
        total_analyses = EXCLUDED.total_analyses,
        average_score = EXCLUDED.average_score,
        best_score = EXCLUDED.best_score,
        favorite_language = EXCLUDED.favorite_language,
        target_companies = EXCLUDED.target_companies,
        updated_at = NOW()
      RETURNING *
    `
    return result[0] as UserProgress
  } catch (error) {
    console.error("Error updating user progress:", error)
    return null
  }
}

export async function getTopAnalyses(limit = 10) {
  try {
    const result = await sql`
      SELECT ca.*, u.name as user_name
      FROM code_analyses ca
      JOIN users u ON ca.user_id = u.id
      ORDER BY ca.overall_score DESC, ca.created_at DESC
      LIMIT ${limit}
    `
    return result as (CodeAnalysis & { user_name: string })[]
  } catch (error) {
    console.error("Error getting top analyses:", error)
    return []
  }
}
