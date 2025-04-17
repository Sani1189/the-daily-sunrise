import connectMongoDB from "@/libs/DBconnect"
import Admin from "@/models/admin"
import { NextResponse } from "next/server"
import { getAdminFromToken } from "@/libs/auth"

// Get admin profile
export async function GET(req) {
  try {
    const admin = await getAdminFromToken(req)

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectMongoDB()

    const adminProfile = await Admin.findById(admin.id).select("-password")

    if (!adminProfile) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json(adminProfile, { status: 200 })
  } catch (error) {
    console.error("Error fetching admin profile:", error)
    return NextResponse.json({ message: "Error fetching admin profile", error: error.message }, { status: 500 })
  }
}

// Update admin profile
export async function PUT(req) {
  try {
    const admin = await getAdminFromToken(req)

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { fullName, phone, bio, profileImage } = await req.json()

    await connectMongoDB()

    const updatedAdmin = await Admin.findByIdAndUpdate(
      admin.id,
      {
        fullName,
        phone,
        bio,
        profileImage,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    ).select("-password")

    if (!updatedAdmin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Profile updated successfully", admin: updatedAdmin }, { status: 200 })
  } catch (error) {
    console.error("Error updating admin profile:", error)
    return NextResponse.json({ message: "Error updating admin profile", error: error.message }, { status: 500 })
  }
}
