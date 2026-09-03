import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { io } from 'socket.io-client';

const ExplorePage = () => {
  const { user } = React.useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLike = async (blogId) => {
    // Optimistic UI update
    setBlogs(prev => prev.map(b => {
      if (b._id === blogId) {
        const hasLiked = b.likes?.includes(user?.id);
        const newLikes = hasLiked ? b.likes.filter(id => id !== user.id) : [...(b.likes || []), user.id];
        return { ...b, likes: newLikes, likeCount: newLikes.length };
      }
      return b;
    }));

    try {
      await api.post(`/blog/like/${blogId}`);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await api.get('/blog/allblog');
        // Sort by engagement (likes + comments) for explore feel
        const sorted = (res.data.Blog || []).sort((a, b) => 
          ((b.likeCount || 0) + (b.commentCount || 0)) - ((a.likeCount || 0) + (a.commentCount || 0))
        );
        setBlogs(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();

    let socket;
    if (user) {
      socket = io('http://localhost:5000', {
        query: { userId: user.id }
      });

      socket.on('postLiked', ({ blogId, likes, likeCount }) => {
        setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, likes, likeCount } : b));
      });

      socket.on('newComment', ({ blogId, commentCount }) => {
        setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, commentCount } : b));
      });
    }

    return () => {
      if (socket) socket.close();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans antialiased flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8 flex-grow w-full">
        <Sidebar />
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-divider p-8 transition-colors duration-300">
            <h1 className="text-3xl font-serif font-bold mb-2 text-primary">Explore</h1>
            <p className="text-secondary mb-8">Discover trending stories and new voices.</p>
            
            {loading ? (
              <div className="text-center text-secondary py-10">Loading explore feed...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog, i) => (
                  <motion.div 
                    key={blog._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group border border-divider rounded-2xl p-5 hover:border-primary transition-colors cursor-pointer bg-canvas flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Link to={`/profile/${blog.author?._id}`}>
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface border border-divider text-primary flex items-center justify-center font-bold">
                            {blog.author?.profilePic ? <img src={blog.author.profilePic} alt="profile" className="w-full h-full object-cover" /> : blog.author?.name?.charAt(0).toUpperCase()}
                          </div>
                        </Link>
                        <div>
                          <Link to={`/profile/${blog.author?._id}`} className="font-bold hover:underline text-primary text-sm">{blog.author?.name}</Link>
                          <div className="text-xs text-secondary">{new Date(blog.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <p className="text-primary text-sm mb-4 line-clamp-4">{blog.description}</p>
                      {blog.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-divider">
                          <img src={blog.image} alt="post" className="w-full h-auto object-cover max-h-48" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-secondary text-sm border-t border-divider pt-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(blog._id);
                        }} 
                        className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${blog.likes?.includes(user?.id) ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`w-4 h-4 ${blog.likes?.includes(user?.id) ? 'fill-current' : ''}`} /> 
                        {blog.likeCount || 0}
                      </button>
                      <button className="flex items-center gap-1.5 group-hover:text-accent transition-colors"><MessageCircle className="w-4 h-4" /> {blog.commentCount || 0}</button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                          if (saved.includes(blog._id)) {
                            localStorage.setItem('bookmarks', JSON.stringify(saved.filter(id => id !== blog._id)));
                            setBlogs([...blogs]); 
                          } else {
                            localStorage.setItem('bookmarks', JSON.stringify([...saved, blog._id]));
                            setBlogs([...blogs]);
                          }
                        }}
                        className={`flex items-center gap-1.5 hover:text-accent transition-colors ml-auto ${JSON.parse(localStorage.getItem('bookmarks') || '[]').includes(blog._id) ? 'text-accent' : ''}`}
                      >
                        <Bookmark className={`w-4 h-4 ${JSON.parse(localStorage.getItem('bookmarks') || '[]').includes(blog._id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {blogs.length === 0 && <div className="col-span-full text-center text-secondary py-10">No content found.</div>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
