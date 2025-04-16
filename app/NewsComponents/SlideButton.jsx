"use client"

import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa"
import { useSwiper } from "swiper/react"

const SlideButton = () => {
  const swiper = useSwiper()
  return (
    <div className="bg-primary w-full">
      <div className="flex justify-between m-auto p-2 sm:p-4">
        <div className="flex justify-end items-center">
          <button onClick={() => swiper.slidePrev()} className="bg-secondary p-2 rounded-full">
            <FaChevronCircleLeft className="text-foreground" />
          </button>
          <button onClick={() => swiper.slideNext()} className="bg-secondary p-2 rounded-full">
            <FaChevronCircleRight className="text-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SlideButton
