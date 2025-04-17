import connectMongoDB from "@/libs/DBconnect"
import News from "@/models/news"
import Comment from "@/models/comment"
import Admin from "@/models/admin"
import View from "@/models/view"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectMongoDB()

    // Get total counts
    const totalNews = await News.countDocuments()
    const totalComments = await Comment.countDocuments()
    const totalAdmins = await Admin.countDocuments()

    // Get total views
    const viewsData = await View.aggregate([{ $group: { _id: null, totalViews: { $sum: "$viewCount" } } }])
    const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0

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

    // Get recent news (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentNews = await News.aggregate([
      {
        $match: {
          published_date: { $gte: thirtyDaysAgo },
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

    // Get recent comments (last 30 days)
    const recentComments = await Comment.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo },
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

    // Get top viewed articles
    const topViewedArticles = await View.find()
      .sort({ viewCount: -1 })
      .limit(5)
      .populate("newsId", "title category author published_date")

    // Get views by category
    const viewsByCategory = await View.aggregate([
      { $lookup: { from: "news", localField: "newsId", foreignField: "_id", as: "newsDetails" } },
      { $unwind: "$newsDetails" },
      { $group: { _id: "$newsDetails.category", count: { $sum: "$viewCount" } } },
      { $sort: { count: -1 } },
    ])

    // Get views over time (last 30 days)
    const viewsOverTime = await View.aggregate([
      { $unwind: "$dailyViews" },
      { $match: { "dailyViews.date": { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dailyViews.date" } },
          count: { $sum: "$dailyViews.count" },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get recent activity (combined news and comments)
    const recentNewsActivity = await News.find()
      .sort({ published_date: -1 })
      .limit(5)
      .select("title author published_date category")
      .lean()
      .then((news) =>
        news.map((item) => ({
          ...item,
          type: "news",
          date: item.published_date,
        })),
      )

    const recentCommentsActivity = await Comment.find()
      .sort({ date: -1 })
      .limit(5)
      .populate("newsId", "title")
      .lean()
      .then((comments) =>
        comments.map((item) => ({
          ...item,
          type: "comment",
          date: item.date,
        })),
      )

    const recentActivity = [...recentNewsActivity, ...recentCommentsActivity]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)

    return NextResponse.json(
      {
        totalNews,
        totalComments,
        totalAdmins,
        totalViews,
        newsByCategory,
        newsByCountry,
        newsByTags,
        recentNews,
        recentComments,
        topAuthors,
        topViewedArticles,
        viewsByCategory,
        viewsOverTime,
        recentActivity,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ message: "Error fetching dashboard stats", error: error.message }, { status: 500 })
  }
}
