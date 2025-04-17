import connectMongoDB from "@/libs/DBconnect"
import News from "@/models/news"
import { NextResponse } from "next/server"

// Get a specific news article
export async function GET(req, { params }) {
  try {
    const { id } = params

    await connectMongoDB()

    const news = await News.findById(id)

    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 })
    }

    return NextResponse.json(news, { status: 200 })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ message: "Error fetching news", error: error.message }, { status: 500 })
  }
}

// Update a news article
export async function PUT(req, { params }) {
  try {
    const { id } = params
    const updatedData = await req.json()

    await connectMongoDB()

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { ...updatedData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!updatedNews) {
      return NextResponse.json({ message: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "News updated successfully", news: updatedNews }, { status: 200 })
  } catch (error) {
    console.error("Error updating news:", error)
    return NextResponse.json({ message: "Error updating news", error: error.message }, { status: 500 })
  }
}

// Delete a news article
export async function DELETE(req, { params }) {
  try {
    const { id } = params

    await connectMongoDB()

    const deletedNews = await News.findByIdAndDelete(id)

    if (!deletedNews) {
      return NextResponse.json({ message: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "News deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting news:", error)
    return NextResponse.json({ message: "Error deleting news", error: error.message }, { status: 500 })
  }
}
