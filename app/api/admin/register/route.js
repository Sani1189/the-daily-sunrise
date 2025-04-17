import connectMongoDB from "@/libs/DBconnect"
import Admin from "@/models/admin"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { fullName, email, password, role, phone, bio } = await req.json()

    await connectMongoDB()

    // Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin with this email already exists" }, { status: 400 })
    }

    // Create new admin
    const newAdmin = await Admin.create({
      fullName,
      email,
      password,
      role: role || "admin",
      phone,
      bio,
    })

    // Remove password from response
    const admin = newAdmin.toObject()
    delete admin.password

    return NextResponse.json({ message: "Admin registered successfully", admin }, { status: 201 })
  } catch (error) {
    console.error("Error registering admin:", error)
    return NextResponse.json({ message: "Error registering admin", error: error.message }, { status: 500 })
  }
}
