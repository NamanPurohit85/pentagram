import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/SideBar';

const HomePage = () => {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = () => {
    if (postContent.trim() !== '') {
      setIsPosting(true);
      setTimeout(() => {
        alert('Post published successfully!');
        setPostContent('');
        setIsPosting(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#121212] text-[#1c1b1b] dark:text-gray-100 font-sans antialiased flex flex-col transition-colors">
      <Navbar />

      {/* Main Content Container */}
      <main className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8 flex-grow w-full">
        <Sidebar />

        {/* Center Feed */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <h1 className="text-3xl font-black text-[#1c1b1b] dark:text-white tracking-tight">Home</h1>
          
          {/* Post Composer */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-[#e5e2e1] dark:border-gray-800 p-5 transition-colors">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#4441c4] text-white flex items-center justify-center font-bold text-sm">
                HS
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <textarea 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening?" 
                  className="w-full border-none focus:ring-0 text-lg resize-none placeholder-[#c7c4d6] dark:placeholder-gray-500 bg-transparent dark:text-white p-0 mt-2 h-24 outline-none"
                ></textarea>
                <div className="flex items-center justify-between border-t border-[#f0edec] dark:border-gray-800 pt-3">
                  <div className="flex gap-2 text-[#4441c4]">
                    {/* Image Icon Button */}
                    <button className="p-2 hover:bg-[#e2dfff] dark:hover:bg-[#4441c4]/20 rounded-full transition-colors cursor-pointer flex items-center justify-center" title="Attach Image">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </button>
                    {/* GIF Icon Button */}
                    <button className="p-2 hover:bg-[#e2dfff] dark:hover:bg-[#4441c4]/20 rounded-full transition-colors cursor-pointer flex items-center justify-center" title="Attach GIF">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="M10 8h4"></path>
                        <path d="M12 8v8"></path>
                      </svg>
                    </button>
                  </div>
                  <button 
                    onClick={handlePost}
                    disabled={isPosting}
                    className="bg-[#4441c4] text-white px-6 py-2 rounded-full font-bold hover:bg-[#5d5cde] transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
     
      {/* Mobile Nav Bar (Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-t border-[#e5e2e1] dark:border-gray-800 flex justify-around py-3 px-2 z-50 transition-colors">
        <a className="flex flex-col items-center gap-1 text-[#4441c4]" href="#">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </a>
        <a className="flex flex-col items-center gap-1 text-[#464554] dark:text-gray-400" href="#">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </a>
        <a className="flex flex-col items-center gap-1 text-[#464554] dark:text-gray-400" href="#">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default HomePage;