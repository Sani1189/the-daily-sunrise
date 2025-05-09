import { format } from "date-fns"
import Link from "next/link"

const Politics = ({ news }) => {
  const sortedNews = news.sort((a, b) => new Date(b.published_date) - new Date(a.published_date))

  return (
    <section className="p-6 bg-gradient-to-r from-card to-background/50">
      <header className="mb-8">
        <div className="flex items-center justify-center mt-3">
          <div className="flex-grow border-t border-b border-primary h-2"></div>
          <h1 className="text-2xl sm:text-3xl text-center text-primary font-bold p-3 rounded-xl bg-primary/10 shadow-sm">
            Politics
          </h1>
          <div className="flex-grow border-t border-b border-primary h-2"></div>
        </div>
      </header>

      {sortedNews.length > 0 && (
        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {sortedNews.slice(0, 6).map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card"
            >
              <div className="overflow-hidden h-48">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover h-full w-full transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-5">
                <Link
                  href={{
                    pathname: "/politics/" + item.title,
                    query: { id: item._id },
                  }}
                >
                  <h3 className="text-foreground font-bold text-xl mb-3 hover:text-primary transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-4 line-clamp-2">{item.content.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-foreground">{item.author}</p>
                  <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {format(new Date(item.published_date), "dd MMM, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </article>
      )}
    </section>
  )
}

export default Politics
