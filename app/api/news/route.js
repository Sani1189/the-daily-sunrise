import connectMongoDB  from "@/libs/DBconnect";
import News from "@/models/news";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { id, title, author, published_date, content, country, category, image_url, tags } = await req.json();
        await connectMongoDB();
        await News.create({
            id,
            title,
            author,
            published_date,
            content,
            country,
            category,
            image_url,
            tags
        });
        return NextResponse.json({ message: "News created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error creating news:", error);
        return NextResponse.json({ message: "Error creating news" }, { status: 500 });
    }
}

export async function GET(){
    await connectMongoDB();
    const news = await News.find();
    return NextResponse.json(news, { status: 200 });
}
export const fetchNewsById = async (id) => {
    try {
      const response = await fetch(`/api/news/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching news item:', error);
      return null;
    }
  }
  