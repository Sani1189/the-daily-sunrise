import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const NewsItemPage = () => {
 const router = useRouter();
 const { id, category } = router.query;
 const [newsItem, setNewsItem] = useState(null);


 if (!newsItem) return <p>Loading...</p>;

 return (
  <div>
   <p>Category: {category}</p>
   <p>News ID: {id}</p>
   {/* Render other details of the news item */}
  </div>
 );
};

export default NewsItemPage;
