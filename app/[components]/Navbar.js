"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { FaSearch, FaTimes, FaNewspaper, FaFutbol, FaGlobe, FaChevronDown } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [NewsDropdown, setNewsDropdown] = useState(false)
  const [SportsDropdown, setSportsDropdown] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isScrolled, setIsScrolled] = useState(false)
  const searchRef = useRef(null)
  const [activeLink, setActiveLink] = useState("")

  useEffect(() => {
    function closeDropdown(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([])
      }
      if (!e.target.closest(".dropdown-container")) {
        setNewsDropdown(false)
        setSportsDropdown(false)
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Set active link based on current path
    const path = window.location.pathname
    const category = path.split("/")[1]
    setActiveLink(category || "home")

    document.addEventListener("click", closeDropdown)
    window.addEventListener("scroll", handleScroll)

    return () => {
      document.removeEventListener("click", closeDropdown)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([])
      } else {
        const response = await fetch(`/api/news?searchQuery=${searchQuery}`)
        const data = await response.json()
        setSearchResults(data)
      }
    }

    const debounce = setTimeout(() => {
      if (searchQuery.length >= 3) {
        fetchSearchResults()
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleResultClick = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsMenuOpen(false)
  }

  const handleMenuItemClick = (category) => {
    setIsMenuOpen(false)
    setActiveLink(category)
  }

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5,
      },
    },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
      },
    },
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.nav
      className={`flex flex-col sticky top-0 z-50 transition-all duration-300 fancy-navbar ${isScrolled ? "shadow-lg" : ""}`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="bg-card">
        <div className="w-full md:w-11/12 lg:w-9/12 flex justify-between border-b border-border items-center m-auto p-2 sm:p-4">
          {/* Date Section: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:block">
            <p className="text-muted-foreground font-serif italic gradient-text">
              {new Date().toLocaleDateString("default", { weekday: "long" })} {new Date().toLocaleDateString()}{" "}
            </p>
          </div>

          <Link href="/" className="text-center p-3 transform transition-transform duration-300 hover:scale-105">
            <div className="relative">
              <motion.img
                src="/images/logo.png"
                alt="The Daily SunRise"
                className="h-auto sm:h-12 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-primary/70 to-primary/50"></div>
            </div>
          </Link>

          {/* Theme Toggle: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div
        className={`hidden md:flex space-x-1 justify-center items-center border-b border-border bg-background p-2 sm:p-4 ${isScrolled ? "py-2" : "py-4"} transition-all duration-300`}
      >
        {/* Home Link */}
        <Link href="/" legacyBehavior>
          <a
            className={`fancy-navbar-item ${activeLink === "home" ? "bg-primary/10 text-primary" : "text-foreground"}`}
            onClick={() => handleMenuItemClick("home")}
          >
            <span className="flex items-center">
              <FaNewspaper className="mr-1" /> Home
            </span>
          </a>
        </Link>

        {/* News Dropdown */}
        <div className="relative dropdown-container" onMouseLeave={() => setNewsDropdown(false)}>
          <button
            type="button"
            className={`fancy-navbar-item flex justify-between items-center ${activeLink === "bangladesh" || activeLink === "international" ? "bg-primary/10 text-primary" : "text-foreground"}`}
            onMouseEnter={() => setNewsDropdown(true)}
          >
            <span className="flex items-center">
              <FaGlobe className="mr-1" /> News <FaChevronDown className="ml-1 text-xs" />
            </span>
          </button>
          <AnimatePresence>
            {NewsDropdown && (
              <motion.div
                className="fancy-dropdown min-w-40 p-2"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
              >
                <Link href="/bangladesh" legacyBehavior>
                  <a
                    className="block py-2 px-4 text-foreground hover:bg-primary/10 hover:text-primary rounded-md transition-colors duration-200"
                    onClick={() => handleMenuItemClick("bangladesh")}
                  >
                    Bangladesh
                  </a>
                </Link>
                <Link href="/international" legacyBehavior>
                  <a
                    className="block py-2 px-4 text-foreground hover:bg-primary/10 hover:text-primary rounded-md transition-colors duration-200"
                    onClick={() => handleMenuItemClick("international")}
                  >
                    International
                  </a>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Sports Dropdown */}
        <div className="relative dropdown-container" onMouseLeave={() => setSportsDropdown(false)}>
          <button
            type="button"
            className={`fancy-navbar-item flex justify-between items-center ${activeLink === "cricket" || activeLink === "football" ? "bg-primary/10 text-primary" : "text-foreground"}`}
            onMouseEnter={() => setSportsDropdown(true)}
          >
            <span className="flex items-center">
              <FaFutbol className="mr-1" /> Sports <FaChevronDown className="ml-1 text-xs" />
            </span>
          </button>
          <AnimatePresence>
            {SportsDropdown && (
              <motion.div
                className="fancy-dropdown min-w-40 p-2"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
              >
                <Link href="/cricket" legacyBehavior>
                  <a
                    className="block py-2 px-4 text-foreground hover:bg-primary/10 hover:text-primary rounded-md transition-colors duration-200"
                    onClick={() => handleMenuItemClick("cricket")}
                  >
                    Cricket
                  </a>
                </Link>
                <Link href="/football" legacyBehavior>
                  <a
                    className="block py-2 px-4 text-foreground hover:bg-primary/10 hover:text-primary rounded-md transition-colors duration-200"
                    onClick={() => handleMenuItemClick("football")}
                  >
                    Football
                  </a>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Other Links */}
        {["business", "politics", "entertainment", "lifestyle", "technology"].map((category) => (
          <div className="text-center" key={category}>
            <Link href={`/${category}`} legacyBehavior>
              <a
                className={`fancy-navbar-item ${activeLink === category ? "bg-primary/10 text-primary" : "text-foreground"}`}
                onClick={() => handleMenuItemClick(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </a>
            </Link>
          </div>
        ))}
        {/* Search Box */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 text-foreground w-64 border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 bg-background/80 backdrop-blur-sm"
              placeholder="Search for news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors duration-300"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                className="absolute bg-popover/95 backdrop-blur-sm border border-border shadow-xl mt-2 w-64 rounded-xl z-10 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {searchResults.slice(0, 3).map((result) => (
                  <Link
                    key={result._id}
                    href={{
                      pathname: `/${result.category}/${result.title}`,
                      query: { id: result._id },
                    }}
                    legacyBehavior
                  >
                    <a
                      className="flex items-center py-3 px-4 hover:bg-primary/10 text-foreground transition-colors duration-200 border-b border-border last:border-0"
                      onClick={handleResultClick}
                    >
                      <img
                        src={result.image_url || "/placeholder.svg"}
                        alt={result.title}
                        className="w-12 h-12 object-cover rounded-md mr-3 shadow-sm"
                      />
                      <span className="font-medium line-clamp-2 text-sm">{result.title}</span>
                    </a>
                  </Link>
                ))}
                <div className="p-2 bg-primary/10">
                  <Link href={`/search?q=${searchQuery}`} legacyBehavior>
                    <a className="block text-center text-primary text-sm font-medium hover:underline">
                      View all results
                    </a>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex justify-between items-center bg-background px-4 py-3 border-b border-border">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.png" alt="The Daily SunRise" className="h-8" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-primary/10 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden flex flex-col bg-background p-4 space-y-2 border-t border-border shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <div className="grid grid-cols-2 gap-2">
              {["business", "politics", "entertainment", "sports", "lifestyle", "technology"].map((category) => (
                <motion.div key={category} variants={mobileItemVariants}>
                  <Link href={`/${category}`} legacyBehavior>
                    <a
                      className={`flex justify-center items-center text-sm px-4 py-3 mb-1 rounded-lg transition-colors duration-200 text-center ${
                        activeLink === category
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-secondary hover:bg-primary/10 hover:text-primary"
                      }`}
                      onClick={() => handleMenuItemClick(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </a>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div className="pt-2" variants={mobileItemVariants}>
              <div className="relative">
                <input
                  type="text"
                  className="pl-10 pr-8 py-3 text-foreground w-full border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background/90"
                  placeholder="Search for news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-destructive"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    className="bg-popover border border-border shadow-lg mt-2 w-full rounded-lg z-10 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {searchResults.slice(0, 3).map((result) => (
                      <Link
                        key={result._id}
                        href={{
                          pathname: `/${result.category}/${result.title}`,
                          query: { id: result._id },
                        }}
                        legacyBehavior
                      >
                        <a
                          className="flex items-center py-3 px-4 hover:bg-primary/10 text-foreground border-b border-border last:border-0"
                          onClick={handleResultClick}
                        >
                          <img
                            src={result.image_url || "/placeholder.svg"}
                            alt={result.title}
                            className="w-12 h-12 object-cover rounded-md mr-3"
                          />
                          <span className="font-medium line-clamp-2">{result.title}</span>
                        </a>
                      </Link>
                    ))}
                    <div className="p-2 bg-primary/10">
                      <Link href={`/search?q=${searchQuery}`} legacyBehavior>
                        <a className="block text-center text-primary text-sm font-medium">View all results</a>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
