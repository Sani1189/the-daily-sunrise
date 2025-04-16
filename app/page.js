"use client"
import { useEffect, useState } from "react"
import Trending from "@/app/NewsComponents/Trending"
import Featuring from "@/app/NewsComponents/Featuring"
import Business from "@/app/NewsComponents/Business"
import Lifestyle from "@/app/NewsComponents/Lifestyle"
import Entertainment from "@/app/NewsComponents/Entertainment"
import Tech from "@/app/NewsComponents/Tech"
import Football from "@/app/NewsComponents/Football"
import Cricket from "@/app/NewsComponents/Cricket"
import Environment from "@/app/NewsComponents/Environment"
import Politics from "@/app/NewsComponents/politics"
import Health from "@/app/NewsComponents/Health"
import Opinion from "@/app/NewsComponents/Opinion"

export default function Home() {
  const [news, setNews] = useState([])
  const [treandingNews, setTreandingNews] = useState([])
  const [featuringNews, setFeaturingNews] = useState([])
  const [businessNews, setBusinessNews] = useState([])
  const [entertainment, setEntertainment] = useState([])
  const [lifestyle, setLifestyle] = useState([])
  const [techNews, setTechNews] = useState([])
  const [sportsNews, setSportsNews] = useState([])
  const [environment, setEnvironment] = useState([])
  const [politicsNews, setPoliticsNews] = useState([])
  const [healthNews, setHealthNews] = useState([])
  const [opinionNews, setOpinionNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await fetch("api/news")
        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    setOpinionNews(news.filter((item) => item.category == "opinion"))
    setTreandingNews(news.filter((item) => item.tags.includes("trending")))
    setFeaturingNews(news.filter((item) => item.tags.includes("feature")))
    setBusinessNews(news.filter((item) => item.category == "business"))
    setEntertainment(news.filter((item) => item.category == "entertainment"))
    setLifestyle(news.filter((item) => item.category == "lifestyle"))
    setTechNews(news.filter((item) => item.category == "technology"))
    setSportsNews(news.filter((item) => item.category == "sports"))
    setEnvironment(news.filter((item) => item.category == "environment"))
    setPoliticsNews(news.filter((item) => item.category == "politics"))
    setHealthNews(news.filter((item) => item.category == "health"))
  }, [news])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Loading News</h2>
        <p className="text-gray-500">Please wait while we fetch the latest stories...</p>
      </div>
    )
  }

  return (
    <div>
      {news.length > 0 && (
        <main className="flex-col font-serif w-full md:w-9/12 bg-white m-auto py-2 fade-in">
          <section className="transform transition-all duration-500">
            <Trending news={treandingNews} />
          </section>
          <section className="transform transition-all duration-500">
            <Featuring news={featuringNews} />
          </section>
          <section className="transform transition-all duration-500">
            <Business news={businessNews} />
          </section>
          <section className="transform transition-all duration-500">
            <Politics news={politicsNews} />
          </section>
          <section className="transform transition-all duration-500">
            <Environment news={environment} />
          </section>
          <section className="transform transition-all duration-500">
            <Opinion news={opinionNews} />
          </section>
          <section className="grid grid-rows-4 lg:grid-rows-2 grid-flow-col gap-4 lg:gap-6 border-gray-500 transform transition-all duration-500">
            <div className="row-span-2 pb-2 border-b-2">
              <Lifestyle news={lifestyle} />
            </div>
            <div className="row-span-2 pb-2 border-b-2">
              <Entertainment news={entertainment} />
            </div>
          </section>
          <section className="transform transition-all duration-500">
            <Tech news={techNews} />
          </section>
          <section className="transform transition-all duration-500">
            <h1 className="text-3xl w-100 text-center text-gray-800 font-bold mb-6 relative inline-block">
              Sports
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded"></span>
            </h1>
            <div className="grid grid-rows-4 lg:grid-rows-2 grid-flow-col gap-4 lg:gap-6">
              <Cricket news={sportsNews} />
              <Football news={sportsNews} />
            </div>
          </section>
          <section className="transform transition-all duration-500">
            <Health news={healthNews} />
          </section>
        </main>
      )}
    </div>
  )
}
