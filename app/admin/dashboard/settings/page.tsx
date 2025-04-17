"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import {
  FaSave,
  FaGlobe,
  FaPalette,
  FaEnvelope,
  FaShareAlt,
  FaSearch,
  FaChartBar,
  FaCog,
  FaTrash,
  FaPlus,
} from "react-icons/fa"

export default function SettingsPage() {
  interface Setting {
    key: string;
    label: string;
    value: any;
    description: string;
    group: string;
    type: string;
    isPublic: boolean;
  }
  
  interface Settings {
    [group: string]: Setting[];
  }
  
  const [settings, setSettings] = useState<Settings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    label: "",
    description: "",
    group: "general",
    type: "string",
    isPublic: false,
  })
  const [showNewSettingForm, setShowNewSettingForm] = useState(false)

  // Define default settings
  const defaultSettings = {
    general: [
      {
        key: "site_name",
        label: "Site Name",
        value: "The Daily Sunrise",
        description: "The name of your website",
        group: "general",
        type: "string",
        isPublic: true,
      },
      {
        key: "site_description",
        label: "Site Description",
        value: "Your trusted source for daily news and updates",
        description: "A short description of your website",
        group: "general",
        type: "string",
        isPublic: true,
      },
      {
        key: "admin_email",
        label: "Admin Email",
        value: "admin@dailysunrise.com",
        description: "The main administrative email",
        group: "general",
        type: "string",
        isPublic: false,
      },
      {
        key: "articles_per_page",
        label: "Articles Per Page",
        value: "10",
        description: "Number of articles to display per page",
        group: "general",
        type: "number",
        isPublic: true,
      },
    ],
    appearance: [
      {
        key: "primary_color",
        label: "Primary Color",
        value: "#3b82f6",
        description: "The main color used throughout the site",
        group: "appearance",
        type: "color",
        isPublic: true,
      },
      {
        key: "secondary_color",
        label: "Secondary Color",
        value: "#10b981",
        description: "The secondary color used throughout the site",
        group: "appearance",
        type: "color",
        isPublic: true,
      },
      {
        key: "font_family",
        label: "Font Family",
        value: "Inter, system-ui, sans-serif",
        description: "The main font used throughout the site",
        group: "appearance",
        type: "string",
        isPublic: true,
      },
      {
        key: "dark_mode_default",
        label: "Dark Mode Default",
        value: false,
        description: "Set dark mode as the default theme",
        group: "appearance",
        type: "boolean",
        isPublic: true,
      },
    ],
    email: [
      {
        key: "smtp_host",
        label: "SMTP Host",
        value: "smtp.example.com",
        description: "SMTP server hostname",
        group: "email",
        type: "string",
        isPublic: false,
      },
      {
        key: "smtp_port",
        label: "SMTP Port",
        value: "587",
        description: "SMTP server port",
        group: "email",
        type: "number",
        isPublic: false,
      },
      {
        key: "smtp_user",
        label: "SMTP Username",
        value: "user@example.com",
        description: "SMTP authentication username",
        group: "email",
        type: "string",
        isPublic: false,
      },
      {
        key: "smtp_password",
        label: "SMTP Password",
        value: "********",
        description: "SMTP authentication password",
        group: "email",
        type: "string",
        isPublic: false,
      },
    ],
    social: [
      {
        key: "facebook_url",
        label: "Facebook URL",
        value: "https://facebook.com/dailysunrise",
        description: "Your Facebook page URL",
        group: "social",
        type: "string",
        isPublic: true,
      },
      {
        key: "twitter_url",
        label: "Twitter URL",
        value: "https://twitter.com/dailysunrise",
        description: "Your Twitter profile URL",
        group: "social",
        type: "string",
        isPublic: true,
      },
      {
        key: "instagram_url",
        label: "Instagram URL",
        value: "https://instagram.com/dailysunrise",
        description: "Your Instagram profile URL",
        group: "social",
        type: "string",
        isPublic: true,
      },
      {
        key: "youtube_url",
        label: "YouTube URL",
        value: "https://youtube.com/dailysunrise",
        description: "Your YouTube channel URL",
        group: "social",
        type: "string",
        isPublic: true,
      },
    ],
    seo: [
      {
        key: "meta_title",
        label: "Default Meta Title",
        value: "The Daily Sunrise - Latest News and Updates",
        description: "Default page title for SEO",
        group: "seo",
        type: "string",
        isPublic: true,
      },
      {
        key: "meta_description",
        label: "Default Meta Description",
        value: "Stay updated with the latest news, articles, and insights from The Daily Sunrise.",
        description: "Default meta description for SEO",
        group: "seo",
        type: "string",
        isPublic: true,
      },
      {
        key: "meta_keywords",
        label: "Default Meta Keywords",
        value: "news, daily news, updates, articles, journalism",
        description: "Default meta keywords for SEO",
        group: "seo",
        type: "string",
        isPublic: true,
      },
      {
        key: "google_analytics_id",
        label: "Google Analytics ID",
        value: "UA-XXXXXXXXX-X",
        description: "Your Google Analytics tracking ID",
        group: "seo",
        type: "string",
        isPublic: true,
      },
    ],
    analytics: [
      {
        key: "enable_analytics",
        label: "Enable Analytics",
        value: true,
        description: "Enable or disable analytics tracking",
        group: "analytics",
        type: "boolean",
        isPublic: true,
      },
      {
        key: "track_logged_in_users",
        label: "Track Logged In Users",
        value: false,
        description: "Whether to track logged in users",
        group: "analytics",
        type: "boolean",
        isPublic: false,
      },
      {
        key: "popular_articles_count",
        label: "Popular Articles Count",
        value: "5",
        description: "Number of popular articles to display",
        group: "analytics",
        type: "number",
        isPublic: true,
      },
    ],
    advanced: [
      {
        key: "maintenance_mode",
        label: "Maintenance Mode",
        value: false,
        description: "Put the site in maintenance mode",
        group: "advanced",
        type: "boolean",
        isPublic: true,
      },
      {
        key: "cache_ttl",
        label: "Cache TTL (seconds)",
        value: "3600",
        description: "Time to live for cached content in seconds",
        group: "advanced",
        type: "number",
        isPublic: false,
      },
      {
        key: "debug_mode",
        label: "Debug Mode",
        value: false,
        description: "Enable debug mode for development",
        group: "advanced",
        type: "boolean",
        isPublic: false,
      },
      {
        key: "custom_code_header",
        label: "Custom Code (Header)",
        value: "",
        description: "Custom code to be added to the header",
        group: "advanced",
        type: "string",
        isPublic: false,
      },
      {
        key: "custom_code_footer",
        label: "Custom Code (Footer)",
        value: "",
        description: "Custom code to be added to the footer",
        group: "advanced",
        type: "string",
        isPublic: false,
      },
    ],
  }

  // Update the fetchSettings function to use default settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)

        // In a real app, we would fetch from the API
        // For now, let's use our default settings
        setSettings(defaultSettings)
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSettingChange = (group:any, key:any, value:any) => {
    setSettings((prev) => ({
      ...prev,
      [group]: prev[group].map((setting) => (setting.key === key ? { ...setting, value } : setting)),
    }))
  }

  const handleSaveSettings = async (group:any) => {
    try {
      setIsSaving(true)

      // Get settings for the current group
      const groupSettings = settings[group] || []

      // Save each setting
      for (const setting of groupSettings) {
        const response = await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(setting),
        })

        if (!response.ok) {
          throw new Error(`Failed to save setting: ${setting.key}`)
        }
      }

      toast.success(`${group.charAt(0).toUpperCase() + group.slice(1)} settings saved successfully`)
    } catch (error) {
      console.error("Error saving settings:", error)
      if (error instanceof Error) {
        toast.error(error.message || "Failed to save settings")
      } else {
        toast.error("Failed to save settings")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSetting = async (group:any, key:any) => {
    if (!confirm(`Are you sure you want to delete the setting "${key}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/settings/${key}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Update local state
        setSettings((prev) => ({
          ...prev,
          [group]: prev[group].filter((setting) => setting.key !== key),
        }))

        toast.success("Setting deleted successfully")
      } else {
        throw new Error("Failed to delete setting")
      }
    } catch (error) {
      console.error("Error deleting setting:", error)
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete setting")
      } else {
        toast.error("Failed to delete setting")
      }
    }
  }

  const handleNewSettingChange = (field:any, value:any) => {
    setNewSetting((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddNewSetting = async (e:any) => {
    e.preventDefault()

    // Validate form
    if (!newSetting.key || !newSetting.label || newSetting.value === undefined) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSetting),
      })

      if (response.ok) {
        const { setting } = await response.json()

        // Update local state
        setSettings((prev) => ({
          ...prev,
          [setting.group]: [...(prev[setting.group] || []), setting],
        }))

        // Reset form
        setNewSetting({
          key: "",
          value: "",
          label: "",
          description: "",
          group: "general",
          type: "string",
          isPublic: false,
        })

        setShowNewSettingForm(false)
        toast.success("Setting added successfully")
      } else {
        throw new Error("Failed to add setting")
      }
    } catch (error) {
      console.error("Error adding setting:", error)
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add setting")
      } else {
        toast.error("Failed to add setting")
      }
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  // Tab configuration
  const tabs = [
    { id: "general", label: "General", icon: <FaGlobe /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
    { id: "email", label: "Email", icon: <FaEnvelope /> },
    { id: "social", label: "Social Media", icon: <FaShareAlt /> },
    { id: "seo", label: "SEO", icon: <FaSearch /> },
    { id: "analytics", label: "Analytics", icon: <FaChartBar /> },
    { id: "advanced", label: "Advanced", icon: <FaCog /> },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>

        <motion.button
          onClick={() => setShowNewSettingForm(!showNewSettingForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus />
          <span>Add Setting</span>
        </motion.button>
      </div>

      {/* New Setting Form */}
      {showNewSettingForm && (
        <motion.div
          className="bg-card rounded-xl shadow-sm p-6 border border-border"
          variants={itemVariants}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Add New Setting</h2>

          <form onSubmit={handleAddNewSetting} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="key" className="block text-sm font-medium text-foreground">
                  Key <span className="text-destructive">*</span>
                </label>
                <input
                  id="key"
                  type="text"
                  value={newSetting.key}
                  onChange={(e) => handleNewSettingChange("key", e.target.value)}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="setting_key"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="label" className="block text-sm font-medium text-foreground">
                  Label <span className="text-destructive">*</span>
                </label>
                <input
                  id="label"
                  type="text"
                  value={newSetting.label}
                  onChange={(e) => handleNewSettingChange("label", e.target.value)}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Setting Label"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="value" className="block text-sm font-medium text-foreground">
                  Value <span className="text-destructive">*</span>
                </label>
                <input
                  id="value"
                  type="text"
                  value={newSetting.value}
                  onChange={(e) => handleNewSettingChange("value", e.target.value)}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Setting Value"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="group" className="block text-sm font-medium text-foreground">
                  Group
                </label>
                <select
                  id="group"
                  value={newSetting.group}
                  onChange={(e) => handleNewSettingChange("group", e.target.value)}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="general">General</option>
                  <option value="appearance">Appearance</option>
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="seo">SEO</option>
                  <option value="analytics">Analytics</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-foreground">
                  Type
                </label>
                <select
                  id="type"
                  value={newSetting.type}
                  onChange={(e) => handleNewSettingChange("type", e.target.value)}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="json">JSON</option>
                  <option value="array">Array</option>
                  <option value="color">Color</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={newSetting.description}
                  onChange={(e) => handleNewSettingChange("description", e.target.value)}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Setting description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={newSetting.isPublic}
                  onChange={(e) => handleNewSettingChange("isPublic", e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-foreground">
                  Public Setting (accessible without authentication)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowNewSettingForm(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Setting
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <motion.div
          className="md:w-64 bg-card rounded-xl shadow-sm border border-border overflow-hidden"
          variants={itemVariants}
        >
          <nav className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left mb-1 transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div className="flex-1 bg-card rounded-xl shadow-sm border border-border p-6" variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground capitalize">{activeTab} Settings</h2>

            <motion.button
              onClick={() => handleSaveSettings(activeTab)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Save Settings</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Settings Form */}
          <div className="space-y-6">
            {settings[activeTab] && settings[activeTab].length > 0 ? (
              settings[activeTab].map((setting) => (
                <div key={setting.key} className="bg-background p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <label htmlFor={setting.key} className="block text-sm font-medium text-foreground">
                      {setting.label}
                      {setting.isPublic && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">Public</span>
                      )}
                    </label>
                    <button
                      onClick={() => handleDeleteSetting(activeTab, setting.key)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  {setting.description && <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>}

                  {setting.type === "boolean" ? (
                    <div className="flex items-center">
                      <input
                        id={setting.key}
                        type="checkbox"
                        checked={setting.value === true || setting.value === "true"}
                        onChange={(e) => handleSettingChange(activeTab, setting.key, e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                      />
                      <label htmlFor={setting.key} className="ml-2 text-sm text-foreground">
                        {setting.value === true || setting.value === "true" ? "Enabled" : "Disabled"}
                      </label>
                    </div>
                  ) : setting.type === "number" ? (
                    <input
                      id={setting.key}
                      type="number"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(activeTab, setting.key, e.target.value)}
                      className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                  ) : setting.type === "color" ? (
                    <div className="flex items-center gap-2">
                      <input
                        id={setting.key}
                        type="color"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(activeTab, setting.key, e.target.value)}
                        className="h-8 w-8 rounded border border-input"
                      />
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(activeTab, setting.key, e.target.value)}
                        className="flex-1 p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      />
                    </div>
                  ) : setting.type === "json" || setting.type === "array" ? (
                    <textarea
                      id={setting.key}
                      value={typeof setting.value === "object" ? JSON.stringify(setting.value, null, 2) : setting.value}
                      onChange={(e) => {
                        try {
                          // Try to parse as JSON
                          const parsedValue = JSON.parse(e.target.value)
                          handleSettingChange(activeTab, setting.key, parsedValue)
                        } catch {
                          // If not valid JSON, store as string
                          handleSettingChange(activeTab, setting.key, e.target.value)
                        }
                      }}
                      rows={5}
                      className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors font-mono text-sm"
                    />
                  ) : (
                    <input
                      id={setting.key}
                      type="text"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(activeTab, setting.key, e.target.value)}
                      className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No settings found for this category.</p>
                <button
                  onClick={() => {
                    setNewSetting((prev) => ({ ...prev, group: activeTab }))
                    setShowNewSettingForm(true)
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add {activeTab} Setting
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
