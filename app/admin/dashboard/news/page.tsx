"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEye,
  FaSort,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import { toast } from "react-hot-toast"

export default function NewsManagement() {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest")
  const router = useRouter()

  const fetchNews = async () => {
    try {
      setIsLoading(true)

      let url = `/api/admin/news?page=${currentPage}&limit=10`

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }

      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`
      }

      if (selectedCountry) {
        url += `&country=${encodeURIComponent(selectedCountry)}`
      }

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setNews(data.news)
        setTotalPages(data.pagination.pages)
      } else {
        throw new Error("Failed to fetch news")
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      toast.error("Failed to load news articles")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [currentPage, selectedCategory, selectedCountry])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchNews()
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Article deleted successfully")
        fetchNews()
      } else {
        throw new Error("Failed to delete article")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast.error("Failed to delete article")
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const sortNews = () => {
    const sortedNews = [...news]

    if (sortOrder === "newest") {
      return sortedNews.sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
    } else if (sortOrder === "oldest") {
      return sortedNews.sort((a, b) => new Date(a.published_date) - new Date(b.published_date))
    } else if (sortOrder === "title-asc") {
      return sortedNews.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === "title-desc") {
      return sortedNews.sort((a, b) => b.title.localeCompare(a.title))
    }

    return sortedNews
  }

  // Get unique categories and countries for filters
  const categories = [...new Set(news.map((item) => item.category))]
  const countries = [...new Set(news.map((item) => item.country))]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">News Management</h1>

        <Link href="/admin/dashboard/news/create">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus />
            <span>Create Article</span>
          </motion.button>
        </Link>
      </div>

      {/* Search and Filters */}
      <motion.div className="bg-card rounded-xl shadow-sm p-4 border border-border" variants={itemVariants}>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="pl-10 w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              <span>Filters</span>
            </button>

            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <FaSort />
                <span>Sort</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-10 hidden group-hover:block">
                <div className="py-1">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                    onClick={() => setSortOrder("newest")}
                  >
                    Newest First
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                    onClick={() => setSortOrder("oldest")}
                  >
                    Oldest First
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                    onClick={() => setSortOrder("title-asc")}
                  >
                    Title (A-Z)
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                    onClick={() => setSortOrder("title-desc")}
                  >
                    Title (Z-A)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select
                className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Country</label>
              <select
                className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country.charAt(0).toUpperCase() + country.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </motion.div>

      {/* News Table */}
      <motion.div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden" variants={itemVariants}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading articles...</p>
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-xl text-muted-foreground mb-4">No articles found</p>
            <Link href="/admin/dashboard/news/create">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Create New Article
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortNews().map((article) => (
                  <tr key={article._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={article.image_url || "/placeholder.svg"}
                            alt={article.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{article.title}</div>
                          <div className="text-xs text-muted-foreground">ID: {article._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{article.author}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(article.published_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/${article.category}/${article.title}?id=${article._id}`} target="_blank">
                          <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                            <FaEye size={16} />
                          </button>
                        </Link>
                        <Link href={`/admin/dashboard/news/edit/${article._id}`}>
                          <button className="p-1 text-muted-foreground hover:text-primary transition-colors">
                            <FaEdit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && news.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-border">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber

                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? "z-10 bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-foreground hover:bg-muted"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
