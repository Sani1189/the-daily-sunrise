// components/Tech.jsx
import React from 'react';
import _ from 'lodash';
import { format } from 'date-fns';
import Link from 'next/link';

const Tech = ({ news }) => {
    const tnews = _.sortBy(news, 'published_date').reverse();
    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy');
    }

    return (
        <div className='my-1 py-2 border-b-2'>
            <h1 className='text-3xl text-center text-black font-bold'>Technology</h1>
            <div className='flex flex-row justify-center w-full mx-auto gap-2 my-2'>
                {tnews.length > 0 && (
                    <Link href={{
                        pathname: '/technology/' + tnews[1].title,
                        query: { id: tnews[1]._id },
                    }} className='flex flex-row border-b-2 border-gray-300 w-full items-center justify-center'>
                        <img src={tnews[1].image_url} alt={tnews[1].title} className='h-auto w-1/2 lg:w-4/6 p-1 rounded-lg' />
                        <div className='flex flex-col w-1/2 lg:w-2/6 p-2'>
                            <h1 className='text-black font-bold text-1xl lg:text-3xl'>{tnews[1].title}</h1>
                            <p className='text-black py-2 hidden lg:block'>{tnews[0].content.length > 100 ? `${tnews[0].content.substring(0, 100)}` : tnews[0].content} <strong>...</strong></p>
                            <div className='flex justify-between text-gray-500 m-1'>
                                <p>{tnews[0].author}</p>
                                <p>{formatDate(tnews[0].published_date)}</p>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
            {tnews.length > 1 && (
                <div className='grid grid-cols-1 lg:grid-cols-5 bg-gray-100 gap-2 justify-center'>
                    {tnews.slice(1, 6).map((item, index) => (
                        <Link key={index} href={{
                            pathname: '/tech/' + item.title,
                            query: { id: item._id },
                        }} className='flex flex-col col-span-1 p-1 overflow-hidden rounded-lg hover:bg-gray-200 transition duration-200'>
                            <h1 className='text-black w-full font-bold text-1xl lg:text-lg'>{item.title}</h1>
                            <p className='text-gray-500'>
                                {formatDate(item.published_date)}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Tech;
