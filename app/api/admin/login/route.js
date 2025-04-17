import connectMongoDB from "@/libs/DBconnect"
import Admin from "@/models/admin"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    await connectMongoDB()

    // Find admin by email
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { message: "Your account has been deactivated. Please contact the administrator." },
        { status: 403 },
      )
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Update last login time
    admin.lastLogin = new Date()
    await admin.save()

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.fullName,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" },
    )

    // Set cookie
    cookies().set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    // Remove password from response
    const adminData = admin.toObject()
    delete adminData.password

    return NextResponse.json(
      {
        message: "Login successful",
        admin: adminData,
        token,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ message: "Error logging in", error: error.message }, { status: 500 })
  }
}
