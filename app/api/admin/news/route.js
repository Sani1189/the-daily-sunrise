import connectMongoDB from "@/libs/DBconnect"
import News from "@/models/news"
import Notification from "@/models/notification"
import { NextResponse } from "next/server"
import { getAdminFromToken } from "@/libs/auth"

// Get all news with pagination and advanced filtering
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const category = searchParams.get("category")
    const country = searchParams.get("country")
    const author = searchParams.get("author")
    const tag = searchParams.get("tag")
    const searchQuery = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "published_date"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const skip = (page - 1) * limit

    await connectMongoDB()

    const query = {}

    if (category) {
      query.category = category
    }

    if (country) {
      query.country = country
    }

    if (author) {
      query.author = author
    }

    if (tag) {
      query.tags = tag
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
      ]
    }

    // Date range filtering
    if (startDate || endDate) {
      query.published_date = {}

      if (startDate) {
        query.published_date.$gte = new Date(startDate)
      }

      if (endDate) {
        const endDateObj = new Date(endDate)
        endDateObj.setHours(23, 59, 59, 999) // Set to end of day
        query.published_date.$lte = endDateObj
      }
    }

    // Prepare sort options
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    const totalNews = await News.countDocuments(query)
    const news = await News.find(query).sort(sortOptions).skip(skip).limit(limit)

    return NextResponse.json(
      {
        news,
        pagination: {
          total: totalNews,
          page,
          limit,
          pages: Math.ceil(totalNews / limit),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ message: "Error fetching news", error: error.message }, { status: 500 })
  }
}

// Create a new news article
export async function POST(req) {
  try {
    const admin = await getAdminFromToken(req)
    const newsData = await req.json()

    await connectMongoDB()

    // Generate a unique ID
    const lastNews = await News.findOne().sort({ id: -1 })
    const newId = lastNews ? lastNews.id + 1 : 1

    // Set published date if not provided
    if (!newsData.published_date) {
      newsData.published_date = new Date()
    }

    const newNews = await News.create({
      ...newsData,
      id: newId,
    })

    // Create notification
    await Notification.create({
      type: "news_created",
      title: "New Article Published",
      message: `A new article "${newNews.title}" has been published.`,
      entityId: newNews._id,
      entityType: "news",
      createdBy: admin?.id,
    })

    return NextResponse.json({ message: "News created successfully", news: newNews }, { status: 201 })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ message: "Error creating news", error: error.message }, { status: 500 })
  }
}
