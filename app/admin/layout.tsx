"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Skip auth check for login and register pages
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register"

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthPage) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/admin/profile")

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [isAuthPage, router])

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-xl text-foreground">Loading...</p>
          </div>
        </div>
        <Toaster position="top-right" />
      </ThemeProvider>
    )
  }

  // For auth pages (login/register), render without dashboard layout
  if (isAuthPage) {
    return (
      <ThemeProvider>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    )
  }

  // For dashboard pages, render only if authenticated
  return (
    <ThemeProvider>
      {isAuthenticated ? children : null}
      <Toaster position="top-right" />
    </ThemeProvider>
  )
}
