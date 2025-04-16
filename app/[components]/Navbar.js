"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { FaSearch, FaTimes, FaMoon, FaSun, FaNewspaper, FaFutbol, FaGlobe, FaChevronDown } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [NewsDropdown, setNewsDropdown] = useState(false)
  const [SportsDropdown, setSportsDropdown] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [darkMode, setDarkMode] = useState(false)
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real implementation, you would apply dark mode to the document here
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
      <div className="bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="w-full md:w-11/12 lg:w-9/12 flex justify-between border-b border-blue-100 items-center m-auto p-2 sm:p-4">
          {/* Date Section: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:block">
            <p className="text-gray-600 font-serif italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {new Date().toLocaleDateString("default", { weekday: "long" })} {new Date().toLocaleDateString()}{" "}
            </p>
          </div>

          <Link href="/" className="text-center p-3 transform transition-transform duration-300 hover:scale-105">
            <div className="relative">
              <img src="/images/logo.png" alt="The Daily SunRise" className="h-auto sm:h-12 cursor-pointer" />
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>
          </Link>

          {/* Dark Button: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:flex justify-end">
            <motion.button
              type="button"
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-white rounded-lg text-sm px-5 py-2.5 transition-all duration-300 transform hover:scale-105 fancy-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-300" />}
              {darkMode ? "Light" : "Dark"}
            </motion.button>
          </div>
        </div>
      </div>
      <div
        className={`hidden md:flex space-x-1 justify-center items-center border-b border-blue-100 bg-white p-2 sm:p-4 ${isScrolled ? "py-2" : "py-4"} transition-all duration-300`}
      >
        {/* Home Link */}
        <Link href="/" legacyBehavior>
          <a
            className={`fancy-navbar-item ${activeLink === "home" ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
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
            className={`fancy-navbar-item flex justify-between items-center ${activeLink === "bangladesh" || activeLink === "international" ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
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
                    className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                    onClick={() => handleMenuItemClick("bangladesh")}
                  >
                    Bangladesh
                  </a>
                </Link>
                <Link href="/international" legacyBehavior>
                  <a
                    className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
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
            className={`fancy-navbar-item flex justify-between items-center ${activeLink === "cricket" || activeLink === "football" ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
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
                    className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                    onClick={() => handleMenuItemClick("cricket")}
                  >
                    Cricket
                  </a>
                </Link>
                <Link href="/football" legacyBehavior>
                  <a
                    className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
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
                className={`fancy-navbar-item ${activeLink === category ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
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
              className="pl-10 pr-4 py-2 text-gray-700 w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="Search for news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300"
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
                className="absolute bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl mt-2 w-64 rounded-xl z-10 overflow-hidden"
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
                      className="flex items-center py-3 px-4 hover:bg-blue-50 text-gray-700 transition-colors duration-200 border-b border-gray-100 last:border-0"
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
                <div className="p-2 bg-blue-50">
                  <Link href={`/search?q=${searchQuery}`} legacyBehavior>
                    <a className="block text-center text-blue-600 text-sm font-medium hover:underline">
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
      <div className="md:hidden flex justify-between items-center bg-white px-4 py-3 border-b border-blue-100">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.png" alt="The Daily SunRise" className="h-8" />
        </Link>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 text-gray-700"
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon />}
          </motion.button>
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-blue-100 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="md:hidden flex flex-col bg-white p-4 space-y-2 border-t border-blue-100 shadow-lg"
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
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "bg-gray-50 hover:bg-blue-50 hover:text-blue-600"
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
                  className="pl-10 pr-8 py-3 text-gray-700 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                  placeholder="Search for news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
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
                    className="bg-white border border-gray-200 shadow-lg mt-2 w-full rounded-lg z-10 overflow-hidden"
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
                          className="flex items-center py-3 px-4 hover:bg-blue-50 text-gray-700 border-b border-gray-100 last:border-0"
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
                    <div className="p-2 bg-blue-50">
                      <Link href={`/search?q=${searchQuery}`} legacyBehavior>
                        <a className="block text-center text-blue-600 text-sm font-medium">View all results</a>
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
