import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"

const Cricket = ({ news }) => {
  const fnews = _.sortBy(news, "published_date").reverse()
  const tnews = fnews.filter((news) => news.tags.includes("cricket"))
  const formatDate = (date) => {
    return format(new Date(date), "dd MMM, yyyy")
  }

  return (
    <div className="my-4 py-4 row-span-2 border-b-2 w-100 bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-sm">
      <h1 className="text-3xl text-start text-red-800 font-bold mb-4 ml-4 relative inline-block">
        Cricket
        <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-red-600 rounded"></span>
      </h1>
      <div className="flex flex-row justify-center w-full mx-auto gap-4 my-4">
        {tnews.length > 0 && (
          <Link
            href={{
              pathname: "/sports/" + tnews[0].title,
              query: { id: tnews[0]._id },
            }}
            className="flex flex-row border-b border-gray-200 p-4 gap-6 w-full items-center justify-center bg-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <img
              src={tnews[0].image_url || "/placeholder.svg"}
              alt={tnews[0].title}
              className="h-auto w-1/2 rounded-lg object-cover"
            />
            <div className="flex flex-col w-1/2 p-2">
              <h1 className="text-black font-bold text-xl lg:text-2xl mb-3 hover:text-red-700 transition-colors duration-300">
                {tnews[0].title}
              </h1>
              <p className="text-gray-600 mb-4 line-clamp-3 hidden md:block">{tnews[0].content.substring(0, 120)}...</p>
              <div className="flex justify-between text-gray-500 mt-auto">
                <p className="font-medium">{tnews[0].author}</p>
                <p className="bg-red-50 text-red-800 text-xs px-2 py-1 rounded-full">
                  {formatDate(tnews[0].published_date)}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
      {tnews.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-gray-50 gap-4 p-4 rounded-lg">
          {tnews.slice(1, 3).map((item, index) => (
            <Link
              key={index}
              href={{
                pathname: "/sports/" + item.title,
                query: { id: item._id },
              }}
              className="flex flex-col col-span-1 p-3 hover:bg-white rounded-lg transition-colors duration-300"
            >
              <h1 className="text-black w-full font-bold text-lg hover:text-red-700 transition-colors duration-300">
                {item.title}
              </h1>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">{item.author}</p>
                <p className="text-xs text-gray-500">{formatDate(item.published_date)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cricket
