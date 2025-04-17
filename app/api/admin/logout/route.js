import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the admin token cookie
    cookies().set({
      name: "admin_token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
    })

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ message: "Error logging out", error: error.message }, { status: 500 })
  }
}
