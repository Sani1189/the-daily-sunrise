import connectMongoDB from "@/libs/DBconnect"
import Setting from "@/models/setting"
import { NextResponse } from "next/server"
import { getAdminFromToken } from "@/libs/auth"

// Delete a setting
export async function DELETE(req, { params }) {
  try {
    const admin = await getAdminFromToken(req)

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { key } = params

    await connectMongoDB()

    const setting = await Setting.findOneAndDelete({ key })

    if (!setting) {
      return NextResponse.json({ message: "Setting not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Setting deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting setting:", error)
    return NextResponse.json({ message: "Error deleting setting", error: error.message }, { status: 500 })
  }
}
