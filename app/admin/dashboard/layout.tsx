"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
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
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa"
import { useTheme } from "@/components/theme-provider"
import { toast } from "react-hot-toast"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [admin, setAdmin] = useState<{ fullName?: string; email?: string } | null>(null)
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
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                DS
              </div>
              <h1 className="ml-2 text-xl font-bold gradient-text">Daily Sunrise</h1>
            </Link>
            <button
              className="p-2 rounded-md lg:hidden text-foreground hover:bg-muted"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <span className="mr-3 text-lg">{theme === "dark" ? <FaSun /> : <FaMoon />}</span>
              <span>Toggle Theme</span>
            </button>
            <Link
              href="/admin/dashboard/profile"
              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                pathname === "/admin/dashboard/profile"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="mr-3 text-lg">
                <FaUser />
              </span>
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <span className="mr-3 text-lg">
                <FaSignOutAlt />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="p-2 rounded-md lg:hidden text-foreground hover:bg-muted"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars />
            </button>

            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard/notifications"
                className="relative p-2 text-foreground hover:text-primary transition-colors"
              >
                <FaBell />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </Link>
              <Link
                href="/admin/dashboard/profile"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <FaUser />
                </div>
                {!isMobile && (
                  <div className="hidden md:block text-sm">
                    <div className="font-medium">{admin?.fullName || "Admin"}</div>
                    <div className="text-xs text-muted-foreground">{admin?.email || "admin@example.com"}</div>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background/50 p-4">{children}</main>
      </div>
    </div>
  )
}
