import connectMongoDB from "@/libs/DBconnect"
import Comment from "@/models/comment"
import { NextResponse } from "next/server"

// Get a specific comment
export async function GET(req, { params }) {
  try {
    const { id } = params

    await connectMongoDB()

    const comment = await Comment.findById(id).populate("newsId", "title")

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json(comment, { status: 200 })
  } catch (error) {
    console.error("Error fetching comment:", error)
    return NextResponse.json({ message: "Error fetching comment", error: error.message }, { status: 500 })
  }
}

// Update a comment
export async function PUT(req, { params }) {
  try {
    const { id } = params
    const updatedData = await req.json()

    await connectMongoDB()

    const updatedComment = await Comment.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })

    if (!updatedComment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Comment updated successfully", comment: updatedComment }, { status: 200 })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ message: "Error updating comment", error: error.message }, { status: 500 })
  }
}

// Delete a comment
export async function DELETE(req, { params }) {
  try {
    const { id } = params

    await connectMongoDB()

    const deletedComment = await Comment.findByIdAndDelete(id)

    if (!deletedComment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ message: "Error deleting comment", error: error.message }, { status: 500 })
  }
}
