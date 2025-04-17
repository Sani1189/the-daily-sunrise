import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

// Get admin from token
export async function getAdminFromToken(req) {
  try {
    // Get token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    return decoded
  } catch (error) {
    console.error("Error getting admin from token:", error)
    return null
  }
}

// Middleware to protect admin routes
export async function adminAuthMiddleware(req) {
  try {
    const admin = await getAdminFromToken(req)

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    return null // Continue to the route handler
  } catch (error) {
    console.error("Error in admin auth middleware:", error)
    return NextResponse.json({ message: "Unauthorized", error: error.message }, { status: 401 })
  }
}
