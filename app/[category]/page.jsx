"use client"
import { useEffect, useState } from "react"
import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Filter, Calendar, User, Clock, ChevronDown, Tag } from "lucide-react"

export default function Page({ params }) {
  const category = params.category
  const [articles, setArticles] = useState([])
  const [visibleArticles, setVisibleArticles] = useState(8)
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState("newest") // newest, oldest, popular
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        let url
        if (["bangladesh", "international", "usa", "uk", "canada"].includes(category.toLowerCase())) {
          url = `/api/news?country=${category}`
        } else if (["football", "cricket", "trending", "feature"].includes(category.toLowerCase())) {
          url = `/api/news?tags=${category}`
        } else {
          url = `/api/news?category=${category}`
        }

        const response = await fetch(url)
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [category])

  const getSortedArticles = () => {
    const sorted = [...articles]

    switch (sortOrder) {
      case "oldest":
        return _.sortBy(sorted, "published_date")
      case "newest":
        return _.sortBy(sorted, "published_date").reverse()
      case "popular":
        // This is a placeholder - in a real app, you'd sort by view count or similar
        return _.shuffle(sorted)
      default:
        return _.sortBy(sorted, "published_date").reverse()
    }
  }

  const sortedArticles = getSortedArticles()

  const handleShowMore = () => {
    setVisibleArticles((prev) => prev + 8)
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const getCategoryIcon = () => {
    const iconMap = {
      business: "💼",
      politics: "🏛️",
      technology: "💻",
      sports: "🏆",
      entertainment: "🎬",
      health: "🏥",
      science: "🔬",
      environment: "🌍",
      education: "📚",
      lifestyle: "✨",
      trending: "📈",
      feature: "🔍",
      bangladesh: "🇧🇩",
      international: "🌐",
      football: "⚽",
      cricket: "🏏",
    }

    return iconMap[category.toLowerCase()] || "📰"
  }

  return (
    <motion.div
      className="max-w-screen-xl mx-auto p-5 fade-in"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-primary/20 to-primary/5 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="relative z-10 py-16 px-8 text-center">
          <motion.span
            className="text-5xl mb-4 inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, 0] }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            {getCategoryIcon()}
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl text-center text-foreground font-bold mb-4"
            variants={itemVariants}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.h1>
          <motion.p className="text-muted-foreground max-w-2xl mx-auto" variants={itemVariants}>
            Discover the latest news and updates from the world of {category.toLowerCase()}
          </motion.p>
        </div>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-card p-4 rounded-xl shadow-md"
        variants={itemVariants}
      >
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-foreground font-medium mr-2">{sortedArticles.length} articles found</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-4 py-2 rounded-lg transition-colors ${sortOrder === "newest" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-4 py-2 rounded-lg transition-colors ${sortOrder === "oldest" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
            >
              Oldest
            </button>
            <button
              onClick={() => setSortOrder("popular")}
              className={`px-4 py-2 rounded-lg transition-colors ${sortOrder === "popular" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
            >
              Popular
            </button>
          </div>
        </div>
      </motion.div>

      {showFilters && (
        <motion.div
          className="mb-8 p-4 bg-card rounded-xl shadow-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Date Range</label>
              <div className="flex gap-2">
                <input type="date" className="w-full p-2 rounded-lg bg-background border border-border" />
                <input type="date" className="w-full p-2 rounded-lg bg-background border border-border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Author</label>
              <input
                type="text"
                placeholder="Search by author"
                className="w-full p-2 rounded-lg bg-background border border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Tags</label>
              <input
                type="text"
                placeholder="Search by tags"
                className="w-full p-2 rounded-lg bg-background border border-border"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg mr-2">Apply Filters</button>
            <button
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
              onClick={() => setShowFilters(false)}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          ></motion.div>
          <p className="ml-4 text-lg text-foreground">Loading articles...</p>
        </div>
      ) : sortedArticles.length > 0 ? (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            variants={containerVariants}
          >
            {sortedArticles.slice(0, 6).map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={{
                    pathname: `/${item.category}/${item.title}`,
                    query: { id: item._id },
                  }}
                  className="flex flex-col h-full fancy-card group overflow-hidden"
                >
                  <div className="relative overflow-hidden h-48">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 z-20">
                      <span className="bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h1 className="text-card-foreground font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h1>
                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {item.content.substring(0, 120)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="tag-pill text-xs flex items-center">
                          <Tag size={12} className="mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-sm font-medium text-foreground flex items-center">
                        <User size={14} className="mr-1 text-primary" /> {item.author}
                      </p>
                      <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                        <Calendar size={12} className="mr-1" /> {format(new Date(item.published_date), "dd MMM, yyyy")}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Read full story <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
            {sortedArticles.slice(6, visibleArticles).map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={{
                    pathname: `/${item.category}/${item.title}`,
                    query: { id: item._id },
                  }}
                  className="flex flex-col sm:flex-row border-b border-border p-4 transition-all duration-300 hover:bg-primary/5 rounded-lg group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover h-48 sm:h-32 sm:w-32 w-full rounded-lg shadow-md mb-4 sm:mb-0 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center sm:ml-6 flex-grow">
                    <h1 className="text-foreground font-semibold text-xl mb-2 hover:text-primary transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </h1>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{item.content.substring(0, 120)}...</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="tag-pill text-xs flex items-center">
                          <Tag size={12} className="mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className="font-medium flex items-center">
                        <User size={14} className="mr-1 text-primary" /> {item.author}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1 text-primary" />{" "}
                        {format(new Date(item.published_date), "dd MMM, yyyy")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Read full story <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {visibleArticles < sortedArticles.length && (
            <div className="flex justify-center mt-10">
              <motion.button
                onClick={handleShowMore}
                className="fancy-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show More News
              </motion.button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center h-64 bg-card rounded-xl p-8 text-center shadow-lg"
          variants={itemVariants}
        >
          <svg
            className="w-16 h-16 text-muted-foreground mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-xl font-bold text-foreground mb-2">No Articles Found</h2>
          <p className="text-muted-foreground">
            We couldn't find any articles in this category. Please check back later.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
