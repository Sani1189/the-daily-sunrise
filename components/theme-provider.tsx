"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ColorScheme = "default" | "red" | "rose" | "orange" | "green" | "blue" | "violet"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
}

type ThemeProviderState = {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (colorScheme: ColorScheme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorScheme: "default",
  setTheme: () => null,
  setColorScheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "default",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme)

  useEffect(() => {
    const root = window.document.documentElement

    // Load saved preferences from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColorScheme = localStorage.getItem("color-scheme") as ColorScheme

    if (savedTheme) {
      setTheme(savedTheme)
    }

    if (savedColorScheme) {
      setColorScheme(savedColorScheme)
    }

    // Remove all theme and color scheme classes
    root.classList.remove(
      "light",
      "dark",
      "theme-default",
      "theme-red",
      "theme-rose",
      "theme-orange",
      "theme-green",
      "theme-blue",
      "theme-violet",
    )

    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Apply color scheme
    root.classList.add(`theme-${colorScheme}`)
  }, [theme, colorScheme])

  const value = {
    theme,
    colorScheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem("theme", theme)
      setTheme(theme)
    },
    setColorScheme: (colorScheme: ColorScheme) => {
      localStorage.setItem("color-scheme", colorScheme)
      setColorScheme(colorScheme)
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
