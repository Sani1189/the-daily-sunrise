'use client'
import React from 'react'
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { GrLinkNext } from "react-icons/gr";
import Link from 'next/link';

import { useSwiper } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import "swiper/css";
import "swiper/css/navigation";
import { FaTimes, FaInfoCircle } from 'react-icons/fa';


const Trending = (news) => {
    const handleCrossClick = () => {
        setShowBackground(false);
        setAdMessage('Google Ad\nWhy this ad?\nNot wanna see?');
      };
    
      const handleInfoHover = () => {
        setAdMessage('Google Ad');
      };
    
      const handleInfoLeave = () => {
        setAdMessage('');
      };
    
      
      const [showInfo, setShowInfo] = useState(false);
      const [adMessage, setAdMessage] = useState('');
      const [showBackground, setShowBackground] = useState(true);
    
    const tnews=news.news;
    const swiper = useSwiper();
    console.log(tnews);
    return (
        <div  className="flex flex-row justify-center border-b-2 pb-2 border-gray-400">
        <div className="w-full md:w-5/6">
        <div className='w-full flex-row justify-between items-center m-auto p-2 '>
            <div className='flex justify-between items-center  text-gray-800 p-2'>
            <h1 className="text-2xl sm:text-3xl font-bold ">Trending News</h1>
            <Link href="/bangladesh" legacyBehavior>
                <a className="flex justify-between py-2 px-4 text-black hover:bg-gray-200">
                    <h2 className="text-1xl sm:text-2xl px-2">View All</h2>
                    <GrLinkNext className='text-1xl sm:text-2xl py-auto m-auto' />
                </a>
              </Link>
            </div>
            <Swiper 
                modules={[Navigation, Pagination, Autoplay]}
                onNavigationNext={() => swiper.slideNext()}
                onNavigationPrev={() => swiper.slidePrev()}
                pagination={{
                    clickable: true
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 40
                    },
                    1324: {
                        slidesPerView: 3,
                        spaceBetween: 50
                    }
                }}
            >

                <div className='flex justify-center items-center '>
                    {
                        tnews.map((item, index) => (
                            <SwiperSlide key={index} className='flex justify-center  pt-2 '>
                                <div className='flex flex-row justify-between'>
                                    <div className='flex w-1/2 '>
                                        <img className='object-cover h-36 ' src={item.image_url} alt={item.title} />
                                    </div>
                                    <div className='w-1/2 inline-block align-middle  border-r-2 border-gray-400'>
                                        <h2 className='text-black text-2xl md:text-lg font-bold pl-1'>{item.title}</h2>
                                        </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </div>

            </Swiper>
            
        </div>
        </div>
        <div className="hidden lg:block md:w-1/6 bg-ad">
        <div className="relative">
      {showBackground && (
        <div className="overflow-hidden absolute" id="google_image_div" style={{ background: 'transparent', lineHeight: 0 }}>
          <a
            id="aw0"
            target="_blank"
            href="https://www.google.com"
            onFocus={() => console.log('Focus')}
            onMouseDown={() => console.log('MouseDown')}
            onMouseOver={() => console.log('MouseOver')}
            onClick={() => console.log('Click')}
          >
            <div className="relative">
              <img
                src="/images/google.png"
                alt=""
                className="img_ad"
                width="300"
                height="250"
                border="0"
              />
              <div className="absolute top-0 right-0 m-2 text-black">
                <FaTimes onClick={handleCrossClick} />
              </div>
              <div className="absolute top-0 left-0 m-2 text-black cursor-pointer" onMouseEnter={handleInfoHover} onMouseLeave={handleInfoLeave}>
                <FaInfoCircle />
              </div>
              {showInfo && <div className="absolute top-0 left-0 bg-gray-800 bg-opacity-75 text-black text-center py-2">
                Google Ad
              </div>}
            </div>
          </a>
        </div>
      )}
      {!showBackground && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-75 text-white text-center flex justify-center items-center">
          <div>
            <p>{adMessage}</p>
          </div>
        </div>
      )}
    </div>
        </div>
        </div>
        
    )
}
export default Trending