"use client";
import { useState, useEffect } from "react";
import Link from "next/link";


export default function Navbar() {
  const [NewsDropdown, setNewsDropdown] = useState(false);
  const [SportsDropdown, setSportsDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); (false);

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
      }
      else {
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
  };

  return (
    <nav className="flex flex-col">
      <div className="">
        <div className="w-full md:w-9/12 flex justify-between border-b-2 border-gray-200 items-center bg-white m-auto p-2 sm:p-4">
          <div className="text-center basis-1/4">
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
          <div className="text-center basis-1/4">
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
                <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                  Bangladesh
                </a>
              </Link>
              <Link href="/international" legacyBehavior>
                <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                  International
                </a>
              </Link>
            </div>
          )}
        </div>
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
                <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                  Cricket
                </a>
              </Link>
              <Link href="/football" legacyBehavior>
                <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                  Football
                </a>
              </Link>
            </div>
          )}
        </div>
        <div className="text-center">
          <Link href="/business" legacyBehavior>
            <a className="text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200">
              Business
            </a>
          </Link>
        </div>
        <div className="text-center">
          <Link href="/politics" legacyBehavior>
            <a className="text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200">
              Politics
            </a>
          </Link>
        </div>
        <div className="text-center">
          <Link href="/entertainment" legacyBehavior>
            <a className="text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200">
              Entertainment
            </a>
          </Link>
        </div>
        <div className="text-center">
          <Link href="/lifestyle" legacyBehavior>
            <a className="text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200">
              LifeStyle
            </a>
          </Link>
        </div>
        <div className="text-center">
          <Link href="/technology" legacyBehavior>
            <a className="text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200 transition-colors duration-200">
              Technology
            </a>
          </Link>
        </div>
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
              className="absolute right-4  text-3xl text-red-500 hover:text-red-800"
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
      <div className="md:hidden grid place-content-end mr-3">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <Link href="/" legacyBehavior>
          <a className="text-center block py-2 px-4 text-sm hover:bg-gray-200 transition-colors duration-200">
            Home
          </a>
        </Link>
        <div className="flex flex-col">
          <div
            className="flex flex-col justify-center items-center"
            onMouseLeave={() => setNewsDropdown(false)}
          >
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
              <div className="absolute bg-white shadow-lg p-2">
                <Link href="/bangladesh" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                    Bangladesh
                  </a>
                </Link>
                <Link href="/international" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                    International
                  </a>
                </Link>
              </div>
            )}
          </div>
          <div
            className="flex flex-col justify-center items-center"
            onMouseLeave={() => setSportsDropdown(false)}
          >
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
              <div className="absolute bg-white shadow-lg p-2">
                <Link href="/cricket" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                    Cricket
                  </a>
                </Link>
                <Link href="/football" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200 transition-colors duration-200">
                    Football
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
