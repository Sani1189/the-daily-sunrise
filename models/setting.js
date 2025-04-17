import mongoose, { Schema } from "mongoose"

const settingSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
  group: {
    type: String,
    enum: ["general", "appearance", "email", "social", "seo", "analytics", "advanced"],
    default: "general",
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ["string", "number", "boolean", "json", "array", "color"],
    default: "string",
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
})

// Create indexes for efficient queries
settingSchema.index({ key: 1 })
settingSchema.index({ group: 1 })
settingSchema.index({ isPublic: 1 })

const Setting = mongoose.models?.Setting || mongoose.model("Setting", settingSchema)
export default Setting
