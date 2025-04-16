// components/Trending.jsx
"use client"
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSwiper } from "swiper/react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"
import { motion } from "framer-motion"
import { FaTag, FaCalendarAlt, FaUser } from "react-icons/fa"
import { format } from "date-fns"

const Trending = ({ news }) => {
  const tnews = news
  const swiper = useSwiper()

  const formatDate = (date) => {
    return format(new Date(date), "dd MMM, yyyy")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div
      className="flex flex-row justify-center border-b-2 pb-6 border-border bg-gradient-to-r from-primary/5 via-background to-primary/5 rounded-xl shadow-md"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="w-full">
        <div className="w-full flex-row justify-between items-center m-auto p-6">
          <motion.div className="flex justify-between items-center text-foreground mb-6" variants={itemVariants}>
            <div>
              <h1 className="text-3xl font-bold relative gradient-text">
                Trending News
                <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/50 rounded"></span>
              </h1>
              <p className="text-muted-foreground mt-2">Stay updated with the most popular stories</p>
            </div>
            <Link href="/trending" legacyBehavior>
              <motion.a
                className="fancy-button flex items-center py-2 px-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h2 className="text-xl px-2">View All</h2>
                <ArrowRight className="h-5 w-5" />
              </motion.a>
            </Link>
          </motion.div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            onNavigationNext={() => swiper.slideNext()}
            onNavigationPrev={() => swiper.slidePrev()}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1324: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="trending-swiper"
          >
            <div className="flex justify-center items-center">
              {tnews.map((item, index) => (
                <SwiperSlide key={index} className="flex justify-center pt-2 pb-10">
                  <Link
                    href={{
                      pathname: "/trending/" + item.title,
                      query: { id: item._id },
                    }}
                    className="flex flex-col md:flex-row justify-between w-full fancy-card group h-full overflow-hidden"
                  >
                    <div className="flex w-full md:w-1/2 p-0 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        className="object-cover h-48 md:h-full w-full transition-transform duration-500 group-hover:scale-110"
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                      />
                    </div>
                    <div className="w-full md:w-1/2 inline-block align-middle p-4 md:border-l-2 md:border-border bg-gradient-to-br from-card to-card/80">
                      <h2 className="text-card-foreground text-xl md:text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
                        {item.content.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.tags.slice(0, 2).map((tag, idx) => (
                          <Link href={`/tag/${tag}`} key={idx}>
                            <span className="tag-pill text-xs">
                              <FaTag className="mr-1" /> {tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm text-foreground flex items-center">
                          <FaUser className="mr-1 text-primary" /> {item.author}
                        </span>
                        <span className="text-xs flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full">
                          <FaCalendarAlt className="mr-1" /> {formatDate(item.published_date)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Read full story <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>
    </motion.div>
  )
}

export default Trending
