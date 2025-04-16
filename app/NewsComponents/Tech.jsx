import _ from "lodash"
import { format } from "date-fns"
import Link from "next/link"

const Tech = ({ news }) => {
  const tnews = _.sortBy(news, "published_date").reverse()
  const formatDate = (date) => {
    return format(new Date(date), "dd MMM, yyyy")
  }

  return (
    <div className="my-8 py-6 border-b-2 bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-sm">
      <h1 className="text-3xl text-center text-gray-800 font-bold mb-6 relative inline-block">
        Technology
        <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded"></span>
      </h1>
      <div className="flex flex-row justify-center w-full mx-auto gap-4 my-4">
        {tnews.length > 0 && (
          <Link
            href={{
              pathname: "/technology/" + tnews[1].title,
              query: { id: tnews[1]._id },
            }}
            className="flex flex-col md:flex-row border-b border-gray-200 w-full items-center justify-center bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={tnews[1].image_url || "/placeholder.svg"}
              alt={tnews[1].title}
              className="h-auto w-full md:w-1/2 lg:w-3/5 object-cover"
            />
            <div className="flex flex-col w-full md:w-1/2 lg:w-2/5 p-6">
              <h1 className="text-gray-800 font-bold text-2xl lg:text-3xl mb-4 hover:text-blue-700 transition-colors duration-300">
                {tnews[1].title}
              </h1>
              <p className="text-gray-600 py-2 mb-4 line-clamp-3">
                {tnews[0].content.length > 100 ? `${tnews[0].content.substring(0, 150)}` : tnews[0].content}{" "}
                <strong className="text-blue-500">...</strong>
              </p>
              <div className="flex justify-between text-gray-500 mt-auto items-center">
                <p className="font-medium">{tnews[0].author}</p>
                <p className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {formatDate(tnews[0].published_date)}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
      {tnews.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 bg-gray-50 gap-3 p-4 rounded-lg mt-6">
          {tnews.slice(1, 6).map((item, index) => (
            <Link
              key={index}
              href={{
                pathname: "/tech/" + item.title,
                query: { id: item._id },
              }}
              className="flex flex-col col-span-1 p-3 overflow-hidden rounded-lg hover:bg-white transition-all duration-300 hover:shadow-md"
            >
              <h1 className="text-gray-800 w-full font-bold text-lg hover:text-blue-700 transition-colors duration-300 mb-2">
                {item.title}
              </h1>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">{item.author}</p>
                <p className="text-xs text-gray-500">{formatDate(item.published_date)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tech
