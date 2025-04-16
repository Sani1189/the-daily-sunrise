import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"

const Featuring = ({ news }) => {
  const fnews = _.sortBy(news, "published_date").reverse()
  const bnews = fnews.filter((news) => news.country === "bangladesh")
  const inews = fnews.filter((news) => news.country === "international")

  const formatDate = (date) => {
    return format(new Date(date), "dd MMM, yyyy")
  }

  return (
    <div className="flex flex-col justify-between text-foreground border-b-2 p-4 border-border bg-gradient-to-r from-card to-background/50">
      <div className="flex items-center justify-center mt-3 mb-6">
        <div className="flex-grow border-t border-b border-primary h-2"></div>
        <h1 className="text-2xl sm:text-3xl text-center text-primary font-bold px-6 py-3 rounded-xl bg-primary/10 shadow-sm">
          Featuring Today
        </h1>
        <div className="flex-grow border-t border-b border-primary h-2"></div>
      </div>

      {bnews.length > 0 && inews.length > 0 && (
        <div className="flex flex-col xl:flex-row w-full p-2 gap-6">
          <div className="w-full xl:w-4/6">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-2xl sm:text-3xl text-primary font-bold mr-3 relative">
                Bangladesh
                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded"></span>
              </h1>
              <div className="flex-grow border-t border-primary h-2"></div>
            </div>

            <div className="grid grid-rows-9 sm:grid-rows-3 grid-flow-col gap-4 sm:gap-6 m-auto">
              <div className="row-span-5 sm:row-span-3 border-b-2 group">
                <Link
                  href={{
                    pathname: "/feature/" + encodeURIComponent(bnews[0].title),
                    query: { id: bnews[0]._id },
                  }}
                  className="block news-card"
                >
                  <div className="overflow-hidden">
                    <img
                      className="w-full h-64 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                      src={bnews[0].image_url || "/placeholder.svg"}
                      alt={bnews[0].title}
                    />
                  </div>
                  <div className="p-4">
                    <h1 className="font-bold text-xl lg:text-2xl mb-2 group-hover:text-primary transition-colors duration-300">
                      {bnews[0].title}
                    </h1>
                    <p className="text-muted-foreground mb-3 line-clamp-3">
                      {bnews[0].content.length > 100 ? `${bnews[0].content.substring(0, 150)}...` : bnews[0].content}
                    </p>
                    <div className="flex justify-between text-muted-foreground items-center">
                      <p className="font-medium">{bnews[0].author}</p>
                      <p className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {formatDate(bnews[0].published_date)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="row-span-3 sm:row-span-2 flex flex-col sm:flex-row justify-between gap-4 m-auto">
                {[1, 2].map((i) => (
                  <div key={i} className="w-full sm:w-1/2 border-b-2 group">
                    <Link
                      href={{
                        pathname: "/feature/" + encodeURIComponent(bnews[i].title),
                        query: { id: bnews[i]._id },
                      }}
                      className="block news-card h-full"
                    >
                      <div className="overflow-hidden">
                        <img
                          className="w-full h-48 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                          src={bnews[i].image_url || "/placeholder.svg"}
                          alt={bnews[i].title}
                        />
                      </div>
                      <div className="p-3">
                        <h1 className="font-bold text-lg lg:text-xl mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {bnews[i].title}
                        </h1>
                        <div className="flex justify-between text-muted-foreground items-center mt-auto">
                          <p className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {formatDate(bnews[i].published_date)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="row-span-1 m-0 space-y-2">
                {[3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-b border-border py-2 px-3 hover:bg-primary/5 transition-colors duration-300 rounded"
                  >
                    <Link
                      href={{
                        pathname: "/feature/" + encodeURIComponent(bnews[i].title),
                        query: { id: bnews[i]._id },
                      }}
                      className="block"
                    >
                      <h1 className="font-medium text-lg lg:text-xl hover:text-primary transition-colors duration-300">
                        {bnews[i].title}
                      </h1>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full xl:w-2/6">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-2xl sm:text-3xl text-primary font-bold ml-3 pl-3 md:ml-0 md:pl-0 relative">
                International
                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded"></span>
              </h1>
              <div className="flex-grow border-t border-primary h-2"></div>
            </div>
            <div className="flex flex-col ml-0 lg:ml-3 space-y-3">
              {inews.slice(0, 5).map((news, index) => (
                <Link
                  key={index}
                  href={{
                    pathname: "/feature/" + encodeURIComponent(news.title),
                    query: { id: news._id },
                  }}
                  className="flex flex-row-reverse lg:flex-row justify-end lg:justify-between border-b border-border p-2 my-1 lg:p-3 hover:bg-primary/5 transition-colors duration-300 rounded-lg"
                >
                  <h1 className="font-medium my-auto text-lg lg:text-xl p-2 lg:p-0 hover:text-primary transition-colors duration-300 line-clamp-2 flex-1">
                    {news.title}
                  </h1>
                  <img
                    className="w-24 h-20 rounded-lg my-auto object-cover shadow-sm"
                    src={news.image_url || "/placeholder.svg"}
                    alt={news.title}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Featuring
