// components/Trending.jsx
'use client';
import React from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { GrLinkNext } from "react-icons/gr";
import Link from 'next/link';
import { useSwiper } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";

const Trending = ({ news }) => {
    const tnews = news;
    const swiper = useSwiper();

    return (
        <div className="flex flex-row justify-center border-b-2 pb-4 border-gray-400">
            <div className="w-full">
                <div className='w-full flex-row justify-between items-center m-auto p-4'>
                    <div className='flex justify-between items-center text-gray-800'>
                        <h1 className="text-3xl font-bold">Trending News</h1>
                        <Link href="/trending" legacyBehavior>
                            <a className="flex items-center py-2 px-4 text-black hover:bg-gray-200 rounded-md">
                                <h2 className="text-xl px-2">View All</h2>
                                <GrLinkNext className='text-xl' />
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
                        <div className='flex justify-center items-center'>
                            {
                                tnews.map((item, index) => (
                                    <SwiperSlide key={index} className='flex justify-center pt-2'>
                                        <Link href={{
                                            pathname: '/trending/' + item.title,
                                            query: { id: item._id },
                                        }} className='flex flex-row justify-between w-full'>
                                            <div className='flex w-1/2 p-2'>
                                                <img className='object-cover h-40 w-full rounded-lg' src={item.image_url} alt={item.title} />
                                            </div>
                                            <div className='w-1/2 inline-block align-middle border-l-2 border-gray-400 pl-4'>
                                                <h2 className='text-black text-xl md:text-lg font-bold'>{item.title}</h2>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))
                            }
                        </div>
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default Trending;
