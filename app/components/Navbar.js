"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function Navbar() {

  const [NewsDropdown, setNewsDropdown] = useState(false);
  const [SportsDropdown, setSportsDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the dropdown when the user clicks outside of it
  useEffect(() => {
    function closeDropdown() {
      setNewsDropdown(false);
      setSportsDropdown(false);
    }
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    // Navbar
    <nav className='flex flex-col'>
      {/* First line */}
      <div className=''>
        <div className='w-full md:w-9/12 flex justify-between border-b-2 border-gray-200 items-center bg-white m-auto p-2 sm:p-4' >
          <div className='text-center basis-1/4'>
            {/* current day name and a date*/}
            <p className='text-black font-serif'>{new Date().toLocaleDateString('default', { weekday: 'long' })} {new Date().toLocaleDateString()} </p>
          </div>
          <div className='text-center p-3'>
            {/* The Daily SunRise logo responsive for mobile and large viewports*/}
            <img src='/images/logo.png' alt='The Daily SunRise' className='h-auto sm:h-12' />
          </div>
          <div className='text-center basis-1/4'>
            {/* The darkmode and lightmode button */}
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">Dark</button>
          </div>
        </div>
      </div>
      <div className='hidden md:flex space-x-1 flex justify-center items-center border-b-2 border-gray-400 bg-white p-2 sm:p-4'>
        <div className='relative' onMouseLeave={() => setNewsDropdown(false)}>
          {/* Button triggers dropdown on mouse enter and is part of the div that handles mouse leave */}
          <button type="button" className="text-black flex justify-between items-center focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 " onMouseEnter={() => setNewsDropdown(true)}>News<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg></button>
          {/* Dropdown */}
          {NewsDropdown && (
            <div className="absolute top-12 left-0 bg-white shadow-lg p-2">
              <Link href="/bangladesh" legacyBehavior>
                <a className="block py-2 px-4 text-black hover:bg-gray-200">Bangladesh</a>
              </Link>
              <Link href="/international" legacyBehavior>
                <a className="block py-2 px-4 text-black hover:bg-gray-200">International</a>
              </Link>
            </div>
          )}
        </div>
        {/* for sports */}
        <div className="relative" onMouseLeave={() => setSportsDropdown(false)}>
          {/* Button triggers dropdown on mouse enter and is part of the div that handles mouse leave */}
          <button type="button" className="flex justify-between items-center text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 " onMouseEnter={() => setSportsDropdown(true)}>Sports<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg></button>
          {/* Dropdown */}
          {SportsDropdown && (
            <div className="absolute top-12 left-0 bg-white shadow-lg p-2">
              <Link href="/cricket" legacyBehavior>
                <a className="block py-2 px-4 text-black hover:bg-gray-200">Cricket</a>
              </Link>
              <Link href="/football" legacyBehavior>
                <a className="block py-2 px-4 text-black hover:bg-gray-200">Football</a>
              </Link>
            </div>
          )}
        </div>
        <div className='text-center'>
          <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">Business</button>
        </div>
        <div className='text-center'>
          <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">Entertainment</button>
        </div>
        <div className='text-center'>
          <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">LifeStyle</button>
        </div>
        <div className='text-center'>
          <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">Technology</button>
        </div>
        <div>
          <input type="search" className="px-4 py-2 w-48" placeholder="Search..." />
        </div>
      </div>
      <div className='md:hidden grid place-content-end mr-3'>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {/* Hamburger Icon changing when is open */}
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>

        </button>
      </div>
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <a href="#" className='text-center block py-2 px-4 text-sm hover:bg-gray-200'>Home</a>
        {/* Your mobile nav items here all contents of large view */}
        <div className="flex flex-col">
          <div className='flex flex-col justify-center items-center' onMouseLeave={() => setNewsDropdown(false)}>
            {/* Button triggers dropdown on mouse enter and is part of the div that handles mouse leave */}
            <button type="button" className="text-black flex justify-between items-center focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 " onMouseEnter={() => setNewsDropdown(true)}>News<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg></button>
            {/* Dropdown */}
            {NewsDropdown && (
              <div className="top-12 left-0 bg-white shadow-lg p-2">
                <Link href="/bangladesh" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200">Bangladesh</a>
                </Link>
                <Link href="/international" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200">International</a>
                </Link>
              </div>
            )}
          </div>
          {/* for sports */}
          <div className="flex flex-col justify-center items-center" onMouseLeave={() => setSportsDropdown(false)}>
            {/* Button triggers dropdown on mouse enter and is part of the div that handles mouse leave */}
            <button type="button" className="flex justify-between items-center text-black focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2 " onMouseEnter={() => setSportsDropdown(true)}>Sports<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg></button>
            {/* Dropdown */}
            {SportsDropdown && (
              <div className=" top-12 left-0 bg-white shadow-lg p-2">
                <Link href="/cricket" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200">Cricket</a>
                </Link>
                <Link href="/football" legacyBehavior>
                  <a className="block py-2 px-4 text-black hover:bg-gray-200">Football</a>
                </Link>
              </div>
            )}
          </div>
          <div className="text-center">
            <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">Business</button>
          </div>
          <div className="text-center">
            <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">Entertainment</button>
          </div>
          <div className="text-center">
            <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">LifeStyle</button>
          </div>
          <div className="text-center">
            <button type="button" className="text-black  focus:outline-none focus:ring-4 text-sm px-5 py-2.5 me-2 mb-2">Technology</button>
          </div>
          <div>
            <input type="search" className="px-4 py-2 w-48" placeholder="Search..." />


          </div>
        </div>
      </div>

    </nav>


  );
}
