import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Mail, Bookmark, User, X, Image as ImageIcon, Smile, Trash2 } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import EmojiPicker from 'emoji-picker-react';
import { useRef } from 'react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handlePost = async () => {
    if (!postContent.trim() && !selectedImage) return;
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
      setIsPostModalOpen(false);
      setShowEmojiPicker(false);
      if (window.location.pathname === '/') {
        window.location.reload();
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Messages', icon: Mail, path: '/messages' },
    { name: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { name: 'Profile', icon: User, path: user ? `/profile/${user.id}` : '/login' },
  ];

  return (
    <>
    <nav className="hidden lg:flex lg:col-span-3 flex-col gap-2 sticky top-24 h-fit">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex items-center gap-4 p-3.5 rounded-2xl font-bold transition-all duration-200 ${
              isActive 
                ? 'bg-[#E6E4DC] dark:bg-[#2E2C2A] text-[#C25E38] dark:text-[#D4AF37]' 
                : 'hover:bg-[#FFFFFF] dark:hover:bg-[#1A1918] text-[#8C8273] dark:text-[#9E9B96] hover:text-[#1C1917] dark:hover:text-[#F5F4F0]'
            }`
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="text-lg tracking-wide">{item.name}</span>
        </NavLink>
      ))}
      <button onClick={() => setIsPostModalOpen(true)} className="mt-4 bg-[#C25E38] dark:bg-[#D4AF37] text-white dark:text-[#121110] p-4 rounded-full font-bold transition-all hover:opacity-90 active:scale-95 w-11/12 mx-auto cursor-pointer">
        Post
      </button>
    </nav>

    {isPostModalOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-surface border border-divider rounded-2xl w-full max-w-lg p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsPostModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-canvas text-secondary hover:text-primary transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-serif font-bold text-primary mb-4">Create a new post</h2>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold shrink-0 overflow-hidden border border-divider">
              {user?.profilePic ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 flex flex-col">
              <textarea 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent border-none text-primary text-lg resize-none outline-none min-h-[120px] placeholder:text-secondary mt-2"
                autoFocus
              ></textarea>
              
              {selectedImage && (
                <div className="relative w-fit mt-2 mb-4">
                  <img src={URL.createObjectURL(selectedImage)} alt="preview" className="h-32 rounded-lg object-cover" />
                  <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider relative">
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
            <button 
              onClick={handlePost}
              disabled={isPosting || (!postContent.trim() && !selectedImage)}
              className="bg-accent text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Sidebar;