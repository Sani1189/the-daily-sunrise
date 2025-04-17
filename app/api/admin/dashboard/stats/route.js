import connectMongoDB from "@/libs/DBconnect"
import News from "@/models/news"
import Comment from "@/models/comment"
import Admin from "@/models/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectMongoDB()

    // Get total counts
    const totalNews = await News.countDocuments()
    const totalComments = await Comment.countDocuments()
    const totalAdmins = await Admin.countDocuments()

    // Get news by category
    const newsByCategory = await News.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get news by country
    const newsByCountry = await News.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get news by tags (top 10)
    const newsByTags = await News.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ])

    // Get recent news (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentNews = await News.aggregate([
      {
        $match: {
          published_date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$published_date" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get recent comments (last 7 days)
    const recentComments = await Comment.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get top authors
    const topAuthors = await News.aggregate([
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ])

    return NextResponse.json(
      {
        totalNews,
        totalComments,
        totalAdmins,
        newsByCategory,
        newsByCountry,
        newsByTags,
        recentNews,
        recentComments,
        topAuthors,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ message: "Error fetching dashboard stats", error: error.message }, { status: 500 })
  }
}
