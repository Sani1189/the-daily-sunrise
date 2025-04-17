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
} from "react-icons/fa"
import { toast } from "react-hot-toast"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  })
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  // For demo purposes, let's create some sample categories
  const sampleCategories = [
    {
      _id: "1",
      name: "Politics",
      slug: "politics",
      description: "Political news and updates",
      icon: "FaLandmark",
      articleCount: 42,
      viewCount: 12500,
    },
    {
      _id: "2",
      name: "Business",
      slug: "business",
      description: "Business and economic news",
      icon: "FaChartLine",
      articleCount: 38,
      viewCount: 9800,
    },
    {
      _id: "3",
      name: "Technology",
      slug: "technology",
      description: "Technology news and innovations",
      icon: "FaMicrochip",
      articleCount: 56,
      viewCount: 18200,
    },
    {
      _id: "4",
      name: "Sports",
      slug: "sports",
      description: "Sports news and updates",
      icon: "FaFootballBall",
      articleCount: 64,
      viewCount: 22400,
    },
    {
      _id: "5",
      name: "Entertainment",
      slug: "entertainment",
      description: "Entertainment and celebrity news",
      icon: "FaFilm",
      articleCount: 48,
      viewCount: 15600,
    },
    {
      _id: "6",
      name: "Health",
      slug: "health",
      description: "Health and wellness news",
      icon: "FaHeartbeat",
      articleCount: 32,
      viewCount: 8900,
    },
    {
      _id: "7",
      name: "Science",
      slug: "science",
      description: "Science news and discoveries",
      icon: "FaFlask",
      articleCount: 28,
      viewCount: 7500,
    },
    {
      _id: "8",
      name: "Environment",
      slug: "environment",
      description: "Environmental news and climate change",
      icon: "FaLeaf",
      articleCount: 24,
      viewCount: 6200,
    },
  ]

  const fetchCategories = async () => {
    try {
      setIsLoading(true)

      // This would be a real API endpoint in a production app
      // For now, we'll use our sample data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const filteredCategories = searchQuery
        ? sampleCategories.filter(
            (category) =>
              category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              category.description.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : sampleCategories

      setCategories(filteredCategories)
      setTotalPages(Math.ceil(filteredCategories.length / 10))
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCategories()
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleAddCategory = async () => {
    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just update the UI
      const newCategory = {
        _id: String(categories.length + 1),
        ...formData,
        articleCount: 0,
        viewCount: 0,
      }

      setCategories([...categories, newCategory])
      setIsAddModalOpen(false)
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "",
      })
      toast.success("Category added successfully")
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Failed to add category")
    }
  }

  const handleEditCategory = async () => {
    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just update the UI
      const updatedCategories = categories.map((category) =>
        category._id === editingCategoryId ? { ...category, ...formData } : category,
      )

      setCategories(updatedCategories)
      setIsEditModalOpen(false)
      setEditingCategoryId(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "",
      })
      toast.success("Category updated successfully")
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just update the UI
      const updatedCategories = categories.filter((category) => category._id !== id)
      setCategories(updatedCategories)
      toast.success("Category deleted successfully")
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    }
  }

  const openEditModal = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
    })
    setEditingCategoryId(category._id)
    setIsEditModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }))
    }
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
        <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>

        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
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
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <motion.div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden" variants={itemVariants}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-xl text-muted-foreground mb-4">No categories found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              <span>Add Your First Category</span>
            </button>
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
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{category.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{category.slug}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-foreground line-clamp-2">{category.description}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaNewspaper className="text-primary mr-2" />
                        <span className="text-sm text-foreground">{category.articleCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEye className="text-primary mr-2" />
                        <span className="text-sm text-foreground">{category.viewCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Edit Category"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Category"
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
        {!isLoading && categories.length > 0 && totalPages > 1 && (
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

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Add New Category</h2>
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
                handleAddCategory()
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
                  placeholder="Category name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-medium text-foreground">
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="category-slug"
                />
                <p className="text-xs text-muted-foreground">Used in URLs, auto-generated from name</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Category description"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="icon" className="block text-sm font-medium text-foreground">
                  Icon
                </label>
                <input
                  id="icon"
                  name="icon"
                  type="text"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="FaIcon name (e.g., FaNewspaper)"
                />
                <p className="text-xs text-muted-foreground">Icon name from React Icons (optional)</p>
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Edit Category</h2>
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
                handleEditCategory()
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
                  placeholder="Category name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-slug" className="block text-sm font-medium text-foreground">
                  Slug
                </label>
                <input
                  id="edit-slug"
                  name="slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="category-slug"
                />
                <p className="text-xs text-muted-foreground">Used in URLs, auto-generated from name</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-description" className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Category description"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-icon" className="block text-sm font-medium text-foreground">
                  Icon
                </label>
                <input
                  id="edit-icon"
                  name="icon"
                  type="text"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="FaIcon name (e.g., FaNewspaper)"
                />
                <p className="text-xs text-muted-foreground">Icon name from React Icons (optional)</p>
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
                  <span>Update Category</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
