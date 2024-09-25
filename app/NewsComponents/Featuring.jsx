// components/Featuring.jsx
import React from 'react';
import _ from 'lodash';
import { format } from 'date-fns';
import Link from 'next/link';

const Featuring = ({ news }) => {
  const fnews = _.sortBy(news, 'published_date').reverse();
  const bnews = fnews.filter((news) => news.country === "bangladesh");
  const inews = fnews.filter((news) => news.country === "international");

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <div className="flex flex-col justify-between text-black border-b-2 p-4 border-gray-400">
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

            <div className="grid grid-rows-9 sm:grid-rows-3 grid-flow-col gap-2 sm:gap-4 m-auto">
              <div className="row-span-5 sm:row-span-3 border-b-2">
                <Link href={{
                  pathname: '/feature/' + encodeURIComponent(bnews[0].title),
                  query: { id: bnews[0]._id },
                }}>
                  <img className="w-full h-auto rounded-lg" src={bnews[0].image_url} alt={bnews[0].title} />
                  <h1 className="font-medium text-lg lg:text-2xl">{bnews[0].title}</h1>
                  <p className="p-1">{bnews[0].content.length > 100 ? `${bnews[0].content.substring(0, 150)}...` : bnews[0].content}</p>
                  <div className="flex justify-between text-gray-500 m-1">
                    <p>{bnews[0].author}</p>
                    <p>{formatDate(bnews[0].published_date)}</p>
                  </div>
                </Link>
              </div>

              <div className="row-span-3 sm:row-span-2 flex flex-row justify-between gap-2 m-auto">
                {[1, 2].map((i) => (
                  <div key={i} className="w-1/2 border-b-2">
                    <Link href={{
                      pathname: '/feature/' + encodeURIComponent(bnews[i].title),
                      query: { id: bnews[i]._id },
                    }}>
                      <img className="w-full h-auto rounded-lg" src={bnews[i].image_url} alt={bnews[i].title} />
                      <h1 className="font-medium text-lg lg:text-2xl">{bnews[i].title}</h1>
                      <div className="flex justify-between text-gray-500 m-1">
                        <p>{formatDate(bnews[i].published_date)}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="row-span-1 m-0">
                {[3, 4].map((i) => (
                  <div key={i} className="border-b-2">
                    <Link href={{
                      pathname: '/feature/' + encodeURIComponent(bnews[i].title),
                      query: { id: bnews[i]._id },
                    }}>
                      <h1 className="font-medium text-lg lg:text-2xl">{bnews[i].title}</h1>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='w-full xl:w-2/6'>
            <div className="flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl text-green-700 font-bold mb-2 ml-3 pl-3 md:ml-0 md:pl-0">International</h1>
              <div className="flex-grow border-t border-green-800 h-2"></div>
            </div>
            <div className="flex flex-col ml-0 lg:ml-3">
              {inews.slice(0, 5).map((news, index) => (
                <Link key={index} href={{
                  pathname: '/feature/' + encodeURIComponent(news.title),
                  query: { id: news._id },
                }} className="flex flex-row-reverse lg:flex-row justify-end lg:justify-between border-b-2 p-0 my-1 lg:p-1">
                  <h1 className="font-medium my-auto text-lg lg:text-2xl p-2 lg:p-0">{news.title}</h1>
                  <img className="w-24 h-16 rounded-lg my-auto" src={news.image_url} alt={news.title} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Featuring;
