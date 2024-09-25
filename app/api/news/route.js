// api/news/route.jsx
import connectMongoDB from "@/libs/DBconnect";
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

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const tags = searchParams.get('tags'); 
    const country = searchParams.get('country'); // New parameter for country

    await connectMongoDB();

    let news;

    if (tags) {
        news = await News.find({ tags });
    } else if (country) {
        news = await News.find({ country }); // Fetch news by country
    } else if (category) {
        news = await News.find({ category });
    } else {
        news = await News.find();
    }

    if (news.length > 0) {
        return NextResponse.json(news, { status: 200 });
    } else {
        return NextResponse.json({ message: "News not found" }, { status: 404 });
    }
}
