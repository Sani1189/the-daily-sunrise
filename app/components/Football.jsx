import React from 'react'
import _ from 'lodash'
import { format } from 'date-fns';

const Football = (news) => {
    const fnews = _.sortBy(news.news, 'published_date').reverse();
    const tnews = fnews.filter(news => news.tags.includes('football'));
    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy')
    }
    return (
        <div className='my-1 py-2 border-b-2 w-100 row-span-2'>
            <h1 className='text-3xl text-end text-red-800 font-bold '>Football</h1>
            <div className='flex flex-row justify-center w-full mx-auto  gap-2 my-2'>
                {tnews.length > 0 && (
                    <div className='flex flex-row-reverse border-b-2 p-2 gap-2 w-full items-center justify-center'>
                        <img src={tnews[1].image_url} alt={tnews[1].title} className='h-auto w-1/2  rounded-lg' />
                        <div className='flex flex-col w-1/2 p-2'>
                            <h1 className='text-black font-bold text-1xl lg:text-3xl'>{tnews[1].title}</h1>
                            
                            <div className='flex justify-between text-gray-500 m-1'>
                                <p>{tnews[1].author}</p>
                                <p>{formatDate(tnews[1].published_date)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {
                tnews.length > 1 && (
                    <div className='grid grid-cols-1 lg:grid-cols-2 bg-gray-100 gap-2 justify-center '>
                        {
                            tnews.slice(2, 4).map((item, index) => (
                                <div key={index} className='flex flex-col col-span-1 p-1'>
                                    <h1 className='text-black  w-full font-bold text-1xl lg:text-lg'>{item.title}</h1>
                                    <p className='text-gray-500'>
                                        {formatDate(item.published_date)}
                                    </p>
                                    
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}


export default Football