import connectMongoDB from "@/libs/DBconnect"
import News from "@/models/news"
import { NextResponse } from "next/server"

// Get all news with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const category = searchParams.get("category")
    const country = searchParams.get("country")
    const searchQuery = searchParams.get("search")

    const skip = (page - 1) * limit

    await connectMongoDB()

    const query = {}

    if (category) {
      query.category = category
    }

    if (country) {
      query.country = country
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
      ]
    }

    const totalNews = await News.countDocuments(query)
    const news = await News.find(query).sort({ published_date: -1 }).skip(skip).limit(limit)

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

    return NextResponse.json({ message: "News created successfully", news: newNews }, { status: 201 })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ message: "Error creating news", error: error.message }, { status: 500 })
  }
}
