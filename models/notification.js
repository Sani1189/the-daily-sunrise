import mongoose, { Schema } from "mongoose"

const notificationSchema = new Schema({
  type: {
    type: String,
    enum: ["news_created", "news_updated", "news_deleted", "comment_created", "comment_deleted", "user_registered"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  entityType: {
    type: String,
    enum: ["news", "comment", "user"],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
})

// Create indexes for efficient queries
notificationSchema.index({ createdAt: -1 })
notificationSchema.index({ isRead: 1 })
notificationSchema.index({ type: 1 })

const Notification = mongoose.models?.Notification || mongoose.model("Notification", notificationSchema)
export default Notification
