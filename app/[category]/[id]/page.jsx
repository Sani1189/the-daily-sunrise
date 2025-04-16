"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FaFacebook,
  FaInstagram,
  FaShareAlt,
  FaUserCircle,
  FaRegUser,
  FaUserAlt,
  FaRegClock,
  FaRegCalendarAlt,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

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

    fetchNews()
    fetchComments()
  }, [category, id])

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
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
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

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          {/* Country and Category */}
          <div className="flex justify-start ml-1 mb-4">
            <Link
              href={`/${mainNews.country}`}
              className="text-2xl text-gray-700 font-bold hover:text-blue-700 transition-colors duration-300"
            >
              {toUpperCaseFirst(mainNews.country)}
            </Link>
            <p className="text-xl text-gray-800 font-bold px-2">|</p>
            <Link
              href={`/${category}`}
              className="text-2xl text-gray-700 font-bold hover:text-blue-700 transition-colors duration-300"
            >
              {toUpperCaseFirst(category)}
            </Link>
          </div>
          {mainNews && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg relative fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight">{mainNews.title}</h1>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    {mainNews.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{mainNews.author}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaRegCalendarAlt className="mr-1" />
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
                  <a
                    href={`mailto:?subject=${mainNews.title}&body=${encodeURIComponent(window.location.href)}`}
                    className="p-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors duration-300"
                    aria-label="Share via email"
                  >
                    <FaShareAlt size={20} />
                  </a>
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
                  <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="text-lg text-gray-700 leading-relaxed space-y-6 whitespace-pre-line">
                <p>{firstPart}</p>
                {/* Advertisement */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 my-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
                  <div className="flex justify-center items-center h-32 bg-white rounded-lg border border-gray-300 shadow-inner">
                    <span className="text-gray-500">Ad space</span>
                  </div>
                </div>
                <p>{secondPart}</p>
                {/* Advertisement */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 my-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
                  <div className="flex justify-center items-center h-32 bg-white rounded-lg border border-gray-300 shadow-inner">
                    <span className="text-gray-500">Ad space</span>
                  </div>
                </div>
                <p>{thirdPart}</p>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 mt-8 rounded-xl shadow-xl">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 pb-2 border-blue-500 relative">
              Latest Comments
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
                {comments.length}
              </span>
            </h2>
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 italic mb-4">No comments yet. Be the first to share your thoughts!</p>
                <div className="mt-4">
                  <a
                    href="#comment-form"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Add a Comment
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-4 py-6 ${index < 3 ? "bg-gradient-to-r from-blue-50 to-white" : "bg-white"} rounded-lg shadow-md px-6 mb-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    {/* Random icons for the latest three comments */}
                    {index === 0 && <FaUserCircle className="w-10 h-10 text-blue-600" />}
                    {index === 1 && <FaRegUser className="w-10 h-10 text-green-500" />}
                    {index === 2 && <FaUserAlt className="w-10 h-10 text-purple-500" />}
                    {index > 2 && <FaUserCircle className="w-10 h-10 text-gray-500" />}

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-indigo-600 text-lg">{comment.name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaRegClock className="mr-1" />
                          {timeAgo(comment.date)}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-2 text-md leading-relaxed">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Form */}
          <div id="comment-form" className="bg-white p-8 mt-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block">
              Leave a Comment
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-600 rounded"></span>
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
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{formError}</div>
              )}

              {successMessage && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
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
              </button>
            </form>
          </div>
        </div>

        {/* Other news section */}
        <div className="md:w-1/3">
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block">
              More in {toUpperCaseFirst(category)}
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-600 rounded"></span>
            </h2>
            <div className="space-y-6">
              {otherNews.slice(0, 5).map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <Link href={{ pathname: `/${category}/${item.title}`, query: { id: item._id } }} className="block">
                    <div className="flex flex-col sm:flex-row md:flex-col gap-4">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full sm:w-1/3 md:w-full h-40 object-cover rounded-lg shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          By {item.author} on{" "}
                          {new Date(item.published_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.content.slice(0, 120)}...</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Advertisement */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 mt-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
              <div className="h-64 bg-white flex items-center justify-center rounded-lg border border-gray-300 shadow-inner">
                <span className="text-gray-500">Ad Space</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 mt-8 rounded-xl shadow-md text-white">
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
            </div>
          </div>
        </div>
      </div>
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
