import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import api from '../api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';

const BookmarksPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const savedIds = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        if (savedIds.length === 0) {
          setBlogs([]);
          setLoading(false);
          return;
        }
        
        // Fetch all and filter, ideally should be a backend endpoint, but doing this for mock
        const res = await api.get('/blog/allblog');
        const allBlogs = res.data.Blog || [];
        const bookmarkedBlogs = allBlogs.filter(b => savedIds.includes(b._id));
        setBlogs(bookmarkedBlogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const removeBookmark = (id) => {
    const savedIds = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const newIds = savedIds.filter(savedId => savedId !== id);
    localStorage.setItem('bookmarks', JSON.stringify(newIds));
    setBlogs(blogs.filter(b => b._id !== id));
  };

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans antialiased flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8 flex-grow w-full">
        <Sidebar />
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-divider p-8 transition-colors duration-300">
            <h1 className="text-3xl font-serif font-bold mb-2 text-primary">Bookmarks</h1>
            <p className="text-secondary mb-8">Posts you've saved for later.</p>
            
            {loading ? (
              <div className="text-center text-secondary py-10">Loading bookmarks...</div>
            ) : blogs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {blogs.map((blog, i) => (
                  <motion.div 
                    key={blog._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-divider rounded-2xl p-5 hover:border-primary transition-colors bg-canvas"
                  >
                    <div className="flex gap-4">
                      <Link to={`/profile/${blog.author?._id}`}>
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface border border-divider text-primary flex items-center justify-center font-bold">
                          {blog.author?.profilePic ? <img src={blog.author.profilePic} alt="profile" className="w-full h-full object-cover" /> : blog.author?.name?.charAt(0).toUpperCase()}
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link to={`/profile/${blog.author?._id}`} className="font-bold hover:underline text-primary text-sm">{blog.author?.name}</Link>
                            <span className="text-xs text-secondary ml-2">{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </div>
                          <button onClick={() => removeBookmark(blog._id)} className="text-accent hover:opacity-80">
                            <Bookmark className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                        <p className="text-primary mt-2">{blog.description}</p>
                        {blog.image && (
                          <div className="mt-3 rounded-2xl overflow-hidden border border-divider">
                            <img src={blog.image} alt="post" className="w-full h-auto object-cover max-h-96" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-secondary text-sm mt-4">
                          <div className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {blog.likeCount || 0}</div>
                          <div className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {blog.commentCount || 0}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl font-serif font-semibold text-primary">No bookmarks yet</p>
                <p className="text-secondary mt-2">When you bookmark a post, it will show up here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookmarksPage;
