import connectMongoDB from "@/libs/DBconnect"
import Comment from "@/models/comment"
import { NextResponse } from "next/server"

// Get all comments with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const newsId = searchParams.get("newsId")
    const searchQuery = searchParams.get("search")

    const skip = (page - 1) * limit

    await connectMongoDB()

    const query = {}

    if (newsId) {
      query.newsId = newsId
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { comment: { $regex: searchQuery, $options: "i" } },
      ]
    }

    const totalComments = await Comment.countDocuments(query)
    const comments = await Comment.find(query).sort({ date: -1 }).skip(skip).limit(limit).populate("newsId", "title")

    return NextResponse.json(
      {
        comments,
        pagination: {
          total: totalComments,
          page,
          limit,
          pages: Math.ceil(totalComments / limit),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ message: "Error fetching comments", error: error.message }, { status: 500 })
  }
}
