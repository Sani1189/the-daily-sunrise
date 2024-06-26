'use client'
import Trending from "@/app/components/Trending";
import { POST, GET } from "./api/news/route";
import { useEffect, useState } from "react";
import Featuring from "@/app/components/Featuring";
import Business from "@/app/components/Business";

export default function Home() {
  const [news, setNews] = useState([]);
  const [treandingNews, setTreandingNews] = useState([]);
  const [featuringNews, setFeaturingNews] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);
  
  useEffect(() => {
    fetch('api/news')
      .then(response => response.json())
      .then(data => setNews(data));
  }, []);
  useEffect(() => {
    setTreandingNews(news.filter((item) => item.tags.includes('trending')));
    setFeaturingNews(news.filter((item) => item.tags.includes('feature')));
    setBusinessNews(news.filter((item) => item.category == 'business'));

  }, [news]);

  return (

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
    </main>
  );
}
