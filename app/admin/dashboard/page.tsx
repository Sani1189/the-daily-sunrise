"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaNewspaper, FaComments, FaUsers, FaEye, FaUserEdit, FaChartLine, FaCalendarAlt } from "react-icons/fa"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import Link from "next/link"
import { toast } from "react-hot-toast"

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30days") // 7days, 30days, 90days, year

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/dashboard/stats")

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          throw new Error("Failed to fetch dashboard stats")
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast.error("Failed to load dashboard statistics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Prepare chart data
  const prepareNewsActivityData = () => {
    if (!stats?.recentNews || !stats?.recentComments) return []

    // Create a map of dates to counts
    const dateMap = {}

    // Add news data
    stats.recentNews.forEach((item) => {
      dateMap[item._id] = { date: item._id, news: item.count, comments: 0 }
    })

    // Add comments data
    stats.recentComments.forEach((item) => {
      if (dateMap[item._id]) {
        dateMap[item._id].comments = item.count
      } else {
        dateMap[item._id] = { date: item._id, news: 0, comments: item.count }
      }
    })

    // Convert to array and sort by date
    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date))
  }

  const prepareViewsOverTimeData = () => {
    if (!stats?.viewsOverTime) return []

    return stats.viewsOverTime.map((item) => ({
      date: item._id,
      views: item.count,
    }))
  }

  const prepareCategoryData = () => {
    if (!stats?.newsByCategory) return []
    return stats.newsByCategory.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }))
  }

  const prepareViewsByCategoryData = () => {
    if (!stats?.viewsByCategory) return []
    return stats.viewsByCategory.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      views: item.count,
    }))
  }

  const prepareCountryData = () => {
    if (!stats?.newsByCountry) return []
    return stats.newsByCountry.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }))
  }

  const prepareTagsData = () => {
    if (!stats?.newsByTags) return []
    return stats.newsByTags.map((item) => ({
      name: item._id,
      articles: item.count,
    }))
  }

  const prepareTopAuthorsData = () => {
    if (!stats?.topAuthors) return []
    return stats.topAuthors.map((item) => ({
      name: item._id,
      articles: item.count,
    }))
  }

  // Chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  // Animation variants
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>

        <div className="flex items-center gap-2">
          <select
            className="p-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>

          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.totalNews || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FaNewspaper size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaChartLine className="text-primary mr-1" />
            <span className="text-muted-foreground">
              {stats?.recentNews?.length > 0
                ? `${stats.recentNews.reduce((sum, item) => sum + item.count, 0)} new in last 30 days`
                : "No recent articles"}
            </span>
          </div>
        </motion.div>

        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.totalViews?.toLocaleString() || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FaEye size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaChartLine className="text-primary mr-1" />
            <span className="text-muted-foreground">
              {stats?.viewsOverTime?.length > 0
                ? `${stats.viewsOverTime.reduce((sum, item) => sum + item.count, 0)} views in last 30 days`
                : "No recent views"}
            </span>
          </div>
        </motion.div>

        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.totalComments || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FaComments size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaChartLine className="text-primary mr-1" />
            <span className="text-muted-foreground">
              {stats?.recentComments?.length > 0
                ? `${stats.recentComments.reduce((sum, item) => sum + item.count, 0)} new in last 30 days`
                : "No recent comments"}
            </span>
          </div>
        </motion.div>

        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Authors</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.topAuthors?.length || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FaUsers size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaUserEdit className="text-primary mr-1" />
            <span className="text-muted-foreground">Top author: {stats?.topAuthors?.[0]?._id || "N/A"}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Views Over Time Chart */}
      <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
        <h2 className="text-xl font-bold text-foreground mb-4">Views Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prepareViewsOverTimeData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="views"
                name="Page Views"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Activity Chart */}
      <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
        <h2 className="text-xl font-bold text-foreground mb-4">Content Activity</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prepareNewsActivityData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="news"
                name="Articles Published"
                stroke="var(--primary)"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="comments" name="Comments" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Viewed Articles */}
      <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Top Viewed Articles</h2>
          <Link href="/admin/dashboard/news">
            <button className="text-sm text-primary hover:underline">View All Articles</button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Published
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats?.topViewedArticles?.map((article, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link
                      href={`/${article.newsId?.category}/${article.newsId?.title}?id=${article.newsId?._id}`}
                      className="text-foreground hover:text-primary transition-colors"
                      target="_blank"
                    >
                      {article.newsId?.title || "Unknown Article"}
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                      {article.newsId?.category || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                    {article.newsId?.author || "Unknown"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {article.viewCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {article.newsId?.published_date
                      ? new Date(article.newsId.published_date).toLocaleDateString()
                      : "Unknown"}
                  </td>
                </tr>
              ))}
              {(!stats?.topViewedArticles || stats.topViewedArticles.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
                    No view data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Chart */}
        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <h2 className="text-xl font-bold text-foreground mb-4">Articles by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Views by Category Chart */}
        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <h2 className="text-xl font-bold text-foreground mb-4">Views by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareViewsByCategoryData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
                <Bar dataKey="views" name="Views" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* More Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags Chart */}
        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <h2 className="text-xl font-bold text-foreground mb-4">Popular Tags</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareTagsData()} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  tick={{ fill: "var(--muted-foreground)" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
                <Bar dataKey="articles" name="Articles" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Authors Chart */}
        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <h2 className="text-xl font-bold text-foreground mb-4">Top Authors</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareTopAuthorsData()}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  tick={{ fill: "var(--muted-foreground)" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
                <Bar dataKey="articles" name="Articles" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  activity.type === "news"
                    ? "bg-primary/10 text-primary"
                    : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                }`}
              >
                {activity.type === "news" ? <FaNewspaper /> : <FaComments />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-foreground">
                    {activity.type === "news" ? (
                      <span>
                        New article published:{" "}
                        <Link
                          href={`/admin/dashboard/news/edit/${activity._id}`}
                          className="text-primary hover:underline"
                        >
                          {activity.title}
                        </Link>
                      </span>
                    ) : (
                      <span>
                        New comment on{" "}
                        <Link
                          href={`/${activity.newsId?.category}/${activity.newsId?.title}?id=${activity.newsId?._id}`}
                          className="text-primary hover:underline"
                        >
                          {activity.newsId?.title || "an article"}
                        </Link>
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(activity.date).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.type === "news" ? (
                    <span>
                      By {activity.author} in {activity.category}
                    </span>
                  ) : (
                    <span>
                      "{activity.comment.substring(0, 100)}
                      {activity.comment.length > 100 ? "..." : ""}" - {activity.name}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
          {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
            <p className="text-center text-muted-foreground py-4">No recent activity</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
