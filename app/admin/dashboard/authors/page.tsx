"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaNewspaper,
  FaEye,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaGlobe,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<{ 
    _id: string; 
    name: string; 
    email: string; 
    bio: string; 
    avatar: string; 
    articleCount: number; 
    viewCount: number; 
    lastArticleDate: string; 
    website?: string; 
    twitter?: string; 
    facebook?: string; 
    instagram?: string; 
    linkedin?: string; 
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    website: "",
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  })
  const [editingAuthorId, setEditingAuthorId] = useState(null)
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const fetchAuthors = async () => {
    try {
      setIsLoading(true)

      // Fetch news data to extract real authors
      const newsResponse = await fetch("/api/admin/news?limit=100")
      let newsData = []

      if (newsResponse.ok) {
        const data = await newsResponse.json()
        newsData = data.news || []
      }

      // Extract unique authors and their articles
      const authorMap: Record<string, {
        _id: string;
        name: string;
        email: string;
        bio: string;
        avatar: string;
        articleCount: number;
        viewCount: number;
        lastArticleDate: string;
      }> = {}

      newsData.forEach((article:any) => {
        if (article.author) {
          if (!authorMap[article.author]) {
            // Create new author entry
            authorMap[article.author] = {
              _id: article.author.replace(/\s+/g, "-").toLowerCase(),
              name: article.author,
              email: `${article.author.replace(/\s+/g, ".").toLowerCase()}@example.com`,
              bio: `Experienced journalist covering ${article.category || "various"} topics.`,
              avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 70) + 1}.jpg`,
              articleCount: 1,
              viewCount: article.views || Math.floor(Math.random() * 1000),
              lastArticleDate: article.published_date || new Date().toISOString(),
            }
          } else {
            // Update existing author
            authorMap[article.author].articleCount += 1
            authorMap[article.author].viewCount += article.views || Math.floor(Math.random() * 1000)

            // Update last article date if this one is more recent
            const currentDate = new Date(authorMap[article.author].lastArticleDate)
            const articleDate = new Date(article.published_date || new Date())

            if (articleDate > currentDate) {
              authorMap[article.author].lastArticleDate = article.published_date || new Date().toISOString()
            }
          }
        }
      })

      // Convert to array
      const realAuthors = Object.values(authorMap)

      // Apply search filter
      let filteredAuthors = searchQuery
        ? realAuthors.filter(
            (author) =>
              author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              author.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              author.bio.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : [...realAuthors]

      // Sort authors
      filteredAuthors = filteredAuthors.sort((a, b) => {
        let comparison = 0

        if (sortField === "name") {
          comparison = a.name.localeCompare(b.name)
        } else if (sortField === "articleCount") {
          comparison = a.articleCount - b.articleCount
        } else if (sortField === "viewCount") {
          comparison = a.viewCount - b.viewCount
        } else if (sortField === "lastArticleDate") {
          comparison = new Date(a.lastArticleDate).getTime() - new Date(b.lastArticleDate).getTime()
        }

        return sortDirection === "asc" ? comparison : -comparison
      })

      setAuthors(filteredAuthors)
      setTotalPages(Math.ceil(filteredAuthors.length / 10))
    } catch (error) {
      console.error("Error fetching authors:", error)
      toast.error("Failed to load authors")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthors()
  }, [searchQuery, sortField, sortDirection])

  const handleSearch = (e:any) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchAuthors()
  }

  const handleSort = (field:any) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field:any) => {
    if (sortField !== field) return <FaSort className="ml-1" />
    return sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
  }

  const handlePageChange = (page:any) => {
    setCurrentPage(page)
  }

  const handleAddAuthor = async () => {
    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just update the UI
      const newAuthor = {
        _id: String(authors.length + 1),
        ...formData,
        articleCount: 0,
        viewCount: 0,
        lastArticleDate: new Date().toISOString(),
      }

      setAuthors([...authors, newAuthor])
      setIsAddModalOpen(false)
      setFormData({
        name: "",
        email: "",
        bio: "",
        avatar: "",
        website: "",
        twitter: "",
        facebook: "",
        instagram: "",
        linkedin: "",
      })
      toast.success("Author added successfully")
    } catch (error) {
      console.error("Error adding author:", error)
      toast.error("Failed to add author")
    }
  }

  const handleEditAuthor = async () => {
    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just update the UI
      const updatedAuthors = authors.map((author) =>
        author._id === editingAuthorId ? { ...author, ...formData } : author,
      )

      setAuthors(updatedAuthors)
      setIsEditModalOpen(false)
      setEditingAuthorId(null)
      setFormData({
        name: "",
        email: "",
        bio: "",
        avatar: "",
        website: "",
        twitter: "",
        facebook: "",
        instagram: "",
        linkedin: "",
      })
      toast.success("Author updated successfully")
    } catch (error) {
      console.error("Error updating author:", error)
      toast.error("Failed to update author")
    }
  }

  const handleDeleteAuthor = async (id:any) => {
    if (!confirm("Are you sure you want to delete this author?")) {
      return
    }

    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just update the UI
      const updatedAuthors = authors.filter((author) => author._id !== id)
      setAuthors(updatedAuthors)
      toast.success("Author deleted successfully")
    } catch (error) {
      console.error("Error deleting author:", error)
      toast.error("Failed to delete author")
    }
  }

  const openEditModal = (author:any) => {
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio,
      avatar: author.avatar,
      website: author.website || "",
      twitter: author.twitter || "",
      facebook: author.facebook || "",
      instagram: author.instagram || "",
      linkedin: author.linkedin || "",
    })
    setEditingAuthorId(author._id)
    setIsEditModalOpen(true)
  }

  const handleChange = (e:any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Authors Management</h1>

        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search authors..."
                className="pl-10 p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            <span>Add Author</span>
          </button>
        </div>
      </div>

      {/* Authors Table */}
      <motion.div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden" variants={itemVariants}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading authors...</p>
            </div>
          </div>
        ) : authors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-xl text-muted-foreground mb-4">No authors found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              <span>Add Your First Author</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort("name")}>
                      Author
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort("articleCount")}>
                      Articles
                      {getSortIcon("articleCount")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button className="flex items-center focus:outline-none" onClick={() => handleSort("viewCount")}>
                      Views
                      {getSortIcon("viewCount")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort("lastArticleDate")}
                    >
                      Last Article
                      {getSortIcon("lastArticleDate")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {authors.map((author) => (
                  <tr key={author._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={author.avatar || "/placeholder.svg?height=40&width=40"}
                            alt={author.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-foreground">{author.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{author.bio}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-foreground flex items-center">
                        <FaEnvelope className="mr-1 text-muted-foreground" />
                        <span>{author.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {author.website && (
                          <a
                            href={author.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <FaGlobe size={14} />
                          </a>
                        )}
                        {author.twitter && (
                          <a
                            href={`https://twitter.com/${author.twitter.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <FaTwitter size={14} />
                          </a>
                        )}
                        {author.facebook && (
                          <a
                            href={`https://facebook.com/${author.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <FaFacebook size={14} />
                          </a>
                        )}
                        {author.instagram && (
                          <a
                            href={`https://instagram.com/${author.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <FaInstagram size={14} />
                          </a>
                        )}
                        {author.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${author.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <FaLinkedin size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaNewspaper className="text-primary mr-2" />
                        <span className="text-sm text-foreground">{author.articleCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEye className="text-primary mr-2" />
                        <span className="text-sm text-foreground">{author.viewCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">
                        {new Date(author.lastArticleDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/dashboard/news?author=${author._id}`}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="View Articles"
                        >
                          <FaNewspaper size={16} />
                        </Link>
                        <button
                          onClick={() => openEditModal(author)}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Edit Author"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAuthor(author._id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Author"
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
        {!isLoading && authors.length > 0 && totalPages > 1 && (
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

      {/* Add Author Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Add New Author</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddAuthor()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Author name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="author@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-foreground">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Author bio"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="avatar" className="block text-sm font-medium text-foreground">
                  Avatar URL
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="text"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="website" className="block text-sm font-medium text-foreground">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="twitter" className="block text-sm font-medium text-foreground">
                    Twitter
                  </label>
                  <input
                    id="twitter"
                    name="twitter"
                    type="text"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="facebook" className="block text-sm font-medium text-foreground">
                    Facebook
                  </label>
                  <input
                    id="facebook"
                    name="facebook"
                    type="text"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="username"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="instagram" className="block text-sm font-medium text-foreground">
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedin" className="block text-sm font-medium text-foreground">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="username"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <FaSave />
                  <span>Save Author</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Author Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Edit Author</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEditAuthor()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="edit-name" className="block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Author name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="author@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-bio" className="block text-sm font-medium text-foreground">
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Author bio"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-avatar" className="block text-sm font-medium text-foreground">
                  Avatar URL
                </label>
                <input
                  id="edit-avatar"
                  name="avatar"
                  type="text"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-website" className="block text-sm font-medium text-foreground">
                    Website
                  </label>
                  <input
                    id="edit-website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-twitter" className="block text-sm font-medium text-foreground">
                    Twitter
                  </label>
                  <input
                    id="edit-twitter"
                    name="twitter"
                    type="text"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-facebook" className="block text-sm font-medium text-foreground">
                    Facebook
                  </label>
                  <input
                    id="edit-facebook"
                    name="facebook"
                    type="text"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="username"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-instagram" className="block text-sm font-medium text-foreground">
                    Instagram
                  </label>
                  <input
                    id="edit-instagram"
                    name="instagram"
                    type="text"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-linkedin" className="block text-sm font-medium text-foreground">
                  LinkedIn
                </label>
                <input
                  id="edit-linkedin"
                  name="linkedin"
                  type="text"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="username"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <FaSave />
                  <span>Update Author</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
