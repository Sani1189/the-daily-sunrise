import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="mb-6 md:mb-0 transform transition-transform duration-500 hover:translate-y-[-5px]">
            <a href="/" className="flex items-center">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                The Daily SunRise
              </h1>
            </a>
            <p className="mt-3 text-gray-300 leading-relaxed">
              Your trusted source for the latest news, in-depth analysis, and comprehensive coverage of events from
              around the world.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div className="transform transition-transform duration-500 hover:translate-y-[-5px]">
            <h2 className="mb-6 text-lg font-semibold uppercase relative inline-block">
              Explore
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded"></span>
            </h2>
            <ul className="text-gray-300 space-y-3">
              <li>
                <a href="/politics" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Politics
                </a>
              </li>
              <li>
                <a href="/business" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Business
                </a>
              </li>
              <li>
                <a href="/technology" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Technology
                </a>
              </li>
              <li>
                <a href="/sports" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Sports
                </a>
              </li>
              <li>
                <a
                  href="/entertainment"
                  className="hover:text-blue-300 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Entertainment
                </a>
              </li>
            </ul>
          </div>

          <div className="transform transition-transform duration-500 hover:translate-y-[-5px]">
            <h2 className="mb-6 text-lg font-semibold uppercase relative inline-block">
              Connect
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded"></span>
            </h2>
            <ul className="text-gray-300 space-y-3">
              <li>
                <a href="/about" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Careers
                </a>
              </li>
              <li>
                <a href="/advertise" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Advertise
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Support
                </a>
              </li>
            </ul>
          </div>

          <div className="transform transition-transform duration-500 hover:translate-y-[-5px]">
            <h2 className="mb-6 text-lg font-semibold uppercase relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded"></span>
            </h2>
            <ul className="text-gray-300 space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-400" />
                <span>123 News Street, Cityville, Country, 12345</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-400" />
                <span>contact@dailysunrise.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Subscribe to newsletter"
                  className="px-4 py-2 w-full text-sm bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors duration-300"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} The Daily Sunrise. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy-policy"
              className="text-sm text-gray-400 hover:text-blue-300 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-sm text-gray-400 hover:text-blue-300 transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="/cookie-policy"
              className="text-sm text-gray-400 hover:text-blue-300 transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
