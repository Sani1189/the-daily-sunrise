"use client"
import { useEffect, useState } from "react"
import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaTag, FaCalendarAlt, FaUser } from "react-icons/fa"

export default function TagPage({ params }) {
  const tagName = params.tagName
  const [articles, setArticles] = useState([])
  const [visibleArticles, setVisibleArticles] = useState(8)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const url = `/api/news?tags=${tagName}`
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
  }, [tagName])

  const sortedArticles = _.sortBy(articles, "published_date").reverse()

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

  return (
    <div className="max-w-screen-xl mx-auto p-5">
      <motion.div
        className="flex items-center justify-center my-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-grow border-t border-b border-blue-300 h-1"></div>
        <div className="fancy-card px-8 py-4 mx-6 bg-gradient-to-r from-blue-500 to-purple-500">
          <h1 className="text-3xl sm:text-4xl text-center text-white font-bold">
            <FaTag className="inline-block mr-2 mb-1" />#{tagName.charAt(0).toUpperCase() + tagName.slice(1)}
          </h1>
        </div>
        <div className="flex-grow border-t border-b border-blue-300 h-1"></div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg text-gray-700">Loading articles...</p>
        </div>
      ) : sortedArticles.length > 0 ? (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedArticles.slice(0, 6).map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  href={{
                    pathname: `/${item.category}/${item.title}`,
                    query: { id: item._id },
                  }}
                  className="flex flex-col fancy-card group h-full"
                >
                  <div className="overflow-hidden h-48">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col bg-gradient-to-br from-white to-blue-50">
                    <h1 className="text-gray-800 font-bold text-xl mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2 gradient-text">
                      {item.title}
                    </h1>
                    <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{item.content.substring(0, 120)}...</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map((tag, idx) => (
                        <Link href={`/tag/${tag}`} key={idx}>
                          <span className="tag-pill text-blue-700">#{tag}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-sm font-medium text-gray-700 flex items-center">
                        <FaUser className="mr-1 text-blue-500" /> {item.author}
                      </p>
                      <p className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        <FaCalendarAlt className="mr-1" /> {format(new Date(item.published_date), "dd MMM, yyyy")}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedArticles.slice(6, visibleArticles).map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  href={{
                    pathname: `/${item.category}/${item.title}`,
                    query: { id: item._id },
                  }}
                  className="flex flex-col sm:flex-row border-b border-gray-200 p-4 transition-all duration-300 hover:bg-blue-50 rounded-lg shine-effect"
                >
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="object-cover h-48 sm:h-32 sm:w-32 w-full rounded-lg shadow-md mb-4 sm:mb-0"
                  />
                  <div className="flex flex-col justify-center sm:ml-6 flex-grow">
                    <h1 className="text-gray-800 font-semibold text-xl mb-2 hover:text-blue-700 transition-colors duration-300">
                      {item.title}
                    </h1>
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.content.substring(0, 120)}...</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.tags.map((tag, idx) => (
                        <Link href={`/tag/${tag}`} key={idx}>
                          <span className="tag-pill text-blue-700 text-xs">#{tag}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="font-medium flex items-center">
                        <FaUser className="mr-1 text-blue-500" /> {item.author}
                      </span>
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-blue-500" />{" "}
                        {format(new Date(item.published_date), "dd MMM, yyyy")}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {visibleArticles < sortedArticles.length && (
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button onClick={handleShowMore} className="fancy-button">
                Show More Articles
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
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
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Articles Found</h2>
          <p className="text-gray-500">
            We couldn't find any articles with the tag "{tagName}". Please try another tag.
          </p>
        </motion.div>
      )}
    </div>
  )
}
