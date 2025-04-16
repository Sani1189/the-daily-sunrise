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
import { AnimatedSection } from "@/components/animated-section"
import { motion } from "framer-motion"

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
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.h2
          className="text-xl font-bold text-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading News
        </motion.h2>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Please wait while we fetch the latest stories...
        </motion.p>
      </div>
    )
  }

  return (
    <div>
      {news.length > 0 && (
        <main className="flex-col font-serif w-full md:w-9/12 bg-background m-auto py-2 fade-in">
          <AnimatedSection>
            <Trending news={treandingNews} />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Featuring news={featuringNews} />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Business news={businessNews} />
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <Politics news={politicsNews} />
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <Environment news={environment} />
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <Opinion news={opinionNews} />
          </AnimatedSection>

          <AnimatedSection
            delay={0.6}
            className="grid grid-rows-4 lg:grid-rows-2 grid-flow-col gap-4 lg:gap-6 border-border"
          >
            <div className="row-span-2 pb-2 border-b-2 border-border">
              <Lifestyle news={lifestyle} />
            </div>
            <div className="row-span-2 pb-2 border-b-2 border-border">
              <Entertainment news={entertainment} />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.7}>
            <Tech news={techNews} />
          </AnimatedSection>

          <AnimatedSection delay={0.8}>
            <h1 className="text-3xl w-100 text-center text-foreground font-bold mb-6 relative inline-block gradient-text">
              Sports
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded"></span>
            </h1>
            <div className="grid grid-rows-4 lg:grid-rows-2 grid-flow-col gap-4 lg:gap-6">
              <Cricket news={sportsNews} />
              <Football news={sportsNews} />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.9}>
            <Health news={healthNews} />
          </AnimatedSection>
        </main>
      )}
    </div>
  )
}
