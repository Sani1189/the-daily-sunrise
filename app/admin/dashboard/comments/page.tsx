"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaSearch, FaFilter, FaTrash, FaSort, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function CommentsManagement() {
  interface Comment {
    _id: string
    name: string
    email: string
    comment: string
    date: string
    newsId?: { _id: string; title: string; category: string } | null
  }

  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest")
  const [selectedNewsId, setSelectedNewsId] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [newsOptions, setNewsOptions] = useState<{ _id: string; title: string }[]>([])

  const fetchComments = async () => {
    try {
      setIsLoading(true)

      let url = `/api/admin/comments?page=${currentPage}&limit=10`

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }

      if (selectedNewsId) {
        url += `&newsId=${selectedNewsId}`
      }

      if (dateRange.start && dateRange.end) {
        url += `&startDate=${dateRange.start}&endDate=${dateRange.end}`
      }

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
        setTotalPages(data.pagination.pages)
      } else {
        throw new Error("Failed to fetch comments")
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNewsOptions = async () => {
    try {
      const response = await fetch("/api/admin/news?limit=100")
      if (response.ok) {
        const data = await response.json()
        setNewsOptions(data.news)
      }
    } catch (error) {
      console.error("Error fetching news options:", error)
    }
  }

  useEffect(() => {
    fetchComments()
    fetchNewsOptions()
  }, [currentPage])

  const handleSearch = (e:any) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchComments()
  }

  const handleDelete = async (id:any) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Comment deleted successfully")
        fetchComments()
      } else {
        throw new Error("Failed to delete comment")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment")
    }
  }

  const handlePageChange = (page:any) => {
    setCurrentPage(page)
  }

  const handleFilterApply = () => {
    setCurrentPage(1)
    fetchComments()
  }

  const handleFilterReset = () => {
    setSelectedNewsId("")
      return comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setCurrentPage(1)
    fetchComments()
  }

  const sortComments = () => {
    const sortedComments = [...comments]

    if (sortOrder === "newest") {
      return sortedComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortOrder === "oldest") {
      return sortedComments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (sortOrder === "name-asc") {
      return sortedComments.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === "name-desc") {
      return sortedComments.sort((a, b) => b.name.localeCompare(a.name))
    }

    return sortedComments
  }

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Comments Management</h1>
        <div className="text-sm text-muted-foreground">
          Total: {comments.length > 0 ? comments.length : "Loading..."}
        </div>
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
              placeholder="Search by name, email or comment content..."
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
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <FaSort />
                <span>Sort</span>
              </button>
              {showSortOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-10">
                  <div className="py-1">
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                      onClick={() => {
                        setSortOrder("newest")
                        setShowSortOptions(false)
                      }}
                    >
                      Newest First
                    </button>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                      onClick={() => {
                        setSortOrder("oldest")
                        setShowSortOptions(false)
                      }}
                    >
                      Oldest First
                    </button>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                      onClick={() => {
                        setSortOrder("name-asc")
                        setShowSortOptions(false)
                      }}
                    >
                      Name (A-Z)
                    </button>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                      onClick={() => {
                        setSortOrder("name-desc")
                        setShowSortOptions(false)
                      }}
                    >
                      Name (Z-A)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Article</label>
              <select
                className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                value={selectedNewsId}
                onChange={(e) => setSelectedNewsId(e.target.value)}
              >
                <option value="">All Articles</option>
                {newsOptions.map((news) => (
                  <option key={news._id} value={news._id}>
                    {news.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleFilterReset}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleFilterApply}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Comments Table */}
      <motion.div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden" variants={itemVariants}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading comments...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-xl text-muted-foreground mb-4">No comments found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Article
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
                {sortComments().map((comment) => (
                  <tr key={comment._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{comment.name}</div>
                          <div className="text-xs text-muted-foreground">{comment.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-foreground line-clamp-2">{comment.comment}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {comment.newsId && typeof comment.newsId === "object" ? (
                        <Link
                          href={`/${comment.newsId.category}/${comment.newsId._id}`}
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary"
                        >
                          {comment.newsId.title}
                        </Link>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-muted text-muted-foreground">
                          Unknown Article
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(comment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {comment.newsId && typeof comment.newsId === "object" && (
                          <Link
                            href={`/admin/dashboard/news/edit/${comment.newsId._id}`}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            title="View Article"
                          >
                            <FaEye size={16} />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Comment"
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
        {!isLoading && comments.length > 0 && (
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
