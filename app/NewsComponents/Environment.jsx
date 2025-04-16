import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"

const Environment = ({ news }) => {
  const enews = _.sortBy(news, "published_date").reverse()

  return (
    <div className="py-8 bg-gradient-to-r from-primary/5 to-card">
      <div className="flex items-center justify-center mt-3 mb-8">
        <div className="flex-grow border-t border-b border-primary h-2"></div>
        <h1 className="text-2xl sm:text-3xl text-center text-primary font-bold p-3 rounded-xl bg-primary/10 shadow-sm">
          Environment
        </h1>
        <div className="flex-grow border-t border-b border-primary h-2"></div>
      </div>

      {enews.length > 0 && (
        <div className="flex flex-col xl:flex-row justify-center p-2 xl:pl-3 gap-6 border-border max-w-7xl mx-auto">
          <div className="grid grid-rows-2 grid-cols-2 gap-4">
            {enews.slice(0, 4).map((item, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/environment/" + item.title,
                  query: { id: item._id },
                }}
                className="row-span-1 col-span-1 flex flex-col justify-end rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${item.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: "300px",
                }}
              >
                <div className="bg-black bg-opacity-40 p-4 backdrop-blur-sm">
                  <h1 className="text-white text-center font-bold text-xl md:text-xl mb-2">{item.title}</h1>
                  <p className="hidden lg:block text-white text-center text-sm">
                    {format(new Date(item.published_date), "dd MMMM, yyyy")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-4">
            {enews.slice(4, 10).map((item, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/environment/" + item.title,
                  query: { id: item._id },
                }}
                className="flex flex-row border-b border-border p-3 hover:bg-primary/5 transition-colors duration-300 rounded-lg"
              >
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover my-auto h-20 w-20 rounded-full shadow-md border-2 border-card"
                />
                <div className="flex flex-col h-auto justify-center p-3 flex-1">
                  <h1 className="text-foreground font-bold text-lg hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h1>
                  <p className="text-muted-foreground flex flex-row justify-between text-sm mt-2">
                    <span>{item.author}</span>
                    <span>{format(new Date(item.published_date), "dd MMM, yyyy")}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Environment
