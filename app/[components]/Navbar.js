"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { FaSearch, FaTimes, FaMoon, FaSun } from "react-icons/fa"

export default function Navbar() {
  const [NewsDropdown, setNewsDropdown] = useState(false)
  const [SportsDropdown, setSportsDropdown] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchRef] = useState(useRef(null))

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

  const handleMenuItemClick = () => {
    setIsMenuOpen(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real implementation, you would apply dark mode to the document here
  }

  return (
    <nav className={`flex flex-col sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      <div className="bg-white">
        <div className="w-full md:w-9/12 flex justify-between border-b-2 border-gray-200 items-center m-auto p-2 sm:p-4">
          {/* Date Section: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:block">
            <p className="text-gray-600 font-serif italic">
              {new Date().toLocaleDateString("default", { weekday: "long" })} {new Date().toLocaleDateString()}{" "}
            </p>
          </div>

          <Link href="/" className="text-center p-3 transform transition-transform duration-300 hover:scale-105">
            <img src="/images/logo.png" alt="The Daily SunRise" className="h-auto sm:h-12 cursor-pointer" />
          </Link>

          {/* Dark Button: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:flex justify-end">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300 transform hover:scale-105"
            >
              {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-300" />}
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`hidden md:flex space-x-1 justify-center items-center border-b-2 border-gray-400 bg-white p-2 sm:p-4 ${isScrolled ? "py-2" : "py-4"} transition-all duration-300`}
      >
        {/* News Dropdown */}
        <div className="relative dropdown-container" onMouseLeave={() => setNewsDropdown(false)}>
          <button
            type="button"
            className="text-black flex justify-between items-center focus:outline-none text-sm px-5 py-2.5 me-2 mb-2 hover:bg-blue-50 rounded-md transition-colors duration-300"
            onMouseEnter={() => setNewsDropdown(true)}
          >
            News
            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {NewsDropdown && (
            <div className="absolute top-12 left-0 bg-white shadow-lg p-2 rounded-md border border-gray-100 min-w-40 z-10 fade-in">
              <Link href="/bangladesh" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  Bangladesh
                </a>
              </Link>
              <Link href="/international" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  International
                </a>
              </Link>
            </div>
          )}
        </div>
        {/* Sports Dropdown */}
        <div className="relative dropdown-container" onMouseLeave={() => setSportsDropdown(false)}>
          <button
            type="button"
            className="flex justify-between items-center text-black focus:outline-none text-sm px-5 py-2.5 me-2 mb-2 hover:bg-blue-50 rounded-md transition-colors duration-300"
            onMouseEnter={() => setSportsDropdown(true)}
          >
            Sports
            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {SportsDropdown && (
            <div className="absolute top-12 left-0 bg-white shadow-lg p-2 rounded-md border border-gray-100 min-w-40 z-10 fade-in">
              <Link href="/cricket" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  Cricket
                </a>
              </Link>
              <Link href="/football" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  Football
                </a>
              </Link>
            </div>
          )}
        </div>
        {/* Other Links */}
        {["business", "politics", "entertainment", "lifestyle", "technology"].map((category) => (
          <div className="text-center" key={category}>
            <Link href={`/${category}`} legacyBehavior>
              <a
                className="text-black focus:outline-none text-sm px-5 py-2.5 me-2 mb-2 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-300"
                onClick={handleMenuItemClick}
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
              className="pl-10 pr-4 py-2 text-black w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
          {searchResults.length > 0 && (
            <div className="absolute bg-white border border-gray-300 shadow-lg mt-2 w-64 rounded-md z-10 fade-in">
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
                    className="flex items-center py-3 px-4 hover:bg-blue-50 text-gray-700 transition-colors duration-200"
                    onClick={handleResultClick}
                  >
                    <img
                      src={result.image_url || "/placeholder.svg"}
                      alt={result.title}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <span className="font-semibold line-clamp-2">{result.title}</span>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.png" alt="The Daily SunRise" className="h-8" />
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 text-gray-700">
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden flex flex-col bg-white p-4 space-y-2 border-t border-gray-300 shadow-lg slide-up">
          <div className="grid grid-cols-2 gap-2">
            {["business", "politics", "entertainment", "sports", "lifestyle", "technology"].map((category) => (
              <Link href={`/${category}`} key={category} legacyBehavior>
                <a
                  className="text-black focus:outline-none text-sm px-4 py-3 mb-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-center"
                  onClick={handleMenuItemClick}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </a>
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-8 py-3 text-black w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {searchResults.length > 0 && (
              <div className="bg-white border border-gray-300 shadow-lg mt-2 w-full rounded-md z-10">
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
                      <span className="font-semibold line-clamp-2">{result.title}</span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
