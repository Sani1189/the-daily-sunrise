import mongoose, { Schema } from "mongoose"

const viewSchema = new Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "News",
    required: true,
  },
  viewCount: {
    type: Number,
    default: 1,
  },
  uniqueVisitors: {
    type: [String], // Store IP addresses or user IDs
    default: [],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  dailyViews: [
    {
      date: {
        type: Date,
        required: true,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
  weeklyViews: [
    {
      week: {
        type: String, // Format: YYYY-WW
        required: true,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
  monthlyViews: [
    {
      month: {
        type: String, // Format: YYYY-MM
        required: true,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
})

// Create a compound index for efficient queries
viewSchema.index({ newsId: 1 })

const View = mongoose.models?.View || mongoose.model("View", viewSchema)
export default View
