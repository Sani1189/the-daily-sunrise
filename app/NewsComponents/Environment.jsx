// components/Environment.jsx
import React from 'react';
import _ from 'lodash';
import { format } from 'date-fns';
import Link from 'next/link';

const Environment = ({ news }) => {
    const enews = _.sortBy(news, 'published_date').reverse();

    return (
        <div>
            <div className="flex items-center justify-center mt-3">
                <div className="flex-grow border-t border-b border-blue-700 h-2"></div>
                <h1 className="text-2xl sm:text-3xl text-center text-blue-700 font-bold p-1 rounded-xl">Environment</h1>
                <div className="flex-grow border-t border-b border-blue-700 h-2"></div>
            </div>

            {enews.length > 0 && (
                <div className="flex flex-col xl:flex-row justify-center p-2 xl:pl-3 gap-2 border-gray-400">
                    <div className='grid grid-rows-2 grid-cols-2 gap-2'>
                        {enews.slice(0, 4).map((item, index) => (
                            <Link key={index} href={{
                                pathname: '/environment/' + item.title, 
                                query: { id: item._id },
                            }} className='row-span-1 col-span-1 flex flex-col justify-end border-gray-300' 
                            style={{ backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
                                <div className="bg-black bg-opacity-40 m-2 rounded-lg">
                                    <h1 className='text-white text-center p-2 pb-0 font-bold text-1xl md:text-lg'>{item.title}</h1>
                                    <p className='hidden lg:block text-white text-center'>{format(new Date(item.published_date), 'dd/MM/yyyy')}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        {enews.slice(4, 10).map((item, index) => (
                            <Link key={index} href={{
                                pathname: '/environment/' + item.title,
                                query: { id: item._id },
                            }} className='flex flex-row border-b-2 border-gray-300'>
                                <img src={item.image_url} alt={item.title} className='object-cover my-auto h-24 w-24 p-1 rounded-full' />
                                <div className='flex flex-col h-auto justify-center p-2'>
                                    <h1 className='text-black font-bold text-1xl lg:text-lg'>{item.title}</h1>
                                    <p className='text-gray-500 flex flex-row justify-between'>
                                        <span>{item.author}</span>
                                        <span>{format(new Date(item.published_date), 'dd/MM/yyyy')}</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Environment;
