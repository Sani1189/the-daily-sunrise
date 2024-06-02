'use client'
import Trending from "@/app/components/Trending";
import { POST, GET } from "./api/news/route";
import { useEffect, useState } from "react";
import Featuring from "@/app/components/Featuring";
import Business from "@/app/components/Business";
import Lifestyle from "@/app/components/Lifestyle";
import Entertainment from "@/app/components/Entertainment";
import Tech from "@/app/components/Tech";
import Football from "@/app/components/Football";
import Cricket from "@/app/components/Cricket";
import Environment from "@/app/components/Environment";
import Politics from "@/app/components/politics";
import Health from "@/app/components/Health";
import Opinion from "@/app/components/Opinion";

export default function Home() {
  const [news, setNews] = useState([]);
  const [treandingNews, setTreandingNews] = useState([]);
  const [featuringNews, setFeaturingNews] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);
  const [entertainment, setEntertainment] = useState([]);
  const [lifestyle, setLifestyle] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [politicsNews, setPoliticsNews] = useState([]);
  const [healthNews, setHealthNews] = useState([]);
  const [opinionNews, setOpinionNews] = useState([]);

  useEffect(() => {
    fetch('api/news')
      .then(response => response.json())
      .then(data => setNews(data));
  }, []);
  useEffect(() => {
    setOpinionNews(news.filter((item) => item.category == 'opinion'));
    setTreandingNews(news.filter((item) => item.tags.includes('trending')));
    setFeaturingNews(news.filter((item) => item.tags.includes('feature')));
    setBusinessNews(news.filter((item) => item.category == 'business'));
    setEntertainment(news.filter((item) => item.category == 'entertainment'));
    setLifestyle(news.filter((item) => item.category == 'lifestyle'));
    setTechNews(news.filter((item) => item.category == 'technology'));
    setSportsNews(news.filter((item) => item.category == 'sports'));
    setEnvironment(news.filter((item) => item.category == 'environment'));
    setPoliticsNews(news.filter((item) => item.category == 'politics'));
    setHealthNews(news.filter((item) => item.category == 'health'));
  }, [news]);

  return (
    <div>
      {
      news.length > 0 && (
        <main className="flex-col font-serif w-full md:w-9/12 bg-white bg-white m-auto py-2 ">
        <section >
          <Trending news={treandingNews} />
        </section>
        <section>
          <Featuring news={featuringNews} />
        </section>
        <section >
          <Business news={businessNews} />
        </section>
        <section >  
          <Politics news={politicsNews} />
          </section>
        <section >
          <Environment news={environment} />
        </section>
        <section>
            <Opinion news={opinionNews} />
          </section>
        <section className="grid grid-rows-4 lg:grid-rows-2 grid-flow-col gap-2 lg:gap-4 border-gray-500" >
          <div className="row-span-2 pb-2 border-b-2">
            <Lifestyle news={lifestyle} />
          </div>
          <div className="row-span-2 pb-2 border-b-2">
            <Entertainment news={entertainment} />
          </div>
        </section>
        <section>
          <Tech news={techNews} />
        </section>
        <section >
          <h1 className="text-3xl w-100 text-center text-black font-bold ">Sports</h1>
          <div className="grid grid-rows-4 lg:grid-rows-2 grid-flow-col gap-2 lg:gap-4  ">
            <Cricket news={sportsNews} />
            <Football news={sportsNews} />
          </div>
        </section>
        <section>
          <Health news={healthNews} />
        </section>

      </main>
      )
    }
    </div>
  );
}
