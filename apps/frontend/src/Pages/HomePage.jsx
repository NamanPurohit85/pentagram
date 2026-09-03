import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Smile, Heart, MessageCircle, Share, Trash2, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { useRef } from 'react';
import { io } from 'socket.io-client';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  // Comment state
  const [activeCommentBlogId, setActiveCommentBlogId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blog/allblog');
      setBlogs(res.data.Blog || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    
    let socket;
    if (user) {
      socket = io('http://localhost:5000', {
        query: { userId: user.id }
      });

      socket.on('postLiked', ({ blogId, likes, likeCount }) => {
        setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, likes, likeCount } : b));
      });

      socket.on('newComment', ({ blogId, comment, commentCount }) => {
        setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, commentCount } : b));
        setComments(prev => {
          // If we are currently viewing this blog's comments, append it
          if (activeCommentBlogId === blogId) {
            // Check if we already have it to prevent duplicates if we were the sender
            if (!prev.find(c => c._id === comment._id)) {
              return [comment, ...prev];
            }
          }
          return prev;
        });
      });
    }

    return () => {
      if (socket) socket.close();
    };
  }, [user, activeCommentBlogId]);

  const handlePost = async () => {
    if (postContent.trim() !== '' || selectedImage) {
      setIsPosting(true);
      try {
        const formData = new FormData();
        formData.append('title', 'Post');
        formData.append('description', postContent);
        if (selectedImage) formData.append('image', selectedImage);

        await api.post('/blog/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setPostContent('');
        setSelectedImage(null);
        setShowEmojiPicker(false);
        fetchBlogs(); // Refresh feed
      } catch (err) {
        console.error(err);
        alert('Failed to post');
      } finally {
        setIsPosting(false);
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

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
      // No need to fetchBlogs() as socket will broadcast or we already updated optimistically
    } catch (err) {
      console.error(err);
      fetchBlogs(); // revert on error
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      try {
        await api.get(`/blog/delete/${id}`); // Note: blogRoute uses .get("/delete/:id")
        fetchBlogs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchComments = async (blogId) => {
    setLoadingComments(true);
    try {
      const res = await api.get(`/comment/${blogId}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (blogId) => {
    if (commentContent.trim() !== '') {
      setIsPostingComment(true);
      const text = commentContent;
      setCommentContent('');
      try {
        await api.post(`/comment/${blogId}`, { description: text });
        // We let the socket event 'newComment' handle appending it to the UI
      } catch (err) {
        console.error(err);
        alert('Failed to post comment');
      } finally {
        setIsPostingComment(false);
      }
    }
  };

  const handleDeleteComment = async (commentId, blogId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await api.delete(`/comment/${commentId}`);
        fetchComments(blogId);
        fetchBlogs(); // to update comment count
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans antialiased flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8 flex-grow w-full">
        <Sidebar />

        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-divider p-5 transition-colors duration-300">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-accent text-white flex items-center justify-center font-bold text-lg border border-divider">
                {user?.profilePic ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <textarea 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening?" 
                  className="w-full border-none focus:ring-0 text-lg resize-none placeholder:text-secondary bg-transparent text-primary p-0 mt-2 h-20 outline-none"
                ></textarea>
                
                {selectedImage && (
                  <div className="relative w-fit mt-2">
                    <img src={URL.createObjectURL(selectedImage)} alt="preview" className="h-32 rounded-lg object-cover" />
                    <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 relative">
                  <div className="flex gap-1 text-[#8b88ff]">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                    <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-canvas rounded-full transition-colors cursor-pointer flex items-center justify-center text-secondary hover:text-accent">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-canvas rounded-full transition-colors cursor-pointer flex items-center justify-center text-secondary hover:text-accent">
                      <Smile className="w-5 h-5" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute top-12 left-0 z-50">
                        <EmojiPicker onEmojiClick={(emojiData) => setPostContent(prev => prev + emojiData.emoji)} theme="auto" />
                      </div>
                    )}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePost}
                    disabled={isPosting || !postContent.trim()}
                    className="bg-accent text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="text-center text-gray-500 mt-10">Loading feed...</div>
            ) : (
              <AnimatePresence>
                {blogs.map((blog) => (
                  <motion.div 
                    key={blog._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface rounded-2xl border border-divider p-5 transition-colors duration-300"
                  >
                    <div className="flex gap-4">
                      <Link to={`/profile/${blog.author?._id}`}>
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-canvas border border-divider text-primary flex items-center justify-center font-bold">
                          {blog.author?.profilePic ? <img src={blog.author.profilePic} alt="profile" className="w-full h-full object-cover" /> : blog.author?.name?.charAt(0).toUpperCase()}
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link to={`/profile/${blog.author?._id}`} className="font-bold hover:underline text-primary">{blog.author?.name}</Link>
                            <span className="text-gray-500 text-sm ml-2">{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </div>
                          {user && user.id === blog.author?._id && (
                            <button onClick={() => handleDelete(blog._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{blog.description}</p>
                        
                        {blog.image && (
                          <div className="mt-3 rounded-2xl overflow-hidden border border-divider">
                            <img src={blog.image} alt="post" className="w-full h-auto object-cover max-h-96" />
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 text-secondary max-w-md">
                          <button onClick={() => {
                            if (activeCommentBlogId === blog._id) {
                              setActiveCommentBlogId(null);
                            } else {
                              setActiveCommentBlogId(blog._id);
                              fetchComments(blog._id);
                            }
                          }} className="flex items-center gap-2 hover:text-accent transition-colors">
                            <MessageCircle className="w-4 h-4" /> <span>{blog.commentCount || 0}</span>
                          </button>
                          
                          <button 
                            onClick={() => {
                              const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                              if (saved.includes(blog._id)) {
                                localStorage.setItem('bookmarks', JSON.stringify(saved.filter(id => id !== blog._id)));
                                // force re-render simple hack
                                setBlogs([...blogs]); 
                              } else {
                                localStorage.setItem('bookmarks', JSON.stringify([...saved, blog._id]));
                                setBlogs([...blogs]);
                              }
                            }}
                            className={`flex items-center gap-2 hover:text-accent transition-colors ${JSON.parse(localStorage.getItem('bookmarks') || '[]').includes(blog._id) ? 'text-accent' : ''}`}
                          >
                            <Bookmark className={`w-4 h-4 ${JSON.parse(localStorage.getItem('bookmarks') || '[]').includes(blog._id) ? 'fill-current' : ''}`} />
                          </button>

                          <button onClick={() => handleLike(blog._id)} className={`flex items-center gap-2 hover:text-red-500 transition-colors ${blog.likes?.includes(user?.id) ? 'text-red-500' : ''}`}>
                            <Heart className={`w-4 h-4 ${blog.likes?.includes(user?.id) ? 'fill-current' : ''}`} /> 
                            <span>{blog.likeCount || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-accent transition-colors"><Share className="w-4 h-4" /></button>
                        </div>
                        
                        {/* Comments Section */}
                        {activeCommentBlogId === blog._id && (
                          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="flex gap-2 mb-4">
                              <input 
                                type="text"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-canvas border border-divider rounded-full px-4 py-2 outline-none text-primary placeholder:text-secondary"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handlePostComment(blog._id);
                                }}
                              />
                              <button 
                                onClick={() => handlePostComment(blog._id)}
                                disabled={isPostingComment || !commentContent.trim()}
                                className="bg-accent text-white px-4 py-2 rounded-full disabled:opacity-50 hover:opacity-90 active:scale-95"
                              >
                                Post
                              </button>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                              {loadingComments ? (
                                <div className="text-sm text-gray-500">Loading comments...</div>
                              ) : comments.length > 0 ? (
                                comments.map(comment => (
                                  <div key={comment._id} className="flex gap-3 bg-canvas border border-divider p-3 rounded-xl">
                                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-300 flex items-center justify-center font-bold text-xs">
                                      {comment.author?.profilePic ? <img src={comment.author.profilePic} alt="profile" className="w-full h-full object-cover" /> : comment.author?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-primary">{comment.author?.name}</span>
                                        {user && user.id === comment.author?._id && (
                                          <button onClick={() => handleDeleteComment(comment._id, blog._id)} className="text-red-500 text-xs">Delete</button>
                                        )}
                                      </div>
                                      <p className="text-sm text-primary">{comment.description}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-gray-500">No comments yet.</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {!loading && blogs.length === 0 && (
              <div className="text-center text-gray-500 mt-10">No posts yet. Be the first to post!</div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - Trending/Suggestions */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-surface rounded-2xl border border-divider p-5 sticky top-24 transition-colors duration-300">
            <h3 className="font-serif font-semibold text-lg mb-4 text-primary">Who to follow</h3>
            <div className="text-sm text-gray-500">Suggestions will appear here.</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;