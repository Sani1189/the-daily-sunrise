import connectMongoDB from "@/libs/DBconnect"
import Notification from "@/models/notification"
import { NextResponse } from "next/server"

// Mark notification as read
export async function PATCH(req, { params }) {
  try {
    const { id } = params
    const { isRead } = await req.json()

    await connectMongoDB()

    const notification = await Notification.findByIdAndUpdate(id, { isRead }, { new: true })

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Notification updated successfully", notification }, { status: 200 })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ message: "Error updating notification", error: error.message }, { status: 500 })
  }
}

// Delete notification
export async function DELETE(req, { params }) {
  try {
    const { id } = params

    await connectMongoDB()

    const notification = await Notification.findByIdAndDelete(id)

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ message: "Error deleting notification", error: error.message }, { status: 500 })
  }
}
