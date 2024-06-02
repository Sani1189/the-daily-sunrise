import React from 'react'
import _ from 'lodash'
import { format } from 'date-fns'


const Business = (news) => {
    const allnews = _.sortBy(news.news, 'published_date').reverse();

    const businessnews = allnews.filter(news => !news.tags.includes('feature') && !news.tags.includes('trending'));

    const bnews = businessnews.filter(news => news.country === "bangladesh");
    const inews = businessnews.filter(news => news.country === "international");
    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy')
    }

    console.log(bnews);
    console.log(inews);
    return (
        <div className="flex flex-col justify-between text-black border-b-2 p-1 border-gray-400">
            <div className="flex items-center justify-center mt-3">
                <div className="flex-grow border-t border-b border-red-600 h-2"></div>
                <h1 className="text-2xl sm:text-3xl text-center text-red-800 font-bold p-1 rounded-xl">Business</h1>
                <div className="flex-grow border-t border-b border-red-600 h-2"></div>
            </div>

            {bnews.length > 0 && inews.length > 0 && (
                <div className="flex flex-col xl:flex-row w-full p-2">
                    <div className="grid grid-rows-4 grid-cols-1  lg:grid-cols-2 gap-2  m-auto w-full xl:w-4/6">
                        <div class="row-span-4 flex flex-col border-b-2">
                            {
                                inews.slice(0, 2).map((item, index) => (
                                    <div key={index} class=" grid grid-rows-1  grid-flow-col gap-2  m-auto ">
                                        <div class="row-span-1 border-b-2">
                                            <h1 class="font-medium text-1xl lg:text-2xl">{item.title}</h1>
                                            <p class="p-1">{item.content.length > 100 ? `${item.content.substring(0, 100)}` : item.content}<strong>...</strong></p>
                                        </div>
                                        <div class="row-span-1 border-b-2 p-2">
                                            <img class="h-full max-w-full rounded-lg" src={item.image_url} alt={item.title} />
                                        </div>
                                    </div>
                                ))
                            }

                        </div>

                        <div class="row-span-4 flex flex-col border-b-2 p-2 ">
                            <img class="h-48 w-auto p-auto rounded-lg" src={bnews[0].image_url} alt={bnews[0].title} />
                            <h1 class="font-medium text-1xl lg:text-2xl">{bnews[0].title}</h1>
                            <p class="p-1">{bnews[0].content.length > 100 ? `${bnews[0].content.substring(0, 150)}` : bnews[0].content}<strong className='text-blue-500'>...</strong></p>
                            <div class="flex justify-between text-gray-500 m-1">
                                <p class="">{bnews[0].author}</p>
                                <p>{formatDate(bnews[0].published_date)}</p>
                            </div>

                        </div>
                    </div>
                    <div className="w-full xl:w-2/6 flex flex-col h-100">
                        {
                            inews.slice(2, 6).map((item, index) => (
                                <div key={index} className="ml-0 lg:ml-2 h-1/4 border-b-2  items-center">
                                    <h1 className="font-medium text-1xl lg:text-2xl">{item.title} </h1>
                                    <p className='pl-1 text-right text-gray-500'>{formatDate(item.published_date)}
                                    </p>
                                </div>


                            ))
                        }
                    </div>
                </div>

            )}

        </div>
    )
}

export default Business