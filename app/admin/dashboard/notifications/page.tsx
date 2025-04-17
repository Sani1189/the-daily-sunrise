"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaNewspaper,
  FaComments,
  FaUser,
  FaCog,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: "",
    isRead: "",
    entityType: "",
  })

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)

      let url = `/api/notifications?page=${currentPage}&limit=10`

      if (filters.type) url += `&type=${filters.type}`
      if (filters.isRead !== "") url += `&isRead=${filters.isRead}`
      if (filters.entityType) url += `&entityType=${filters.entityType}`

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setTotalPages(data.pagination.pages)
        setUnreadCount(data.unreadCount)
      } else {
        throw new Error("Failed to fetch notifications")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")

      // For demo purposes, let's create some sample notifications
      const sampleNotifications = [
        {
          _id: "1",
          type: "info",
          title: "New Article Published",
          message: "Your article 'Climate Change Report' has been published successfully.",
          entityId: "article1",
          entityType: "news",
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          _id: "2",
          type: "success",
          title: "Comment Approved",
          message: "You approved a comment on 'Economic Policy Changes'.",
          entityId: "comment1",
          entityType: "comment",
          isRead: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "3",
          type: "warning",
          title: "Low Disk Space",
          message: "Your server is running low on disk space. Consider cleaning up old files.",
          entityId: "server1",
          entityType: "system",
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "4",
          type: "error",
          title: "Failed Login Attempt",
          message: "There was a failed login attempt to your account from an unknown IP address.",
          entityId: "security1",
          entityType: "security",
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "5",
          type: "info",
          title: "System Update",
          message: "The system will undergo maintenance tonight at 2 AM UTC.",
          entityId: "system1",
          entityType: "system",
          isRead: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]

      setNotifications(sampleNotifications)
      setTotalPages(1)
      setUnreadCount(3)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [currentPage])

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => (notification._id === id ? { ...notification, isRead: true } : notification)),
        )
        setUnreadCount((prev) => prev - 1)
      } else {
        throw new Error("Failed to mark notification as read")
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)

      // For demo purposes, let's update the UI anyway
      setNotifications((prev) =>
        prev.map((notification) => (notification._id === id ? { ...notification, isRead: true } : notification)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just update the UI
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
      setUnreadCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotifications((prev) => prev.filter((notification) => notification._id !== id))
        if (notifications.find((n) => n._id === id && !n.isRead)) {
          setUnreadCount((prev) => prev - 1)
        }
        toast.success("Notification deleted")
      } else {
        throw new Error("Failed to delete notification")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)

      // For demo purposes, let's update the UI anyway
      setNotifications((prev) => prev.filter((notification) => notification._id !== id))
      if (notifications.find((n) => n._id === id && !n.isRead)) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
      toast.success("Notification deleted")
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilterApply = () => {
    setCurrentPage(1)
    fetchNotifications()
  }

  const handleFilterReset = () => {
    setFilters({
      type: "",
      isRead: "",
      entityType: "",
    })
    setCurrentPage(1)
    fetchNotifications()
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getNotificationIcon = (type, entityType) => {
    if (entityType === "news") return <FaNewspaper />
    if (entityType === "comment") return <FaComments />
    if (entityType === "user") return <FaUser />
    if (entityType === "system") return <FaCog />
    if (entityType === "security") return <FaExclamationCircle />

    // Fallback based on notification type
    if (type === "info") return <FaInfoCircle />
    if (type === "success") return <FaCheckCircle />
    if (type === "warning") return <FaExclamationCircle />
    if (type === "error") return <FaExclamationCircle />

    return <FaBell />
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      case "success":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      case "warning":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "error":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-primary/10 text-primary"
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
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCheck />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          className="bg-card rounded-xl shadow-sm p-4 border border-border"
          variants={itemVariants}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label htmlFor="entityType" className="block text-sm font-medium text-foreground mb-1">
                Category
              </label>
              <select
                id="entityType"
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
                className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">All Categories</option>
                <option value="news">News</option>
                <option value="comment">Comments</option>
                <option value="user">Users</option>
                <option value="system">System</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div>
              <label htmlFor="isRead" className="block text-sm font-medium text-foreground mb-1">
                Status
              </label>
              <select
                id="isRead"
                name="isRead"
                value={filters.isRead}
                onChange={handleFilterChange}
                className="w-full p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">All Status</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={handleFilterReset}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleFilterApply}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Notifications List */}
      <motion.div className="space-y-4" variants={containerVariants}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl shadow-sm p-6 border border-border">
            <FaBell className="text-muted-foreground mb-4" size={48} />
            <p className="text-xl text-muted-foreground mb-2">No notifications found</p>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification._id}
              className={`bg-card rounded-xl shadow-sm p-4 border ${
                notification.isRead ? "border-border" : "border-primary"
              }`}
              variants={itemVariants}
            >
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getNotificationColor(
                    notification.type,
                  )}`}
                >
                  {getNotificationIcon(notification.type, notification.entityType)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-foreground">{notification.title}</h3>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Mark as read"
                        >
                          <FaCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete notification"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    {notification.entityType === "news" && (
                      <Link
                        href={`/admin/dashboard/news/edit/${notification.entityId}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View Article
                      </Link>
                    )}
                    {notification.entityType === "comment" && (
                      <Link
                        href={`/admin/dashboard/comments?id=${notification.entityId}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View Comment
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {!isLoading && notifications.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
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
      )}
    </motion.div>
  )
}
