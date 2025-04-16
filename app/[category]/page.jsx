"use client"
import { useEffect, useState } from "react"
import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Page({ params }) {
  const category = params.category
  const [articles, setArticles] = useState([])
  const [visibleArticles, setVisibleArticles] = useState(8)
  const [loading, setLoading] = useState(true)

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
    <motion.div
      className="max-w-screen-xl mx-auto p-5 fade-in"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-center my-8">
        <div className="flex-grow border-t border-b border-primary/30 h-1"></div>
        <motion.h1
          className="text-3xl sm:text-4xl text-center text-primary font-bold p-4 mx-6 rounded-xl bg-primary/10 shadow-lg"
          variants={itemVariants}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>
        <div className="flex-grow border-t border-b border-primary/30 h-1"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
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
              <motion.div key={index} variants={itemVariants}>
                <Link
                  href={{
                    pathname: `/${item.category}/${item.title}`,
                    query: { id: item._id },
                  }}
                  className="flex flex-col border rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl bg-card group"
                >
                  <div className="overflow-hidden h-48">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h1 className="text-card-foreground font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h1>
                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {item.content.substring(0, 120)}...
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-sm font-medium text-foreground">{item.author}</p>
                      <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {format(new Date(item.published_date), "dd MMM, yyyy")}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
            {sortedArticles.slice(6, visibleArticles).map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  href={{
                    pathname: `/${item.category}/${item.title}`,
                    query: { id: item._id },
                  }}
                  className="flex flex-col sm:flex-row border-b border-border p-4 transition-all duration-300 hover:bg-primary/5 rounded-lg"
                >
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="object-cover h-48 sm:h-32 sm:w-32 w-full rounded-lg shadow-md mb-4 sm:mb-0"
                  />
                  <div className="flex flex-col justify-center sm:ml-6 flex-grow">
                    <h1 className="text-foreground font-semibold text-xl mb-2 hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h1>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{item.content.substring(0, 120)}...</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className="font-medium">{item.author}</span>
                      <span>{format(new Date(item.published_date), "dd MMM, yyyy")}</span>
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
          className="flex flex-col items-center justify-center h-64 bg-card rounded-xl p-8 text-center"
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
