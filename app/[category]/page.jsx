'use client'
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Page({ params }) {
    const category = params.category;
    const [articles, setArticles] = useState([]);
    const [visibleArticles, setVisibleArticles] = useState(8); // Control number of visible articles

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                let url;

                // Determine the fetch URL based on the category
                if (['bangladesh', 'international', 'usa', 'uk', 'canada'].includes(category.toLowerCase())) {
                    url = `/api/news?country=${category}`;
                } else if (['football', 'cricket'].includes(category.toLowerCase())) {
                    url = `/api/news?tags=${category}`;
                } else {
                    url = `/api/news?category=${category}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                setArticles(data); // Assuming the data is an array of articles
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, [category]);

    const sortedArticles = _.sortBy(articles, 'published_date').reverse(); // Sort articles by published date

    const handleShowMore = () => {
        setVisibleArticles(prev => prev + 8); // Increase the number of visible articles
    };

    return (
        <div className="max-w-screen-xl mx-auto p-5">
            <div className="flex items-center justify-center my-8">
                <div className="flex-grow border-t border-b border-gray-300 h-1"></div>
                <h1 className="text-3xl sm:text-4xl text-center text-gray-800 font-bold p-3 mx-4 rounded-md bg-gray-100 shadow-lg">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </h1>
                <div className="flex-grow border-t border-b border-gray-300 h-1"></div>
            </div>

            {sortedArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {sortedArticles.slice(0, 6).map((item, index) => (
                        <Link 
                            key={index} 
                            href={{
                                pathname: `/${item.category}/${item.title}`, // Dynamic path using category
                                query: { id: item._id },
                            }} 
                            className='flex flex-col border rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105'
                        >
                            <img src={item.image_url} alt={item.title} className='object-cover h-48 w-full' />
                            <div className="p-4 bg-white">
                                <h1 className='text-gray-800 font-semibold text-lg'>{item.title}</h1>
                                <p className='text-gray-500 text-sm'>{format(new Date(item.published_date), 'dd/MM/yyyy')}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortedArticles.slice(6, visibleArticles).map((item, index) => (
                    <Link 
                        key={index} 
                        href={{
                            pathname: `/${item.category}/${item.title}`,
                            query: { id: item._id },
                        }} 
                        className='flex flex-row border-b border-gray-200 p-4 transition hover:bg-gray-50'
                    >
                        <img src={item.image_url} alt={item.title} className='object-cover h-32 w-32 rounded-lg shadow-lg' />
                        <div className='flex flex-col justify-center ml-4'>
                            <h1 className='text-gray-800 font-semibold text-lg'>{item.title}</h1>
                            <p className='text-gray-500 text-sm flex justify-between'>
                                <span>{item.author}</span>
                                <span>{format(new Date(item.published_date), 'dd/MM/yyyy')}</span>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {visibleArticles < sortedArticles.length && (
                <div className="flex justify-center mt-6">
                    <button 
                        onClick={handleShowMore} 
                        className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-800 transition duration-300"
                    >
                        Show More News
                    </button>
                </div>
            )}
        </div>
    );
}

