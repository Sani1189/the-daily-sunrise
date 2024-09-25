import _ from 'lodash';
import Link from 'next/link';

const Health = ({ news }) => {
  const hnews = _.sortBy(news, 'published_date').reverse();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl text-center text-black font-bold p-1 rounded-xl">Health</h1>
      {hnews.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 lg:pl-3'>
          {hnews.slice(0, 3).map((item, index) => (
            <div key={index} className='flex flex-col border-b-2 border-gray-300'>
              <Link href={{
                pathname: '/health/' + item.title,
                query: { id: item._id },
              }}>
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className='object-cover h-auto lg:h-36 w-full p-1 rounded-lg' 
                />
                <h1 className='text-black p-2 font-bold text-2xl md:text-lg'>
                  {item.title}
                </h1>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No health news available at the moment.</p>
      )}
    </div>
  );
};

export default Health;
