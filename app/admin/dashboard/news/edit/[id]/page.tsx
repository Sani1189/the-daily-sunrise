"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaSave, FaTimes, FaImage, FaTag, FaPlus, FaEye, FaChartLine } from "react-icons/fa"
import { toast } from "react-hot-toast"

export default function EditNews({ params }) {
  const { id } = params
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    country: "",
    category: "",
    image_url: "",
    tags: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [viewStats, setViewStats] = useState(null)
  const [showViewStats, setShowViewStats] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchNewsArticle = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/news/${id}`)

        if (response.ok) {
          const data = await response.json()
          setFormData({
            title: data.title || "",
            author: data.author || "",
            content: data.content || "",
            country: data.country || "",
            category: data.category || "",
            image_url: data.image_url || "",
            tags: data.tags || [],
          })
        } else {
          throw new Error("Failed to fetch article")
        }
      } catch (error) {
        console.error("Error fetching article:", error)
        toast.error("Failed to load article")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNewsArticle()
  }, [id])

  const fetchViewStats = async () => {
    try {
      const response = await fetch(`/api/views?newsId=${id}`)

      if (response.ok) {
        const data = await response.json()
        setViewStats(data)
        setShowViewStats(true)
      } else {
        throw new Error("Failed to fetch view statistics")
      }
    } catch (error) {
      console.error("Error fetching view statistics:", error)
      toast.error("Failed to load view statistics")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.author || !formData.content || !formData.image_url) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update article")
      }

      toast.success("Article updated successfully")
      router.push("/admin/dashboard/news")
    } catch (error) {
      console.error("Error updating article:", error)
      toast.error(error.message || "Failed to update article")
    } finally {
      setIsSubmitting(false)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground">Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Article</h1>

        <div className="flex gap-2">
          <Link href="/admin/dashboard/news">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTimes />
              <span>Cancel</span>
            </motion.button>
          </Link>

          <motion.button
            onClick={() => {
              if (showViewStats) {
                setShowViewStats(false)
              } else {
                fetchViewStats()
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaChartLine />
            <span>{showViewStats ? "Hide Stats" : "View Stats"}</span>
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
                <span>Save Article</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* View Stats */}
      {showViewStats && viewStats && (
        <motion.div
          className="bg-card rounded-xl shadow-sm p-6 border border-border"
          variants={itemVariants}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground">View Statistics</h2>
            <button
              onClick={() => setShowViewStats(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold text-foreground">{viewStats.viewCount}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
              <p className="text-2xl font-bold text-foreground">{viewStats.uniqueVisitors}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Last View</p>
              <p className="text-lg font-bold text-foreground">{new Date(viewStats.lastUpdated).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Daily Views (Last 7 Days)</h3>
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="grid grid-cols-7 gap-2">
                  {viewStats.periodData.daily?.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-primary/20 w-full"
                        style={{
                          height: `${Math.max(20, (day.count / Math.max(...viewStats.periodData.daily.map((d) => d.count))) * 100)}px`,
                        }}
                      ></div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
                      </p>
                      <p className="text-xs font-medium">{day.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Monthly Views</h3>
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="grid grid-cols-6 gap-2">
                  {viewStats.periodData.monthly?.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-primary/20 w-full"
                        style={{
                          height: `${Math.max(20, (month.count / Math.max(...viewStats.periodData.monthly.map((m) => m.count))) * 100)}px`,
                        }}
                      ></div>
                      <p className="text-xs text-muted-foreground mt-1">{month.month}</p>
                      <p className="text-xs font-medium">{month.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form
        className="bg-card rounded-xl shadow-sm p-6 border border-border"
        variants={itemVariants}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter article title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="author" className="block text-sm font-medium text-foreground">
              Author <span className="text-destructive">*</span>
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-foreground">
              Category <span className="text-destructive">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            >
              <option value="">Select Category</option>
              <option value="politics">Politics</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="science">Science</option>
              <option value="environment">Environment</option>
              <option value="education">Education</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="opinion">Opinion</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-foreground">
              Country <span className="text-destructive">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            >
              <option value="">Select Country</option>
              <option value="bangladesh">Bangladesh</option>
              <option value="international">International</option>
              <option value="usa">USA</option>
              <option value="uk">UK</option>
              <option value="canada">Canada</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="image_url" className="block text-sm font-medium text-foreground">
              Image URL <span className="text-destructive">*</span>
            </label>
            <div className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="text-muted-foreground" />
                </div>
                <input
                  id="image_url"
                  name="image_url"
                  type="text"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter image URL"
                  required
                />
              </div>
              <Link href={formData.image_url} target="_blank" className="ml-2">
                <button
                  type="button"
                  className="p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <FaEye />
                </button>
              </Link>
            </div>
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url || "/placeholder.svg"}
                  alt="Preview"
                  className="h-20 object-cover rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Tags</label>
            <div className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="pl-10 w-full p-3 bg-background border border-input rounded-l-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Add a tag"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-primary hover:text-destructive transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-foreground">
            Content <span className="text-destructive">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            placeholder="Enter article content"
            rows={12}
            required
          />
        </div>
      </motion.form>
    </motion.div>
  )
}
