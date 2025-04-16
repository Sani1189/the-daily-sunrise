import _ from "lodash"
import Link from "next/link"
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"

const Opinion = ({ news }) => {
  const oNews = _.sortBy(news, "published_date").reverse()

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg px-6 py-8 mb-8 shadow-sm">
      <div className="flex items-center justify-center mt-3 mb-8">
        <div className="flex-grow border-t border-b border-red-600 h-2"></div>
        <h1 className="text-2xl sm:text-3xl text-center text-red-800 font-bold p-3 rounded-xl bg-red-50 shadow-sm">
          Opinion
        </h1>
        <div className="flex-grow border-t border-b border-red-600 h-2"></div>
      </div>
      {oNews.length > 0 && (
        <div className="grid gap-8 text-black px-4 py-5 lg:grid-cols-3 lg:px-8">
          {oNews.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-xl bg-white p-6 relative shadow-lg transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="flex flex-col items-center lg:items-start">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-36 h-36 m-auto object-cover rounded-full border-4 border-gray-100 shadow-md mb-6"
                />
                <p className="text-gray-600 mb-3 m-auto font-medium">{item.author}</p>
                <h2 className="text-xl italic text-gray-800 text-center m-auto relative">
                  <Link
                    href={{
                      pathname: "/opinion/" + item.title,
                      query: { id: item._id },
                    }}
                    className="hover:text-red-700 transition-colors duration-300"
                  >
                    <FaQuoteLeft className="text-red-400 text-lg inline mr-2 opacity-70" />
                    {item.title}
                    <FaQuoteRight className="text-red-400 text-lg inline ml-2 opacity-70" />
                  </Link>
                </h2>
              </div>
              <div className="w-3 h-32 bg-gradient-to-b from-red-500 to-red-700 absolute top-2 rounded-lg left-0 transform -translate-x-1/2"></div>
            </div>
          ))}
          <div className="lg:col-span-1 m-auto p-auto">
            {oNews.slice(2, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-center mb-6 p-4 hover:bg-white rounded-lg transition-colors duration-300"
              >
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-full mr-4 border-2 border-gray-100 shadow-sm"
                />
                <div>
                  <div>
                    <h3 className="text-lg text-gray-800 italic">
                      <Link
                        href={{
                          pathname: "/opinion/" + item.title,
                          query: { id: item._id },
                        }}
                        className="hover:text-red-700 transition-colors duration-300"
                      >
                        <FaQuoteLeft className="text-red-400 text-sm inline mr-1 opacity-70" />
                        {item.title}
                        <FaQuoteRight className="text-red-400 text-sm inline ml-1 opacity-70" />
                      </Link>
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-1">{item.author}</p>
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
