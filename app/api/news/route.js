// api/news/route.jsx
import connectMongoDB from "@/libs/DBconnect"
import News from "@/models/news"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { id, title, author, published_date, content, country, category, image_url, tags } = await req.json()
    await connectMongoDB()
    await News.create({
      id,
      title,
      author,
      published_date,
      content,
      country,
      category,
      image_url,
      tags,
    })
    return NextResponse.json({ message: "News created successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ message: "Error creating news" }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const tags = searchParams.get("tags")
    const country = searchParams.get("country")
    const searchQuery = searchParams.get("searchQuery")

    await connectMongoDB()

    const query = {}

    if (tags) {
      query.tags = tags
    }
    if (country) {
      query.country = country
    }
    if (category) {
      query.category = category
    }
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ]
    }

    const news = await News.find(query)

    if (news.length > 0) {
      return NextResponse.json(news, { status: 200 })
    } else {
      return NextResponse.json({ message: "News not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ message: "Error fetching news" }, { status: 500 })
  }
}
