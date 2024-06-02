import React from 'react';
import { FaFacebook , FaTwitter , FaInstagram , FaLinkedin } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <h1 className="text-3xl font-semibold">The Daily SunRise</h1>
            </a>
            <p className="mt-2 text-gray-400">Your daily source of news and updates.</p>
          </div>
          <div className="grid  gap-8 sm:gap-6 grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm lg:text-lg font-semibold uppercase">Explore</h2>
              <ul className="text-gray-400">
                <li className="mb-4">
                  <a href="/categories/politics" className="hover:text-white">Politics</a>
                </li>
                <li>
                  <a href="/categories/sports" className="hover:text-white">Sports</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm lg:text-lg font-semibold uppercase">Connect</h2>
              <ul className="text-gray-400">
                <li className="mb-4">
                  <a href="/about" className="hover:text-white">About Us</a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm lg:text-lgm font-semibold uppercase">Legal</h2>
              <ul className="text-gray-400">
                <li className="mb-4">
                  <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms-of-service" className="hover:text-white">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} The Daily Sunrise. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedin />
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
