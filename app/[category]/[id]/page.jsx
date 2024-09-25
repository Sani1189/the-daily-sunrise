'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaShareAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaUserCircle, FaRegUser, FaUserAlt } from "react-icons/fa";

const timeAgo = (date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffInSeconds = Math.floor((now - commentDate) / 1000);

  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

const NewsPage = ({ params, searchParams }) => {
  const category = params.category;
  const id = searchParams.id;
  const [news, setNews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let fetchUrl;
        if (category === 'trending' || category === 'feature') {
          fetchUrl = `/api/news?tags=${category}`;
        } else {
          fetchUrl = `/api/news?category=${category}`;
        }

        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error('News not found');
        }
        const data = await response.json();
        console.log("Fetched news data:", data);
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?newsId=${id}`);
        if (!response.ok) {
          throw new Error('Comments not found');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchNews();
    fetchComments();
  }, [category, id]);


  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  const mainNews = news.find(news => news._id === id);
  const otherNews = news.filter(news => news._id !== id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (!name || !email || !comment) {
      setFormError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email.');
      return;
    }

    setFormError('');

    // Create the comment object
    const commentData = {
      newsId: id,
      name,
      email,
      comment,
      date: new Date().toISOString(),
    };

    // Send the comment to the backend
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        setSuccessMessage('Comment posted successfully.');
        setName('');
        setEmail('');
        setComment('');
        // Refresh comments after posting
        const updatedComments = await fetch(`/api/comments?newsId=${id}`).then(res => res.json());
        setComments(updatedComments);
      } else {
        setFormError('Failed to post the comment. Try again later.');
      }
    } catch (err) {
      setFormError('An error occurred. Please try again.');
    }
  };

  const concatenatedContent = mainNews ? mainNews.content + '\n' + generateContent() : '';
  const firstSplitIndex = Math.ceil(concatenatedContent.length / 3);
  const secondSplitIndex = firstSplitIndex * 2;
  const firstPart = concatenatedContent.slice(0, firstSplitIndex);
  const secondPart = concatenatedContent.slice(firstSplitIndex, secondSplitIndex);
  const thirdPart = concatenatedContent.slice(secondSplitIndex);

  const toUpperCaseFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          {/* Country and Category */}
          <div className="flex justify-start ml-1 mb-4">
            <p className="text-2xl text-gray-700 font-bold hover:text-red-700 transition"> {toUpperCaseFirst(mainNews.country)}</p>
            <p className="text-xl text-gray-800 font-bold px-2">|</p>
            <p className="text-2xl text-gray-700 font-bold hover:text-red-700 transition">{toUpperCaseFirst(category)}</p>
          </div>
          {mainNews && (
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
              <h1 className="text-5xl md:text-5xl font-bold mb-4 text-gray-800">{mainNews.title}</h1>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">By {mainNews.author}  <br /> Published Date: {new Date(mainNews.published_date).toLocaleDateString()}</p>
                <div className="flex gap-4">
                  <a href={`mailto:?subject=${mainNews.title}&body=${encodeURIComponent(window.location.href)}`} className="text-gray-800 hover:text-gray-900 transition">
                    <FaShareAlt size={30} />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} className="text-blue-600 hover:text-blue-800 transition">
                    <FaFacebook size={30} />
                  </a>
                  <a href={`https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} className="text-black hover:text-gray-700 transition">
                    <FaXTwitter size={30} />
                  </a>
                  <a href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`} className="text-pink-600 hover:text-pink-800 transition">
                    <FaInstagram size={30} />
                  </a>
                </div>
              </div>
              <img src={mainNews.image_url} alt={mainNews.title} className="w-full h-auto mb-4 rounded-lg" />
              <div className="flex flex-wrap gap-2 mb-4">
                {mainNews.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-500 px-2 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
              <p className="text-lg text-gray-700 whitespace-pre-line">
                {firstPart}
                {/* Advertisement */}
                <div className="bg-gray-100 p-6 mt-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
                  <div className="flex justify-center items-center h-32 bg-gray-300 rounded-lg">
                    <span className="text-gray-500">Ad space</span>
                  </div>
                </div>
                {secondPart}
                {/* Advertisement */}
                <div className="bg-gray-100 p-6 mt-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
                  <div className="flex justify-center items-center h-32 bg-gray-300 rounded-lg">
                    <span className="text-gray-500">Ad space</span>
                  </div>
                </div>
                {thirdPart}
              </p>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 mt-8 rounded-xl shadow-xl">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 pb-2 border-blue-500">
              Latest Comments
            </h2>
            {comments.length === 0 ? (
              <p className="text-gray-600 italic">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 py-6 ${index < 3 ? "bg-gradient-to-r from-blue-50 to-white" : ""} rounded-md shadow-md px-6 mb-4`}
                >
                  {/* Random icons for the latest three comments */}
                  {index === 0 && <FaUserCircle className="w-10 h-10 text-blue-600" />}
                  {index === 1 && <FaRegUser className="w-10 h-10 text-green-500" />}
                  {index === 2 && <FaUserAlt className="w-10 h-10 text-purple-500" />}

                  <div className="flex-1">
                    <p className="font-semibold text-indigo-600 text-lg">{comment.name}</p>
                    <p className="text-sm text-gray-500">{timeAgo(comment.date)}</p>
                    <p className="text-gray-700 mt-2 text-md leading-relaxed">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Form */}
          <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Leave a Comment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="comment">
                  Comment
                </label>
                <textarea
                  id="comment"
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your comment"
                  required
                ></textarea>
              </div>

              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </form>
          </div>


        </div>

        {/* Other news section */}
        <div className="md:w-1/3">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Other News in {category}</h2>
          {otherNews.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">By {item.author} on {new Date(item.published_date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{item.content.slice(0, 100)}...</p>
              <Link href={{ pathname: `/${category}/${item.title}`, query: { id: item._id } }} className="text-blue-500">
                Read more
              </Link>
            </div>
          ))}

          {/* Advertisement */}
          <div className="bg-gray-100 p-6 mt-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Advertisement</h2>
            <div className="h-64 bg-gray-200 flex items-center justify-center">Ad Space</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;




