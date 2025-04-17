import connectMongoDB from "@/libs/DBconnect"
import Setting from "@/models/setting"
import { NextResponse } from "next/server"
import { getAdminFromToken } from "@/libs/auth"

// Create or update a setting
export async function POST(req) {
  try {
    const admin = await getAdminFromToken(req)

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { key, value, group, label, description, type, isPublic } = await req.json()

    if (!key || value === undefined || !label) {
      return NextResponse.json({ message: "Key, value, and label are required" }, { status: 400 })
    }

    await connectMongoDB()

    // Check if setting already exists
    const existingSetting = await Setting.findOne({ key })

    if (existingSetting) {
      // Update existing setting
      existingSetting.value = value
      existingSetting.group = group || existingSetting.group
      existingSetting.label = label
      existingSetting.description = description || existingSetting.description
      existingSetting.type = type || existingSetting.type
      existingSetting.isPublic = isPublic !== undefined ? isPublic : existingSetting.isPublic
      existingSetting.updatedAt = new Date()
      existingSetting.updatedBy = admin.id

      await existingSetting.save()

      return NextResponse.json({ message: "Setting updated successfully", setting: existingSetting }, { status: 200 })
    } else {
      // Create new setting
      const newSetting = await Setting.create({
        key,
        value,
        group: group || "general",
        label,
        description,
        type: type || "string",
        isPublic: isPublic !== undefined ? isPublic : false,
        updatedBy: admin.id,
      })

      return NextResponse.json({ message: "Setting created successfully", setting: newSetting }, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating/updating setting:", error)
    return NextResponse.json({ message: "Error creating/updating setting", error: error.message }, { status: 500 })
  }
}

// Get settings
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get("key")
    const group = searchParams.get("group")
    const isPublic = searchParams.get("isPublic")

    await connectMongoDB()

    // Build query
    const query = {}
    if (key) query.key = key
    if (group) query.group = group
    if (isPublic !== null && isPublic !== undefined) query.isPublic = isPublic === "true"

    // If requesting a specific key
    if (key) {
      const setting = await Setting.findOne(query)

      if (!setting) {
        return NextResponse.json({ message: "Setting not found" }, { status: 404 })
      }

      return NextResponse.json(setting, { status: 200 })
    }

    // Get settings
    const settings = await Setting.find(query).sort({ group: 1, key: 1 })

    // Group settings by group if requested
    if (searchParams.get("groupBy") === "group") {
      const groupedSettings = {}

      settings.forEach((setting) => {
        if (!groupedSettings[setting.group]) {
          groupedSettings[setting.group] = []
        }
        groupedSettings[setting.group].push(setting)
      })

      return NextResponse.json(groupedSettings, { status: 200 })
    }

    return NextResponse.json(settings, { status: 200 })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ message: "Error fetching settings", error: error.message }, { status: 500 })
  }
}
