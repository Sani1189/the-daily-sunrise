import React from 'react'
import _ from 'lodash'
import { format } from 'date-fns'

const Featuring = (news) => {
  const fnews = _.sortBy(news.news, 'published_date').reverse();
  const bnews = fnews.filter(news => news.country === "bangladesh");
  const inews = fnews.filter(news => news.country === "international");

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }

  return (
    <div className="flex flex-col justify-between text-black border-b-2 p-1 border-gray-400">
      <div className="flex items-center justify-center mt-3">
        <div className="flex-grow border-t border-b border-green-800 h-2"></div>
        <h1 className="text-2xl sm:text-3xl text-center text-green-900 font-bold px-4 py-2 rounded-xl">Featuring Today</h1>
        <div className="flex-grow border-t border-b border-green-800 h-2"></div>
      </div>

      {bnews.length > 0 && inews.length > 0 && (
        <div className="flex flex-col xl:flex-row w-full p-2">
          <div className="w-full xl:w-4/6 ">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl text-green-700 font-bold mb-2 mr-3">Bangladesh</h1>
              <div className="flex-grow border-t border-green-800 h-2"></div>
            </div>

            <div className="grid grid-rows-9 sm:grid-rows-3  grid-flow-col gap-2 sm:gap-4  m-auto">

              <div class="row-span-5 sm:row-span-3 border-b-2">
                <img class="w-full h-auto rounded-lg" src={bnews[0].image_url} alt={bnews[0].title} />
                <h1 class="font-medium text-1xl lg:text-2xl">{bnews[0].title}</h1>
                <p class="p-1">{bnews[0].content.length > 100 ? `${bnews[0].content.substring(0, 150)}` : bnews[0].content}</p>
                <div class="flex justify-between text-gray-500 m-1">
                  <p class="">{bnews[0].author}</p>
                  <p>{formatDate(bnews[0].published_date)}</p>
                </div>
              </div>

              <div class="row-span-3 sm:row-span-2 flex flex-row justify-between gap-2  m-auto ">
                <div class="w-1/2 border-b-2">
                  <img class="w-full h-auto rounded-lg" src={bnews[1].image_url} alt={bnews[1].title} />
                  <h1 class="font-medium text-1xl lg:text-2xl">{bnews[1].title}</h1>
                  <div class="flex justify-between text-gray-500 m-1">

                    <p>{formatDate(bnews[1].published_date)}</p>
                  </div>
                </div>
                <div class="w-1/2 border-b-2">
                  <img class="w-full h-auto rounded-lg" src={bnews[2].image_url} alt={bnews[2].title} />
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
          <div className="flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl text-green-700 font-bold mb-2 ml-3 pl-3 md:ml-0 md:pl-0">International</h1>
              <div className="flex-grow border-t border-green-800 h-2"></div>
            </div>
            <div className="flex flex-col ml-0 lg:ml-3">
              {
                inews.slice(0, 5).map((news, index) => (
                  <div key={index} className="flex flex-row-reverse lg:flex-row justify-end lg:justify-between  border-b-2 p-0 my-1 lg:p-1 ">
                    <h1 class="font-medium  my-auto text-1xl lg:text-2xl p-2 lg:p-0 ">{news.title}</h1>
                    <img class="w-24 h-16 rounded-lg my-auto" src={news.image_url} alt={news.title} />

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