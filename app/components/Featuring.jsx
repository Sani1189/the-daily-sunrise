import React from 'react'
import _ from 'lodash'
import { FaYandexInternational } from 'react-icons/fa';
import { format } from 'date-fns'

const Featuring = (news) => {
  const fnews = _.sortBy(news.news, 'published_date').reverse();
  const bnews = fnews.filter(news => news.country === "bangladesh");
  const inews = fnews.filter(news => news.country === "international");
  console.log(bnews);

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }

  return (
    <div className="flex flex-col justify-between text-black border-b-2 p-1 border-gray-400">
      <h1 className="text-2xl sm:text-3xl text-center bg-gray-100 font-bold p-1 rounded-xl">Featuring Today</h1>
      {bnews.length > 0 && inews.length > 0 && (
        <div className="flex flex-col xl:flex-row w-full p-2">
          <div className="w-full xl:w-4/6 ">
            <h1 className="text-2xl sm:text-3xl border-b-2 font-medium mb-2 ">Bangladesh</h1>
          <div className="grid grid-rows-9 sm:grid-rows-3  grid-flow-col gap-2 sm:gap-4  m-auto">
            
            <div class="row-span-5 sm:row-span-3 border-b-2">
              <img class="w-full h-auto " src={bnews[0].image_url} alt={bnews[0].title} />
              <h1 class="font-medium text-1xl lg:text-2xl">{bnews[0].title}</h1>
              <p class="p-1">{bnews[0].content.length > 100 ? `${bnews[0].content.substring(0, 150)}` : bnews[0].content}</p>
              <div class="flex justify-between text-gray-500 m-1">
                <p class="">{bnews[0].author}</p>
                <p>{formatDate(bnews[0].published_date)}</p>
              </div>
            </div>

            <div class="row-span-3 sm:row-span-2 flex flex-row justify-between gap-2  m-auto ">
              <div class="w-1/2 border-b-2">
                <img class="w-full h-auto" src={bnews[1].image_url} alt={bnews[1].title} />
                <h1 class="font-medium text-1xl lg:text-2xl">{bnews[1].title}</h1>
                <div class="flex justify-between text-gray-500 m-1">
                  
                  <p>{formatDate(bnews[1].published_date)}</p>
                </div>
              </div>
              <div class="w-1/2 border-b-2">
                <img class="w-full h-auto" src={bnews[2].image_url} alt={bnews[2].title} />
                <h1 class="font-medium text-1xl lg:text-2xl">{bnews[2].title}</h1>
                <div class="flex justify-between text-gray-500 m-1">
                  <p>{formatDate(bnews[2].published_date)}</p>
                </div>
              </div>
            </div>
            <div class="row-span-1  m-0">
              
            <div class="border-b-2">
              <h1 class="font-medium text-1xl lg:text-2xl">{bnews[3].title}</h1>
            </div>
            <div class="border-b-2">
              <h1 class="font-medium text-1xl lg:text-2xl">{bnews[4].title}</h1>
            </div>
            </div>
          </div>
          </div>
          <div className='w-full xl:w-2/6'>
            <h1 className="font-medium text-2xl p-0 xl:ml-5 xl:pl-5 sm:text-3xl border-b-2 mb-2 ">International</h1>
          <div className=" flex  flex-col p-0 xl:ml-5 xl:pl-5 xl:border-l-2">
            {
              inews.slice(0,5).map((news, index) => (
                <div key={index} className="flex flex-row-reverse xl:flex-row justify-end xl:justify-between  border-b-2 m-1 p-1">
                  <h1 class="font-medium text-1xl lg:text-2xl p-2 xl:p-0 ">{news.title}</h1>
                  <img class="w-24 h-16" src={news.image_url} alt={news.title} />
                  
                  </div>
              ))
            }
             
             
          </div>
          </div>
        </div>

      )
      }
    </div>
  )
}

export default Featuring