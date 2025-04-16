import _ from "lodash"
import Link from "next/link"

const Entertainment = ({ news }) => {
  const enews = _.sortBy(news, "published_date").reverse()

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl text-center text-foreground font-bold p-1 mb-6 relative inline-block">
        Entertainment
        <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded"></span>
      </h1>

      {enews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 lg:pr-3">
          {enews.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="flex flex-col border-b border-border group overflow-hidden rounded-xl shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card"
            >
              <Link
                href={{
                  pathname: "/entertainment/" + item.title,
                  query: { id: item._id },
                }}
                className="block"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={`Image for ${item.title}`}
                    className="object-cover h-48 w-full p-0 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h1 className="text-foreground font-bold text-xl md:text-lg group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h1>
                  <p className="text-muted-foreground mt-2 line-clamp-2">{item.content.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">{item.author}</span>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Entertainment</span>
                  </div>
                </div>
                <span className="sr-only">Read more about {item.title}</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground p-6 bg-background/50 rounded-lg">
          No entertainment news available at the moment.
        </p>
      )}
    </div>
  )
}

export default Entertainment
