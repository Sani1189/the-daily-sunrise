"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaNewspaper, FaComments, FaUsers, FaEye, FaThumbsUp, FaTag, FaGlobe, FaUserEdit } from "react-icons/fa"
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
} from "recharts"

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/stats")

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          console.error("Failed to fetch dashboard stats")
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Prepare chart data
  const prepareNewsActivityData = () => {
    if (!stats?.recentNews) return []

    // Create an array of the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    // Map the data
    return last7Days.map((date) => {
      const found = stats.recentNews.find((item) => item._id === date)
      return {
        date,
        news: found ? found.count : 0,
        comments: stats.recentComments.find((item) => item._id === date)?.count || 0,
      }
    })
  }

  const prepareCategoryData = () => {
    if (!stats?.newsByCategory) return []
    return stats.newsByCategory.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
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
            <FaEye className="text-primary mr-1" />
            <span className="text-muted-foreground">Most viewed: Politics</span>
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
            <FaThumbsUp className="text-primary mr-1" />
            <span className="text-muted-foreground">Engagement rate: 8.5%</span>
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

        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.newsByCategory?.length || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FaTag size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaGlobe className="text-primary mr-1" />
            <span className="text-muted-foreground">Top category: {stats?.newsByCategory?.[0]?._id || "N/A"}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Activity Chart */}
      <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
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

        {/* Countries Chart */}
        <motion.div className="bg-card rounded-xl shadow-sm p-6 border border-border" variants={itemVariants}>
          <h2 className="text-xl font-bold text-foreground mb-4">Articles by Country</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareCountryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareCountryData().map((entry, index) => (
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
    </motion.div>
  )
}