const generateContent = () => {
  return `
  In recent years, the global economy has experienced significant transformations driven by the rise of digital currencies. Major corporations are investing heavily in blockchain technology to streamline operations and enhance security. This shift is not only affecting large enterprises but also benefiting small businesses, which are gaining increased access to international markets via e-commerce platforms. Analysts predict that sustainable business practices will soon become a cornerstone of corporate strategies, highlighting the importance of environmental responsibility in today's market.

  The political landscape has also seen substantial changes with recent elections bringing new policies focused on healthcare and education. These initiatives aim to bridge the gap between different socioeconomic groups, fostering a more inclusive society. International relations are at the forefront of political discourse, with trade agreements being renegotiated to promote better economic ties and reduce tariffs. This global dialogue is essential in maintaining peaceful and productive interactions between nations.

  In the world of sports, this year has been remarkable with record-breaking performances across various disciplines. The Summer Olympics showcased extraordinary talent from around the globe, inspiring millions with stories of perseverance and excellence. However, the ongoing debate over athlete compensation continues, with advocates pushing for fairer pay structures, especially in women’s sports. This conversation is critical in ensuring equity and recognition for all athletes.

  Environmental concerns have reached unprecedented levels, with climate change impacting ecosystems worldwide. Conservation efforts are gaining momentum as governments and non-governmental organizations (NGOs) collaborate to protect endangered species and promote sustainable living practices. Innovative solutions in renewable energy are being developed to reduce our carbon footprint and combat global warming, emphasizing the urgent need for collective action.

  Public opinion remains increasingly polarized on several key issues, including immigration and climate policy. Thought leaders are calling for more nuanced discussions to bridge divides and find common ground. Social media plays a significant role in shaping public opinion, amplifying both positive and negative voices. This platform's influence cannot be underestimated as it continues to impact societal views and behaviors.

  Lifestyle trends are evolving, with a growing emphasis on health and wellness. People are becoming more conscious of their dietary choices, opting for organic and plant-based options. Mental health awareness is also on the rise, with more resources being made available for those in need. In travel, there has been a shift towards eco-tourism, with travelers seeking sustainable and authentic experiences that minimize their environmental impact.

  The entertainment industry is thriving, with streaming services providing a platform for diverse and inclusive content. Blockbuster movies and TV series are being produced with a global audience in mind, featuring stories that resonate across different cultures. The music industry is experiencing a renaissance, with artists from various genres collaborating to create innovative sounds that appeal to a broad range of listeners. This period of creative flourishing underscores the power of entertainment in connecting people and enriching lives.
  `;
};
