"use client"
import { useEffect, useState } from "react"
import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"

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

  const getCategoryColor = () => {
    const colors = {
      business: "blue",
      politics: "red",
      entertainment: "purple",
      sports: "green",
      lifestyle: "pink",
      technology: "indigo",
      environment: "teal",
      health: "emerald",
      cricket: "green",
      football: "green",
      trending: "amber",
      feature: "cyan",
      default: "gray",
    }

    return colors[category.toLowerCase()] || colors.default
  }

  const color = getCategoryColor()

  return (
    <div className="max-w-screen-xl mx-auto p-5 fade-in">
      <div className="flex items-center justify-center my-8">
        <div className={`flex-grow border-t border-b border-${color}-300 h-1`}></div>
        <h1
          className={`text-3xl sm:text-4xl text-center text-${color}-800 font-bold p-4 mx-6 rounded-xl bg-${color}-50 shadow-lg`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <div className={`flex-grow border-t border-b border-${color}-300 h-1`}></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg text-gray-700">Loading articles...</p>
        </div>
      ) : sortedArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {sortedArticles.slice(0, 6).map((item, index) => (
              <Link
                key={index}
                href={{
                  pathname: `/${item.category}/${item.title}`,
                  query: { id: item._id },
                }}
                className="flex flex-col border rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl bg-white group"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h1
                    className={`text-gray-800 font-bold text-xl mb-2 group-hover:text-${color}-700 transition-colors duration-300 line-clamp-2`}
                  >
                    {item.title}
                  </h1>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{item.content.substring(0, 120)}...</p>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-sm font-medium text-gray-700">{item.author}</p>
                    <p className={`text-xs bg-${color}-50 text-${color}-800 px-2 py-1 rounded-full`}>
                      {format(new Date(item.published_date), "dd MMM, yyyy")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedArticles.slice(6, visibleArticles).map((item, index) => (
              <Link
                key={index}
                href={{
                  pathname: `/${item.category}/${item.title}`,
                  query: { id: item._id },
                }}
                className="flex flex-col sm:flex-row border-b border-gray-200 p-4 transition-all duration-300 hover:bg-gray-50 rounded-lg"
              >
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover h-48 sm:h-32 sm:w-32 w-full rounded-lg shadow-md mb-4 sm:mb-0"
                />
                <div className="flex flex-col justify-center sm:ml-6 flex-grow">
                  <h1
                    className={`text-gray-800 font-semibold text-xl mb-2 hover:text-${color}-700 transition-colors duration-300`}
                  >
                    {item.title}
                  </h1>
                  <p className="text-gray-600 mb-3 line-clamp-2">{item.content.substring(0, 120)}...</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="font-medium">{item.author}</span>
                    <span>{format(new Date(item.published_date), "dd MMM, yyyy")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleArticles < sortedArticles.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleShowMore}
                className={`px-6 py-3 bg-${color}-600 text-white rounded-lg shadow-lg hover:bg-${color}-700 transition-all duration-300 transform hover:scale-105`}
              >
                Show More News
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl p-8 text-center">
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
          <p className="text-gray-500">We couldn't find any articles in this category. Please check back later.</p>
        </div>
      )}
    </div>
  )
}
