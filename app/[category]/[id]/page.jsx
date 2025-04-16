"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FaFacebook,
  FaInstagram,
  FaUserCircle,
  FaRegUser,
  FaUserAlt,
  FaRegClock,
  FaRegCalendarAlt,
  FaTag,
  FaLink,
  FaRegBookmark,
  FaBookmark,
  FaUser,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { motion, AnimatePresence } from "framer-motion"

const timeAgo = (date) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diffInSeconds = Math.floor((now - commentDate) / 1000)

  const units = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ]

  for (const { unit, seconds } of units) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`
    }
  }
  return "just now"
}

const NewsPage = ({ params, searchParams }) => {
  const category = params.category
  const id = searchParams.id
  const [news, setNews] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [formError, setFormError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareTooltip, setShowShareTooltip] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let fetchUrl
        if (category === "trending" || category === "feature") {
          fetchUrl = `/api/news?tags=${category}`
        } else {
          fetchUrl = `/api/news?category=${category}`
        }

        const response = await fetch(fetchUrl)
        if (!response.ok) {
          throw new Error("News not found")
        }
        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error("Error fetching news:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?newsId=${id}`)
        if (!response.ok) {
          throw new Error("Comments not found")
        }
        const data = await response.json()
        setComments(data)
      } catch (error) {
        setError(error.message)
      }
    }

    // Check if article is bookmarked
    const checkBookmark = () => {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
      setIsBookmarked(bookmarks.includes(id))
    }

    // Reading progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    fetchNews()
    fetchComments()
    checkBookmark()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [category, id])

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== id)
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks))
    } else {
      bookmarks.push(id)
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    }
    setIsBookmarked(!isBookmarked)
  }

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareTooltip(true)
    setTimeout(() => setShowShareTooltip(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading article...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Content</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/" className="fancy-button">
          Return to Homepage
        </Link>
      </div>
    )
  }

  const mainNews = news.find((news) => news._id === id)
  const otherNews = news.filter((news) => news._id !== id)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simple form validation
    if (!name || !email || !comment) {
      setFormError("All fields are required.")
      setIsSubmitting(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email.")
      setIsSubmitting(false)
      return
    }

    setFormError("")

    // Create the comment object
    const commentData = {
      newsId: id,
      name,
      email,
      comment,
      date: new Date().toISOString(),
    }

    // Send the comment to the backend
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      })

      if (response.ok) {
        setSuccessMessage("Comment posted successfully.")
        setName("")
        setEmail("")
        setComment("")
        // Refresh comments after posting
        const updatedComments = await fetch(`/api/comments?newsId=${id}`).then((res) => res.json())
        setComments(updatedComments)
      } else {
        setFormError("Failed to post the comment. Try again later.")
      }
    } catch (err) {
      setFormError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const concatenatedContent = mainNews ? mainNews.content + "\n" + generateContent() : ""
  const firstSplitIndex = Math.ceil(concatenatedContent.length / 3)
  const secondSplitIndex = firstSplitIndex * 2
  const firstPart = concatenatedContent.slice(0, firstSplitIndex)
  const secondPart = concatenatedContent.slice(firstSplitIndex, secondSplitIndex)
  const thirdPart = concatenatedContent.slice(secondSplitIndex)

  const toUpperCaseFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
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

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <motion.div
        className="flex flex-col md:flex-row gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="md:w-2/3" variants={itemVariants}>
          {/* Country and Category */}
          <div className="flex justify-start ml-1 mb-4">
            <Link
              href={`/${mainNews.country}`}
              className="text-2xl text-gray-700 font-bold hover:text-blue-700 transition-colors duration-300 fancy-underline"
            >
              {toUpperCaseFirst(mainNews.country)}
            </Link>
            <p className="text-xl text-gray-800 font-bold px-2">|</p>
            <Link
              href={`/${category}`}
              className="text-2xl text-gray-700 font-bold hover:text-blue-700 transition-colors duration-300 fancy-underline"
            >
              {toUpperCaseFirst(category)}
            </Link>
          </div>
          {mainNews && (
            <motion.div className="fancy-card p-6 md:p-8 bg-white relative" variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight gradient-text">
                {mainNews.title}
              </h1>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white mr-3 shadow-md">
                    {mainNews.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{mainNews.author}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaRegCalendarAlt className="mr-1 text-blue-500" />
                      <time dateTime={mainNews.published_date}>
                        {new Date(mainNews.published_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyLinkToClipboard}
                    className="p-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors duration-300 relative"
                    aria-label="Copy link"
                  >
                    <FaLink size={20} />
                    <AnimatePresence>
                      {showShareTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap"
                        >
                          Link copied!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300"
                    aria-label="Share on Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href={`https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                    className="p-2 bg-gray-100 text-black rounded-full hover:bg-gray-200 transition-colors duration-300"
                    aria-label="Share on Twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter size={20} />
                  </a>
                  <a
                    href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`}
                    className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors duration-300"
                    aria-label="Share on Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isBookmarked ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600"
                    }`}
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
                  >
                    {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                  </button>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl mb-6 shadow-md">
                <img
                  src={mainNews.image_url || "/placeholder.svg"}
                  alt={mainNews.title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full h-16 opacity-60"></div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {mainNews.tags.map((tag, index) => (
                  <Link href={`/tag/${tag}`} key={index}>
                    <span className="tag-pill">
                      <FaTag className="mr-1" /> {tag}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="text-lg text-gray-700 leading-relaxed space-y-6 whitespace-pre-line">
                <p>{firstPart}</p>
                {/* Advertisement */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 my-8 rounded-lg shadow-md shine-effect">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
                  <div className="flex justify-center items-center h-32 bg-white rounded-lg border border-gray-300 shadow-inner">
                    <span className="text-gray-500">Ad space</span>
                  </div>
                </div>
                <p>{secondPart}</p>
                {/* Advertisement */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 my-8 rounded-lg shadow-md shine-effect">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
                  <div className="flex justify-center items-center h-32 bg-white rounded-lg border border-gray-300 shadow-inner">
                    <span className="text-gray-500">Ad space</span>
                  </div>
                </div>
                <p>{thirdPart}</p>
              </div>
            </motion.div>
          )}

          {/* Comments Section */}
          <motion.div
            className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 mt-8 rounded-xl shadow-xl"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 pb-2 border-blue-500 relative gradient-text">
              Latest Comments
              <span className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-2 py-1 rounded-full">
                {comments.length}
              </span>
            </h2>
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 italic mb-4">No comments yet. Be the first to share your thoughts!</p>
                <div className="mt-4">
                  <a href="#comment-form" className="inline-flex items-center px-4 py-2 fancy-button">
                    Add a Comment
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-start space-x-4 py-6 ${index < 3 ? "bg-gradient-to-r from-blue-50 to-white" : "bg-white"} rounded-lg shadow-md px-6 mb-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 fancy-card`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Random icons for the latest three comments */}
                    {index === 0 && <FaUserCircle className="w-10 h-10 text-blue-600" />}
                    {index === 1 && <FaRegUser className="w-10 h-10 text-green-500" />}
                    {index === 2 && <FaUserAlt className="w-10 h-10 text-purple-500" />}
                    {index > 2 && <FaUserCircle className="w-10 h-10 text-gray-500" />}

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold gradient-text text-lg">{comment.name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaRegClock className="mr-1" />
                          {timeAgo(comment.date)}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-2 text-md leading-relaxed">{comment.comment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Comment Form */}
          <motion.div id="comment-form" className="fancy-card p-8 mt-8 bg-white" variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block gradient-text">
              Leave a Comment
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="comment">
                  Comment
                </label>
                <textarea
                  id="comment"
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 min-h-[150px]"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  required
                ></textarea>
              </div>

              {formError && (
                <motion.div
                  className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formError}
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {successMessage}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`fancy-button ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Submitting...
                  </span>
                ) : (
                  "Submit Comment"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Other news section */}
        <motion.div className="md:w-1/3" variants={itemVariants}>
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block gradient-text">
              More in {toUpperCaseFirst(category)}
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></span>
            </h2>
            <div className="space-y-6">
              {otherNews.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item._id}
                  className="fancy-card bg-white transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={{ pathname: `/${category}/${item.title}`, query: { id: item._id } }} className="block">
                    <div className="flex flex-col sm:flex-row md:flex-col gap-4">
                      <div className="overflow-hidden rounded-t-xl md:rounded-t-xl md:rounded-b-none">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full sm:w-1/3 md:w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 flex items-center">
                          <FaUser className="mr-1 text-blue-500" /> {item.author} •{" "}
                          <FaRegCalendarAlt className="mx-1 text-blue-500" />
                          {new Date(item.published_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.content.slice(0, 120)}...</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.slice(0, 2).map((tag, idx) => (
                            <Link href={`/tag/${tag}`} key={idx}>
                              <span className="tag-pill text-xs">#{tag}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Advertisement */}
            <motion.div
              className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 mt-8 rounded-xl shadow-md shine-effect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
              <div className="h-64 bg-white flex items-center justify-center rounded-lg border border-gray-300 shadow-inner">
                <span className="text-gray-500">Ad Space</span>
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              className="fancy-card p-6 mt-8 bg-gradient-to-r from-blue-600 to-purple-700 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p className="mb-4 text-blue-100">Subscribe to our newsletter for the latest news and updates.</p>
              <form className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300"
                >
                  Subscribe Now
                </button>
              </form>
            </motion.div>

            {/* Tags Cloud */}
            <motion.div
              className="fancy-card p-6 mt-8 bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800 relative inline-block gradient-text">
                Popular Tags
                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></span>
              </h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {Array.from(new Set(news.flatMap((item) => item.tags)))
                  .slice(0, 12)
                  .map((tag, index) => (
                    <Link href={`/tag/${tag}`} key={index}>
                      <span className="tag-pill">#{tag}</span>
                    </Link>
                  ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NewsPage

const generateContent = () => {
  return `
  In recent years, the global economy has experienced significant transformations driven by the rise of digital currencies. Major corporations are investing heavily in blockchain technology to streamline operations and enhance security. This shift is not only affecting large enterprises but also benefiting small businesses, which are gaining increased access to international markets via e-commerce platforms. Analysts predict that sustainable business practices will soon become a cornerstone of corporate strategies, highlighting the importance of environmental responsibility in today's market.

  The political landscape has also seen substantial changes with recent elections bringing new policies focused on healthcare and education. These initiatives aim to bridge the gap between different socioeconomic groups, fostering a more inclusive society. International relations are at the forefront of political discourse, with trade agreements being renegotiated to promote better economic ties and reduce tariffs. This global dialogue is essential in maintaining peaceful and productive interactions between nations.

  In the world of sports, this year has been remarkable with record-breaking performances across various disciplines. The Summer Olympics showcased extraordinary talent from around the globe, inspiring millions with stories of perseverance and excellence. However, the ongoing debate over athlete compensation continues, with advocates pushing for fairer pay structures, especially in women's sports. This conversation is critical in ensuring equity and recognition for all athletes.

  Environmental concerns have reached unprecedented levels, with climate change impacting ecosystems worldwide. Conservation efforts are gaining momentum as governments and non-governmental organizations (NGOs) collaborate to protect endangered species and promote sustainable living practices. Innovative solutions in renewable energy are being developed to reduce our carbon footprint and combat global warming, emphasizing the urgent need for collective action.

  Public opinion remains increasingly polarized on several key issues, including immigration and climate policy. Thought leaders are calling for more nuanced discussions to bridge divides and find common ground. Social media plays a significant role in shaping public opinion, amplifying both positive and negative voices. This platform's influence cannot be underestimated as it continues to impact societal views and behaviors.

  Lifestyle trends are evolving, with a growing emphasis on health and wellness. People are becoming more conscious of their dietary choices, opting for organic and plant-based options. Mental health awareness is also on the rise, with more resources being made available for those in need. In travel, there has been a shift towards eco-tourism, with travelers seeking sustainable and authentic experiences that minimize their environmental impact.

  The entertainment industry is thriving, with streaming services providing a platform for diverse and inclusive content. Blockbuster movies and TV series are being produced with a global audience in mind, featuring stories that resonate across different cultures. The music industry is experiencing a renaissance, with artists from various genres collaborating to create innovative sounds that appeal to a broad range of listeners. This period of creative flourishing underscores the power of entertainment in connecting people and enriching lives.
  `
}
