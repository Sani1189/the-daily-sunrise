import connectMongoDB from "@/libs/DBconnect"
import Notification from "@/models/notification"
import { NextResponse } from "next/server"
import { getAdminFromToken } from "@/libs/auth"

// Create a new notification
export async function POST(req) {
  try {
    const admin = await getAdminFromToken(req)
    const { type, title, message, entityId, entityType } = await req.json()

    if (!type || !title || !message || !entityId || !entityType) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    await connectMongoDB()

    const notification = await Notification.create({
      type,
      title,
      message,
      entityId,
      entityType,
      createdBy: admin?.id,
    })

    return NextResponse.json({ message: "Notification created successfully", notification }, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ message: "Error creating notification", error: error.message }, { status: 500 })
  }
}

// Get notifications with pagination and filtering
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type")
    const isRead = searchParams.get("isRead")
    const entityType = searchParams.get("entityType")

    const skip = (page - 1) * limit

    await connectMongoDB()

    // Build query
    const query = {}
    if (type) query.type = type
    if (isRead !== null && isRead !== undefined) query.isRead = isRead === "true"
    if (entityType) query.entityType = entityType

    // Get notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "fullName")

    // Get total count
    const totalNotifications = await Notification.countDocuments(query)

    // Get unread count
    const unreadCount = await Notification.countDocuments({ isRead: false })

    return NextResponse.json(
      {
        notifications,
        pagination: {
          total: totalNotifications,
          page,
          limit,
          pages: Math.ceil(totalNotifications / limit),
        },
        unreadCount,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ message: "Error fetching notifications", error: error.message }, { status: 500 })
  }
}
