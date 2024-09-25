"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [NewsDropdown, setNewsDropdown] = useState(false);
  const [SportsDropdown, setSportsDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    function closeDropdown() {
      setNewsDropdown(false);
      setSportsDropdown(false);
    }
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
      } else {
        const response = await fetch(`/api/news?searchQuery=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleResultClick = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false); 
  };

  return (
    <nav className="flex flex-col">
      <div className="">
        <div className="w-full md:w-9/12 flex justify-between border-b-2 border-gray-200 items-center bg-white m-auto p-2 sm:p-4">
          {/* Date Section: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:block">
            <p className="text-black font-serif">
              {new Date().toLocaleDateString("default", { weekday: "long" })}{" "}
              {new Date().toLocaleDateString()}{" "}
            </p>
          </div>

          <Link href="/" className="text-center p-3">
            <img
              src="/images/logo.png"
              alt="The Daily SunRise"
              className="h-auto sm:h-12 cursor-pointer hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Dark Button: Hidden on mobile */}
          <div className="text-center basis-1/4 hidden md:block">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Dark
            </button>
          </div>
        </div>

      </div>
      <div className="hidden md:flex space-x-1 flex justify-center items-center border-b-2 border-gray-400 bg-white p-2 sm:p-4">
        {/* News Dropdown */}
        <div className="relative" onMouseLeave={() => setNewsDropdown(false)}>
          <button
            type="button"
            className="text-black flex justify-between items-center focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200"
            onMouseEnter={() => setNewsDropdown(true)}
          >
            News
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 10 6"
            >
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
            <div className="absolute top-12 left-0 bg-white shadow-lg p-2">
              <Link href="/bangladesh" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  Bangladesh
                </a>
              </Link>
              <Link href="/international" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  International
                </a>
              </Link>
            </div>
          )}
        </div>
        {/* Sports Dropdown */}
        <div className="relative" onMouseLeave={() => setSportsDropdown(false)}>
          <button
            type="button"
            className="flex justify-between items-center text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200"
            onMouseEnter={() => setSportsDropdown(true)}
          >
            Sports
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 10 6"
            >
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
            <div className="absolute top-12 left-0 bg-white shadow-lg p-2">
              <Link href="/cricket" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  Cricket
                </a>
              </Link>
              <Link href="/football" legacyBehavior>
                <a
                  className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200"
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
                className="text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200"
                onClick={handleMenuItemClick}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </a>
            </Link>
          </div>
        ))}
        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            className="px-4 py-2 text-black w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-4 text-3xl text-red-500 hover:text-red-800"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
          {searchResults.length > 0 && (
            <div className="absolute bg-white border border-gray-300 shadow-lg mt-2 w-64 rounded-md z-10">
              {searchResults.slice(0, 3).map((result) => (
                <Link
                  key={result.id}
                  href={{
                    pathname: `/${result.category}/${result.title}`,
                    query: { id: result._id },
                  }}
                  legacyBehavior
                >
                  <a
                    className="flex items-center py-3 px-4 hover:bg-blue-50 text-gray-700"
                    onClick={handleResultClick}
                  >
                    <img
                      src={result.image_url}
                      alt={result.title}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <span className="font-semibold">{result.title}</span>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden grid place-content-end mr-3">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-8 h-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden flex flex-col bg-white p-4 space-y-2 border-t border-gray-300">
          {["business", "politics", "entertainment", "sports", "lifestyle", "technology"].map((category) => (
            <div className="text-center" key={category}>
              <Link href={`/${category}`} legacyBehavior>
                <a
                  className="text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 mb-2 hover:bg-gray-200 transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </a>
              </Link>
            </div>
          ))}
          <div className="relative">
            <input
              type="text"
              className="px-4 text-center py-2 text-black w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-4 text-3xl text-red-500 hover:text-red-800"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
            {searchResults.length > 0 && (
              <div className="absolute bg-white border border-gray-300 shadow-lg mt-2 w-full rounded-md z-10">
                {searchResults.slice(0, 3).map((result) => (
                  <Link
                    key={result.id}
                    href={{
                      pathname: `/${result.category}/${result.title}`,
                      query: { id: result._id },
                    }}
                    legacyBehavior
                  >
                    <a
                      className="flex items-center py-3 px-4 hover:bg-blue-50 text-gray-700"
                      onClick={handleResultClick}
                    >
                      <img
                        src={result.image_url}
                        alt={result.title}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <span className="font-semibold">{result.title}</span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
