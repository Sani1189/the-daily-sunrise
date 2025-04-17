import connectMongoDB from "@/libs/DBconnect"
import Comment from "@/models/comment"
import { NextResponse } from "next/server"
import Notification from "@/models/notification" // Import Notification model
import News from "@/models/news" // Import News model

export async function POST(req) {
  try {
    const { newsId, name, email, comment, date } = await req.json()
    await connectMongoDB()
    const newComment = await Comment.create({
      newsId,
      name,
      email,
      comment,
      date,
    })

    // Create notification for the new comment
    try {
      // Get the news title for the notification message
      const news = await News.findById(newsId)
      const newsTitle = news ? news.title : "an article"

      await Notification.create({
        type: "comment_created",
        title: "New Comment Received",
        message: `New comment by ${name} on article "${newsTitle}".`,
        entityId: newComment._id,
        entityType: "comment",
      })
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError)
      // Continue even if notification creation fails
    }

    return NextResponse.json({ message: "Comment posted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error posting comment:", error)
    return NextResponse.json({ message: "Error posting comment" }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    await connectMongoDB()
    const url = new URL(req.url)
    const newsId = url.searchParams.get("newsId")

    if (!newsId) {
      return NextResponse.json({ message: "newsId query parameter is required" }, { status: 400 })
    }

    const comments = await Comment.find({ newsId }).sort({ date: -1 }) // Sort comments by date descending
    return NextResponse.json(comments, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ message: "Error fetching comments" }, { status: 500 })
  }
}
