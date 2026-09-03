import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { io } from 'socket.io-client';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext); // login is needed if we update current user context when they follow
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', profilePic: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/user/${id}`);
        setProfile(res.data.user);
        
        // Check if current user is following this profile
        if (user && res.data.user.followers.some(f => f._id === user.id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

      try {
        const blogsRes = await api.get('/blog/allblog');
        const allBlogs = blogsRes.data.Blog || [];
        setUserPosts(allBlogs.filter(b => b.author?._id === id));
      } catch (err) {
        console.error(err);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchProfile();

    let socket;
    if (user) {
      socket = io('http://localhost:5000', {
        query: { userId: user.id }
      });

      socket.on('postLiked', ({ blogId, likes, likeCount }) => {
        setUserPosts(prev => prev.map(b => b._id === blogId ? { ...b, likes, likeCount } : b));
      });

      socket.on('newComment', ({ blogId, commentCount }) => {
        setUserPosts(prev => prev.map(b => b._id === blogId ? { ...b, commentCount } : b));
      });
    }

    return () => {
      if (socket) socket.close();
    };
  }, [id, user]);

  const handleLike = async (blogId) => {
    // Optimistic UI update
    setUserPosts(prev => prev.map(b => {
      if (b._id === blogId) {
        const hasLiked = b.likes?.includes(user?.id);
        const newLikes = hasLiked ? b.likes.filter(uid => uid !== user.id) : [...(b.likes || []), user.id];
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

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/user/unfollow/${id}`);
        setProfile(prev => ({
          ...prev,
          followers: prev.followers.filter(f => f._id !== user.id)
        }));
        setIsFollowing(false);
      } else {
        await api.post(`/user/follow/${id}`);
        setProfile(prev => ({
          ...prev,
          followers: [...prev.followers, { _id: user.id }]
        }));
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: profile.name,
      bio: profile.bio || '',
      profilePic: profile.profilePic || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);
    try {
      const res = await api.post('/user/update', editForm);
      setProfile(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans antialiased flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8 flex-grow w-full">
        <Sidebar />

        <div className="lg:col-span-6 flex flex-col gap-0 border-x border-divider bg-surface min-h-screen">
          
          <div className="flex items-center gap-6 px-4 py-3 sticky top-[68px] bg-surface/90 backdrop-blur-md z-10 border-b border-divider transition-colors duration-300">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-canvas transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-serif font-bold text-primary">{profile?.name || 'Profile'}</h2>
              <p className="text-sm text-secondary">{postsLoading ? '...' : userPosts.length} posts</p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading profile...</div>
          ) : profile ? (
            <div>
              {/* Cover Photo */}
              <div className="h-48 bg-divider w-full"></div>
              
              <div className="px-4 pb-4">
                <div className="flex justify-between items-start -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-surface overflow-hidden bg-accent flex items-center justify-center text-white text-5xl font-serif font-bold">
                    {profile.profilePic ? <img src={profile.profilePic} alt="profile" className="w-full h-full object-cover" /> : profile.name?.charAt(0).toUpperCase()}
                  </div>
                  
                  {user && user.id !== profile._id && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`mt-20 px-6 py-2 rounded-full font-bold transition-all border ${
                        isFollowing 
                          ? 'bg-transparent border border-divider hover:border-primary text-primary hover:bg-canvas' 
                          : 'bg-accent text-white hover:opacity-90 border-transparent'
                      }`}
                    >
                      {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                    </motion.button>
                  )}
                  {user && user.id === profile._id && (
                     <button onClick={openEditModal} className="mt-20 px-6 py-2 rounded-full font-bold transition-all border border-divider bg-transparent hover:bg-canvas text-primary hover:border-primary cursor-pointer">
                      Edit profile
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <h1 className="text-2xl font-serif font-bold text-primary">{profile.name}</h1>
                  <p className="text-secondary">@{profile.name.toLowerCase().replace(/\s+/g, '')}</p>
                </div>

                <p className="text-[15px] mb-4 text-primary">
                  {profile.bio || "No bio yet."}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-secondary text-sm mb-4">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Earth</div>
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(profile.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-4 text-[15px]">
                  <div className="cursor-pointer hover:underline">
                    <span className="font-bold text-primary">{profile.following?.length || 0}</span> <span className="text-secondary">Following</span>
                  </div>
                  <div className="cursor-pointer hover:underline">
                    <span className="font-bold text-primary">{profile.followers?.length || 0}</span> <span className="text-secondary">Followers</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-divider mt-2">
                <div onClick={() => setActiveTab('posts')} className={`flex-1 py-4 font-bold text-center cursor-pointer hover:bg-canvas transition-colors ${activeTab === 'posts' ? 'border-b-2 border-accent text-primary' : 'text-secondary'}`}>Posts</div>
                <div onClick={() => setActiveTab('replies')} className={`flex-1 py-4 font-bold text-center cursor-pointer hover:bg-canvas transition-colors ${activeTab === 'replies' ? 'border-b-2 border-accent text-primary' : 'text-secondary'}`}>Replies</div>
                <div onClick={() => setActiveTab('likes')} className={`flex-1 py-4 font-bold text-center cursor-pointer hover:bg-canvas transition-colors ${activeTab === 'likes' ? 'border-b-2 border-accent text-primary' : 'text-secondary'}`}>Likes</div>
              </div>

              {activeTab === 'posts' && (
                <div className="p-4 flex flex-col gap-4">
                  {postsLoading ? (
                    <div className="text-center text-secondary py-4">Loading posts...</div>
                  ) : userPosts.length > 0 ? (
                    userPosts.map(blog => (
                      <div key={blog._id} className="border border-divider rounded-2xl p-5 hover:border-primary transition-colors bg-canvas">
                        <div className="flex items-center gap-2 mb-2 text-secondary text-xs">
                           <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-primary mb-3 text-sm">{blog.description}</p>
                        {blog.image && (
                          <div className="mb-3 rounded-2xl overflow-hidden border border-divider">
                            <img src={blog.image} alt="post" className="w-full h-auto object-cover max-h-96" />
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-secondary text-sm">
                           <button onClick={() => handleLike(blog._id)} className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${blog.likes?.includes(user?.id) ? 'text-red-500 font-bold' : ''}`}>
                             <Heart className={`w-4 h-4 ${blog.likes?.includes(user?.id) ? 'fill-current' : ''}`} /> {blog.likeCount || 0}
                           </button>
                           <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {blog.commentCount || 0}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-secondary">
                      <h3 className="text-xl font-serif font-bold text-primary mb-2">No posts yet</h3>
                      <p>When {profile.name} posts, it will show up here.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'replies' && (
                <div className="p-8 text-center text-secondary">
                  <h3 className="text-xl font-serif font-bold text-primary mb-2">No replies yet</h3>
                  <p>When {profile.name} replies to a post, it will show up here.</p>
                </div>
              )}

              {activeTab === 'likes' && (
                <div className="p-8 text-center text-secondary">
                  <h3 className="text-xl font-serif font-bold text-primary mb-2">No likes yet</h3>
                  <p>When {profile.name} likes a post, it will show up here.</p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">Profile not found</div>
          )}
        </div>
        
        {/* Right Sidebar - Trending/Suggestions */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-surface rounded-2xl border border-divider p-5 sticky top-24 transition-colors duration-300">
            <h3 className="font-serif font-semibold text-lg mb-4 text-primary">You might like</h3>
            <div className="text-sm text-secondary">Suggestions will appear here.</div>
          </div>
        </div>
      </main>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-divider rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-serif font-bold text-primary mb-4">Edit Profile</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-canvas border border-divider rounded-lg px-4 py-2 text-primary outline-none focus:border-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Bio</label>
                <textarea 
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full bg-canvas border border-divider rounded-lg px-4 py-2 text-primary outline-none focus:border-accent resize-none h-24"
                  placeholder="Add a bio..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Profile Picture URL</label>
                <input 
                  type="text" 
                  value={editForm.profilePic}
                  onChange={(e) => setEditForm({...editForm, profilePic: e.target.value})}
                  className="w-full bg-canvas border border-divider rounded-lg px-4 py-2 text-primary outline-none focus:border-accent"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-full font-bold border border-divider text-primary hover:bg-canvas transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={editLoading || !editForm.name.trim()}
                className="px-6 py-2 rounded-full font-bold bg-accent text-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
