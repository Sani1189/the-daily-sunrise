// components/Lifestyle.jsx
import Link from 'next/link';
import _ from 'lodash';

const Lifestyle = ({ news }) => {
  const sortedNews = _.sortBy(news, 'published_date').reverse();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl text-center text-black font-bold p-1 rounded-xl">LifeStyle</h1>
      {sortedNews.length > 0 ? (
        <div className='flex flex-col lg:flex-row justify-center p-2 lg:pr-3 gap-2 lg:border-r-2 border-gray-400'>
          {sortedNews.slice(0, 3).map((item, index) => (
            <div key={index} className='flex flex-row lg:flex-col w-full lg:w-1/3 border-b-2 border-gray-300 '>
              <Link href={{
                pathname: '/lifestyle/' + item.title,
                query: { id: item._id },
              }}>
                <img 
                  src={item.image_url} 
                  alt={`Image for ${item.title}`} 
                  className='object-cover h-auto lg:h-36 w-4/6 lg:w-full p-1 rounded-lg' 
                />
                <h1 className='text-black w-2/6 lg:w-full p-2 font-bold text-2xl md:text-lg'>
                  {item.title}
                </h1>
                <span className="sr-only">Read more about {item.title}</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No lifestyle news available at the moment.</p>
      )}
    </div>
  );
};

export default Lifestyle;
