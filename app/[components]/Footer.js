"use client"

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import { motion } from "framer-motion"

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.footer
      className="bg-card text-card-foreground py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div className="mb-6 md:mb-0" variants={itemVariants}>
            <a href="/" className="flex items-center">
              <h1 className="text-3xl font-bold gradient-text">The Daily SunRise</h1>
            </a>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Your trusted source for the latest news, in-depth analysis, and comprehensive coverage of events from
              around the world.
            </p>
            <div className="flex space-x-4 mt-6">
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin size={20} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="mb-6 text-lg font-semibold uppercase relative inline-block">
              Explore
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded"></span>
            </h2>
            <ul className="text-muted-foreground space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/politics" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Politics
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/business" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Business
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/technology" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Technology
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/sports" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Sports
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a
                  href="/entertainment"
                  className="hover:text-primary transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Entertainment
                </a>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="mb-6 text-lg font-semibold uppercase relative inline-block">
              Connect
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded"></span>
            </h2>
            <ul className="text-muted-foreground space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/about" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> About Us
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/contact" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Contact
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/careers" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Careers
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/advertise" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Advertise
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="/support" className="hover:text-primary transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Support
                </a>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="mb-6 text-lg font-semibold uppercase relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded"></span>
            </h2>
            <ul className="text-muted-foreground space-y-4">
              <motion.li
                className="flex items-start"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaMapMarkerAlt className="mt-1 mr-3 text-primary" />
                <span>123 News Street, Cityville, Country, 12345</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaPhone className="mr-3 text-primary" />
                <span>+1 (555) 123-4567</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaEnvelope className="mr-3 text-primary" />
                <span>contact@dailysunrise.com</span>
              </motion.li>
            </ul>
            <div className="mt-6">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Subscribe to newsletter"
                  className="px-4 py-2 w-full text-sm bg-secondary border border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                <motion.button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-r-md transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Daily Sunrise. All Rights Reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <motion.a
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="/cookie-policy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              whileHover={{ y: -2 }}
            >
              Cookie Policy
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
