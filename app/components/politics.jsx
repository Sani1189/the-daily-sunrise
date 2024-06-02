import React from 'react';
import { format } from 'date-fns';

const politics = (news) => {
    // Sort news by published date (descending)
    const sortedNews = news.news.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));

    return (
        <section className="p-4">
            <header className="mb-6">
                <div className="flex items-center justify-center mt-3">
                    <div className="flex-grow border-t border-b border-red-600 h-2"></div>
                    <h1 className="text-2xl sm:text-3xl text-center text-red-800 font-bold p-1 rounded-xl">Politics</h1>
                    <div className="flex-grow border-t border-b border-red-600 h-2"></div>
                </div>
            </header>

            {sortedNews.length > 0 && (
                <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedNews.slice(0, 6).map((item, index) => (
                        <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                            <img src={item.image_url} alt={item.title} className="object-cover h-48 w-full" />
                            <div className="p-4">
                                <h3 className="text-gray-800 font-bold text-xl mb-2">{item.title}</h3>
                                <p className="text-gray-600">{format(new Date(item.published_date), 'MMMM dd, yyyy')}</p>
                            </div>
                        </div>
                    ))}
                </article>
            )}
        </section>
    );
};

export default politics;
