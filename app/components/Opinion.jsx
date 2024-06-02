import React from 'react';
import _ from 'lodash';
import { format } from 'date-fns';

const Opinion = ({ news }) => {
    console.log(news);
    const oNews = _.sortBy(news, 'published_date').reverse();
    console.log(oNews);

    return (
        <div className="bg-gray-100 rounded-lg px-3 py-2 mb-5">
            <div className="flex items-center justify-center mt-3 mb-6">
                <div className="flex-grow border-t border-b border-red-600 h-2"></div>
                <h1 className="text-2xl sm:text-3xl text-center text-red-800 font-bold p-1 rounded-xl">Opinion</h1>
                <div className="flex-grow border-t border-b border-red-600 h-2"></div>
            </div>
            {oNews.length > 0 && (
                <div className="grid gap-8 text-black px-4 py-5 lg:grid-cols-3 lg:px-8">
                    {oNews.slice(0, 2).map((item, index) => (
                        <div key={index} className="border-2 border-gray-300 rounded-xl bg-white p-4 relative shadow-lg">
                            <div className="flex flex-col  items-center lg:items-start">
                                <img src={item.image_url} alt={item.title} className="w-36 h-36 m-auto object-cover rounded-full border-2 border-gray-300 mb-4" />
                                <p className="text-gray-600 mb-2 m-auto">{item.author}</p>
                                <h2 className="text-xl italic text-gray-800 text-center m-auto ">
                                    <span className="text-red-600 text-2xl font-bold pr-1">&#8220;</span>
                                    {item.title}
                                    <span className="text-red-600 text-2xl font-bold pl-1">&#8221;</span>
                                </h2>
                            </div>
                            <div className="w-3 h-32 bg-red-600 absolute top-2 rounded-lg left-0 transform -translate-x-1/2"></div>
                        </div>
                    ))}
                    <div className="lg:col-span-1 m-auto p-auto">
                        {oNews.slice(2, 5).map((item, index) => (
                            <div key={index} className="flex items-center mb-6 ">
                                <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-full mr-4 border-2 border-gray-300" />
                                <div>
                                    <div>
                                        <h3 className="text-lg text-gray-800 italic">
                                            <span className=" pr-1">&#8220;</span>
                                            {item.title}
                                            <span className=" pl-1">&#8221;</span>
                                        </h3>
                                    </div>
                                    <p className="text-gray-600">{item.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Opinion;
