import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"

const Business = ({ news }) => {
  const allnews = _.sortBy(news, "published_date").reverse()

  const businessnews = allnews.filter((news) => !news.tags.includes("feature") && !news.tags.includes("trending"))
  const bnews = businessnews.filter((news) => news.country === "bangladesh")
  const inews = businessnews.filter((news) => news.country === "international")
  const formatDate = (date) => {
    return format(new Date(date), "dd MMM, yyyy")
  }

  return (
    <div className="flex flex-col justify-between text-foreground border-b-2 p-4 border-border bg-gradient-to-r from-background/50 to-card">
      <div className="flex items-center justify-center mt-6 mb-8">
        <div className="flex-grow border-t border-b border-primary h-2"></div>
        <h1 className="text-2xl sm:text-3xl text-center text-primary font-bold p-3 rounded-xl bg-primary/10 shadow-sm">
          Business
        </h1>
        <div className="flex-grow border-t border-b border-primary h-2"></div>
      </div>

      {bnews.length > 0 && inews.length > 0 && (
        <div className="flex flex-col xl:flex-row w-full p-2 gap-6">
          <div className="grid grid-rows-4 grid-cols-1 lg:grid-cols-2 gap-6 m-auto w-full xl:w-4/6">
            <div className="row-span-4 flex flex-col">
              {inews.slice(0, 2).map((item, index) => (
                <Link
                  key={index}
                  href={{
                    pathname: "/business/" + item.title,
                    query: { id: item._id },
                  }}
                  className="grid grid-rows-1 grid-flow-col gap-4 m-auto mb-6 news-card p-3"
                >
                  <div className="row-span-1">
                    <h1 className="font-bold text-xl lg:text-2xl mb-2 news-title">{item.title}</h1>
                    <p className="text-muted-foreground mb-3 line-clamp-3">
                      {item.content.length > 100 ? `${item.content.substring(0, 100)}` : item.content}
                      <strong className="text-primary">...</strong>
                    </p>
                  </div>
                  <div className="row-span-1 p-2">
                    <img
                      className="h-full w-full object-cover rounded-lg shadow-md"
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                    />
                  </div>
                </Link>
              ))}
            </div>

            <Link
              key={0}
              href={{
                pathname: "/business/" + bnews[0].title,
                query: { id: bnews[0]._id },
              }}
              className="row-span-4 flex flex-col p-4 news-card"
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
                  src={bnews[0].image_url || "/placeholder.svg"}
                  alt={bnews[0].title}
                />
              </div>
              <h1 className="font-bold text-xl lg:text-2xl mb-3 news-title">{bnews[0].title}</h1>
              <p className="text-muted-foreground mb-4 flex-grow">
                {bnews[0].content.length > 100 ? `${bnews[0].content.substring(0, 150)}` : bnews[0].content}
                <strong className="text-primary">...</strong>
              </p>
              <div className="flex justify-between text-muted-foreground mt-auto items-center">
                <p className="font-medium">{bnews[0].author}</p>
                <p className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {formatDate(bnews[0].published_date)}
                </p>
              </div>
            </Link>
          </div>
          <div className="w-full xl:w-2/6 flex flex-col h-100 space-y-1">
            {inews.slice(2, 6).map((item, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/business/" + item.title,
                  query: { id: item._id },
                }}
                className="ml-0 lg:ml-2 border-b border-border p-3 hover:bg-primary/5 transition-colors duration-300 rounded-lg"
              >
                <h1 className="font-medium text-lg lg:text-xl hover:text-primary transition-colors duration-300">
                  {item.title}
                </h1>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">{item.author}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.published_date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Business
