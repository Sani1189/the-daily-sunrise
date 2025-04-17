"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaNewspaper,
  FaComments,
  FaChartBar,
  FaUsers,
  FaTags,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
} from "react-icons/fa"
import { useTheme } from "@/components/theme-provider"
import { toast } from "react-hot-toast"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [admin, setAdmin] = useState(null)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch("/api/admin/profile")

        if (response.ok) {
          const data = await response.json()
          setAdmin(data)
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error)
      }
    }

    fetchAdminProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Logged out successfully")
        router.push("/admin/login")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartBar /> },
    { name: "News", path: "/admin/dashboard/news", icon: <FaNewspaper /> },
    { name: "Comments", path: "/admin/dashboard/comments", icon: <FaComments /> },
    { name: "Authors", path: "/admin/dashboard/authors", icon: <FaUsers /> },
    { name: "Categories", path: "/admin/dashboard/categories", icon: <FaTags /> },
    { name: "Notifications", path: "/admin/dashboard/notifications", icon: <FaBell /> },
    { name: "Settings", path: "/admin/dashboard/settings", icon: <FaCog /> },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:relative ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
        initial={false}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center">
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold gradient-text">Daily Sunrise</h1>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                DS
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-foreground hover:text-primary transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Admin Profile */}
        <div className={`px-4 py-4 border-b border-border ${!isSidebarOpen && "justify-center"}`}>
          <div className={`flex ${isSidebarOpen ? "items-start" : "flex-col items-center"} gap-3`}>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <FaUser />
            </div>
            {isSidebarOpen && admin && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{admin.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-primary/10 text-primary">
                  {admin.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center ${
                  isSidebarOpen ? "px-4" : "justify-center px-2"
                } py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t border-border p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className={`flex items-center ${
                isSidebarOpen ? "px-4" : "justify-center px-2"
              } py-2 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors`}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              {isSidebarOpen && <span className="ml-3">Toggle Theme</span>}
            </button>

            <button
              onClick={handleLogout}
              className={`flex items-center ${
                isSidebarOpen ? "px-4" : "justify-center px-2"
              } py-2 rounded-lg text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors`}
            >
              <FaSignOutAlt />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <FaBars size={20} />
            </button>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-foreground hover:text-primary transition-colors">
                <FaBell />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <FaUser />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background/50 p-4">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  )
}
