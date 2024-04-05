import React from 'react'
import _ from 'lodash'

const Business = (news) => {
    const allnews = _.sortBy(news.news, 'published_date').reverse();

    const businessnews = allnews.filter(news => !news.tags.includes('feature') && !news.tags.includes('trending'));

    const bnews = businessnews.filter(news => news.country === "bangladesh");
    const inews = businessnews.filter(news => news.country === "international");
    console.log(bnews);
    console.log(inews);
    return (
        <div className="flex flex-col justify-between text-black border-b-2 p-1 border-gray-400">
            <h1 className="text-2xl sm:text-3xl text-center text-red-800 font-bold p-1 rounded-xl">Business</h1>
            {bnews.length > 0 && inews.length > 0 && (
                <div className="grid grid-rows-4  grid-flow-col gap-2  m-auto">
                <div class="row-span-4 flex flex-col border-b-2">
                    {
                        inews.slice(0, 2).map((item, index) => (
                            <div key={index} class=" grid grid-rows-1  grid-flow-col gap-2  m-auto ">
                                <div class="row-span-1 border-b-2">
                                    <h1 class="font-medium text-1xl lg:text-2xl">{item.title}</h1>
                                    <p class="p-1">{item.content.length > 100 ? `${item.content.substring(0, 100)}` : item.content}</p>
                                </div>
                                <div class="row-span-1 border-b-2">
                                    <img class="w-full h-auto" src={item.image_url} alt={item.title} />
                                </div>
                            </div>
                        ))
                    }

                </div>

                <div class="row-span-4 flex flex-col border-b-2">
                    <img class="w-full h-auto" src={bnews[0].image_url} alt={bnews[0].title} />
                    <h1 class="font-medium text-1xl lg:text-2xl">{bnews[0].title}</h1>
                    <p class="p-1">{bnews[0].content.length > 100 ? `${bnews[0].content.substring(0, 150)}` : bnews[0].content}</p>
                </div>
                {
                    inews.slice(2,6).map((item, index) => (
                        <div key={index} class="row-span-1  border-b-2">
                            <h1 class="font-medium text-1xl lg:text-2xl">{item.title}</h1>
                            </div>
                    ))
                }

            </div>
            )}

        </div>
    )
}

export default Business