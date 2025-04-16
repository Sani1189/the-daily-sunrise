import _ from "lodash"
import Link from "next/link"
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"

const Opinion = ({ news }) => {
  const oNews = _.sortBy(news, "published_date").reverse()

  return (
    <div className="bg-gradient-to-br from-background/50 to-background/80 rounded-lg px-6 py-8 mb-8 shadow-sm">
      <div className="flex items-center justify-center mt-3 mb-8">
        <div className="flex-grow border-t border-b border-primary h-2"></div>
        <h1 className="text-2xl sm:text-3xl text-center text-primary font-bold p-3 rounded-xl bg-primary/10 shadow-sm">
          Opinion
        </h1>
        <div className="flex-grow border-t border-b border-primary h-2"></div>
      </div>
      {oNews.length > 0 && (
        <div className="grid gap-8 text-foreground px-4 py-5 lg:grid-cols-3 lg:px-8">
          {oNews.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="border-2 border-border rounded-xl bg-card p-6 relative shadow-lg transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="flex flex-col items-center lg:items-start">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-36 h-36 m-auto object-cover rounded-full border-4 border-background shadow-md mb-6"
                />
                <p className="text-muted-foreground mb-3 m-auto font-medium">{item.author}</p>
                <h2 className="text-xl italic text-foreground text-center m-auto relative">
                  <Link
                    href={{
                      pathname: "/opinion/" + item.title,
                      query: { id: item._id },
                    }}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    <FaQuoteLeft className="text-primary text-lg inline mr-2 opacity-70" />
                    {item.title}
                    <FaQuoteRight className="text-primary text-lg inline ml-2 opacity-70" />
                  </Link>
                </h2>
              </div>
              <div className="w-3 h-32 bg-gradient-to-b from-primary to-primary/70 absolute top-2 rounded-lg left-0 transform -translate-x-1/2"></div>
            </div>
          ))}
          <div className="lg:col-span-1 m-auto p-auto">
            {oNews.slice(2, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-center mb-6 p-4 hover:bg-card rounded-lg transition-colors duration-300"
              >
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-full mr-4 border-2 border-background shadow-sm"
                />
                <div>
                  <div>
                    <h3 className="text-lg text-foreground italic">
                      <Link
                        href={{
                          pathname: "/opinion/" + item.title,
                          query: { id: item._id },
                        }}
                        className="hover:text-primary transition-colors duration-300"
                      >
                        <FaQuoteLeft className="text-primary text-sm inline mr-1 opacity-70" />
                        {item.title}
                        <FaQuoteRight className="text-primary text-sm inline ml-1 opacity-70" />
                      </Link>
                    </h3>
                  </div>
                  <p className="text-muted-foreground mt-1">{item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Opinion
