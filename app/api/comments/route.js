import connectMongoDB from "@/libs/DBconnect";
import Comment from "@/models/comment"; // Ensure correct path and import
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { newsId, name, email, comment, date } = await req.json();
        await connectMongoDB();
        await Comment.create({
            newsId,
            name,
            email,
            comment,
            date
        });
        return NextResponse.json({ message: "Comment posted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error posting comment:", error);
        return NextResponse.json({ message: "Error posting comment" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectMongoDB();
        const url = new URL(req.url);
        const newsId = url.searchParams.get('newsId');

        if (!newsId) {
            return NextResponse.json({ message: "newsId query parameter is required" }, { status: 400 });
        }

        const comments = await Comment.find({ newsId }).sort({ date: -1 }); // Sort comments by date descending
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ message: "Error fetching comments" }, { status: 500 });
    }
}
