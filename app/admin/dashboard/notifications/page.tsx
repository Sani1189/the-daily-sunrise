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
  const [notifications, setNotifications] = useState<{ _id: string; isRead: boolean; [key: string]: any }[]>([])
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

      // If we can't fetch notifications, try to generate them from recent activity
      await generateNotificationsFromActivity()
    } finally {
      setIsLoading(false)
    }
  }

  const generateNotificationsFromActivity = async () => {
    try {
      // Fetch recent news articles
      const newsResponse = await fetch("/api/admin/news?limit=20")
      let newsData = []

      if (newsResponse.ok) {
        const data = await newsResponse.json()
        newsData = data.news || []
      }

      // Fetch recent comments
      const commentsResponse = await fetch("/api/admin/comments")
      let commentsData = []

      if (commentsResponse.ok) {
        const data = await commentsResponse.json()
        commentsData = data.comments || []
      }

      // Create notifications from news articles
      const newsNotifications = await Promise.all(
        newsData.map(async (news:any) => {
          // Create a notification in the database
          const response = await fetch("/api/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "news_created",
              title: "New Article Published",
              message: `Article "${news.title}" was published in ${news.category}.`,
              entityId: news._id,
              entityType: "news",
            }),
          })

          if (response.ok) {
            const data = await response.json()
            return data.notification
          }
          return null
        }),
      )

      // Create notifications from comments
      const commentNotifications = await Promise.all(
        commentsData.slice(0, 5).map(async (comment:any) => {
          // Find the associated news article
          const newsResponse = await fetch(`/api/admin/news/${comment.newsId}`)
          let newsTitle = "an article"

          if (newsResponse.ok) {
            const newsData = await newsResponse.json()
            newsTitle = newsData.title
          }

          // Create a notification in the database
          const response = await fetch("/api/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "comment_created",
              title: "New Comment Received",
              message: `New comment by ${comment.name} on article "${newsTitle}".`,
              entityId: comment._id,
              entityType: "comment",
            }),
          })

          if (response.ok) {
            const data = await response.json()
            return data.notification
          }
          return null
        }),
      )

      // Fetch the newly created notifications
      fetchNotifications()
    } catch (error) {
      console.error("Error generating notifications:", error)
      setNotifications([])
      setTotalPages(1)
      setUnreadCount(0)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [currentPage])

  const handleMarkAsRead = async (id:any) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setNotifications((prev:any) =>
          prev.map((notification:any) => (notification._id === id ? { ...notification, isRead: true } : notification)),
        )
        setUnreadCount((prev) => prev - 1)
        toast.success("Notification marked as read")
      } else {
        throw new Error("Failed to mark notification as read")
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all notifications as read in the database
      const notificationIds = notifications.filter((n) => !n.isRead).map((n) => n._id)

      if (notificationIds.length === 0) {
        toast("No unread notifications", { icon: "ℹ️" })
        return
      }

      const promises = notificationIds.map((id) =>
        fetch(`/api/notifications/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isRead: true }),
        }),
      )

      await Promise.all(promises)

      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
      setUnreadCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const handleDelete = async (id:any) => {
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
      toast.error("Failed to delete notification")
    }
  }

  const handleFilterChange = (e:any) => {
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

  const handlePageChange = (page:any) => {
    setCurrentPage(page)
  }

  const getNotificationIcon = (type:any, entityType:any) => {
    if (entityType === "news") return <FaNewspaper />
    if (entityType === "comment") return <FaComments />
    if (entityType === "user") return <FaUser />
    if (entityType === "system") return <FaCog />
    if (entityType === "security") return <FaExclamationCircle />

    // Fallback based on notification type
    if (type === "news_created" || type === "news_updated" || type === "news_deleted") return <FaNewspaper />
    if (type === "comment_created" || type === "comment_deleted") return <FaComments />
    if (type === "user_registered") return <FaUser />
    if (type === "info") return <FaInfoCircle />
    if (type === "success") return <FaCheckCircle />
    if (type === "warning") return <FaExclamationCircle />
    if (type === "error") return <FaExclamationCircle />

    return <FaBell />
  }

  const getNotificationColor = (type:any) => {
    switch (type) {
      case "news_created":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      case "news_updated":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      case "news_deleted":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
      case "comment_created":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      case "comment_deleted":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
      case "user_registered":
        return "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
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
                <option value="news_created">News Created</option>
                <option value="news_updated">News Updated</option>
                <option value="news_deleted">News Deleted</option>
                <option value="comment_created">Comment Created</option>
                <option value="comment_deleted">Comment Deleted</option>
                <option value="user_registered">User Registered</option>
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
                    {notification.entityType === "user" && (
                      <Link href={`/admin/dashboard/profile`} className="text-xs text-primary hover:underline">
                        View Profile
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
