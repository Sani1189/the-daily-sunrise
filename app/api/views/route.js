import connectMongoDB from "@/libs/DBconnect"
import View from "@/models/view"
import News from "@/models/news"
import { NextResponse } from "next/server"

// Track a view for a news article
export async function POST(req) {
  try {
    const { newsId, visitorId } = await req.json()

    if (!newsId) {
      return NextResponse.json({ message: "News ID is required" }, { status: 400 })
    }

    await connectMongoDB()

    // Check if the news article exists
    const newsExists = await News.findById(newsId)
    if (!newsExists) {
      return NextResponse.json({ message: "News article not found" }, { status: 404 })
    }

    // Get current date information
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

    // Calculate week number (ISO week)
    const getWeekNumber = (d) => {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
      const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
      return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`
    }
    const currentWeek = getWeekNumber(now)

    // Find or create view record
    let viewRecord = await View.findOne({ newsId })

    if (!viewRecord) {
      // Create new view record
      viewRecord = new View({
        newsId,
        viewCount: 1,
        uniqueVisitors: visitorId ? [visitorId] : [],
        dailyViews: [{ date: today, count: 1 }],
        weeklyViews: [{ week: currentWeek, count: 1 }],
        monthlyViews: [{ month: currentMonth, count: 1 }],
      })
    } else {
      // Update existing view record
      viewRecord.viewCount += 1

      // Add unique visitor if provided and not already counted
      if (visitorId && !viewRecord.uniqueVisitors.includes(visitorId)) {
        viewRecord.uniqueVisitors.push(visitorId)
      }

      // Update daily views
      const dailyViewIndex = viewRecord.dailyViews.findIndex(
        (dv) => dv.date.toISOString().split("T")[0] === today.toISOString().split("T")[0],
      )

      if (dailyViewIndex >= 0) {
        viewRecord.dailyViews[dailyViewIndex].count += 1
      } else {
        viewRecord.dailyViews.push({ date: today, count: 1 })
      }

      // Update weekly views
      const weeklyViewIndex = viewRecord.weeklyViews.findIndex((wv) => wv.week === currentWeek)

      if (weeklyViewIndex >= 0) {
        viewRecord.weeklyViews[weeklyViewIndex].count += 1
      } else {
        viewRecord.weeklyViews.push({ week: currentWeek, count: 1 })
      }

      // Update monthly views
      const monthlyViewIndex = viewRecord.monthlyViews.findIndex((mv) => mv.month === currentMonth)

      if (monthlyViewIndex >= 0) {
        viewRecord.monthlyViews[monthlyViewIndex].count += 1
      } else {
        viewRecord.monthlyViews.push({ month: currentMonth, count: 1 })
      }

      viewRecord.lastUpdated = now
    }

    await viewRecord.save()

    return NextResponse.json({ message: "View tracked successfully", viewCount: viewRecord.viewCount }, { status: 200 })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json({ message: "Error tracking view", error: error.message }, { status: 500 })
  }
}

// Get view statistics for a news article or all articles
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const newsId = searchParams.get("newsId")
    const period = searchParams.get("period") || "all" // all, daily, weekly, monthly
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    await connectMongoDB()

    const query = {}
    if (newsId) {
      query.newsId = newsId
    }

    // Get view statistics
    let viewStats

    if (newsId) {
      // Get statistics for a specific article
      viewStats = await View.findOne(query).populate("newsId", "title")

      if (!viewStats) {
        return NextResponse.json({ message: "No view statistics found" }, { status: 404 })
      }

      // Format response based on period
      let periodData
      switch (period) {
        case "daily":
          periodData = viewStats.dailyViews.sort((a, b) => b.date - a.date).slice(0, limit)
          break
        case "weekly":
          periodData = viewStats.weeklyViews.sort((a, b) => b.week.localeCompare(a.week)).slice(0, limit)
          break
        case "monthly":
          periodData = viewStats.monthlyViews.sort((a, b) => b.month.localeCompare(a.month)).slice(0, limit)
          break
        default:
          periodData = {
            daily: viewStats.dailyViews.sort((a, b) => b.date - a.date).slice(0, limit),
            weekly: viewStats.weeklyViews.sort((a, b) => b.week.localeCompare(a.week)).slice(0, limit),
            monthly: viewStats.monthlyViews.sort((a, b) => b.month.localeCompare(a.month)).slice(0, limit),
          }
      }

      return NextResponse.json(
        {
          newsId: viewStats.newsId,
          title: viewStats.newsId?.title,
          viewCount: viewStats.viewCount,
          uniqueVisitors: viewStats.uniqueVisitors.length,
          lastUpdated: viewStats.lastUpdated,
          periodData,
        },
        { status: 200 },
      )
    } else {
      // Get top viewed articles
      const topViews = await View.find()
        .sort({ viewCount: -1 })
        .limit(limit)
        .populate("newsId", "title category author published_date")

      // Get total views across all articles
      const totalViews = await View.aggregate([{ $group: { _id: null, total: { $sum: "$viewCount" } } }])

      // Get views by category
      const viewsByCategory = await View.aggregate([
        { $lookup: { from: "news", localField: "newsId", foreignField: "_id", as: "newsDetails" } },
        { $unwind: "$newsDetails" },
        { $group: { _id: "$newsDetails.category", count: { $sum: "$viewCount" } } },
        { $sort: { count: -1 } },
      ])

      // Get views by country
      const viewsByCountry = await View.aggregate([
        { $lookup: { from: "news", localField: "newsId", foreignField: "_id", as: "newsDetails" } },
        { $unwind: "$newsDetails" },
        { $group: { _id: "$newsDetails.country", count: { $sum: "$viewCount" } } },
        { $sort: { count: -1 } },
      ])

      // Get views over time (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

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

      return NextResponse.json(
        {
          totalViews: totalViews.length > 0 ? totalViews[0].total : 0,
          topViews,
          viewsByCategory,
          viewsByCountry,
          viewsOverTime,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error getting view statistics:", error)
    return NextResponse.json({ message: "Error getting view statistics", error: error.message }, { status: 500 })
  }
}
