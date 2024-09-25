import _ from 'lodash';
import Link from 'next/link';

const Health = ({ news }) => {
  const hnews = _.sortBy(news, 'published_date').reverse();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl text-center text-black font-bold p-1 rounded-xl">Health</h1>
      {hnews.length > 0 && (
        <div className='flex flex-col lg:flex-row justify-center p-2 lg:pl-3 gap-2 lg:border-l-2 border-gray-400'>
          {hnews.slice(0, 3).map((item, index) => (
            <div key={index} className='flex flex-row lg:flex-col border-b-2 border-gray-300 w-full lg:w-1/3 '>
              <Link href={{
                pathname: '/health/' + item.title,
                query: { id: item._id },
              }}>
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className='object-cover h-auto lg:h-36 w-4/6 lg:w-full p-1 rounded-lg' 
                />
                <h1 className='text-black w-2/6 lg:w-full p-2 font-bold text-2xl md:text-lg'>
                  {item.title}
                </h1>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Health;
