import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { Search, Send } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../AuthContext';

import { io } from 'socket.io-client';

const MessagesPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/user/all');
        // Filter out the current user from the list
        const otherUsers = (res.data.users || []).filter(u => u._id !== currentUser?.id);
        setUsers(otherUsers);
        if (otherUsers.length > 0) setActiveChat(otherUsers[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    let socket;
    if (currentUser) {
      socket = io('http://localhost:5000', {
        query: { userId: currentUser.id }
      });

      socket.on('newMessage', (newMsg) => {
        // Only append if the message belongs to the active chat
        setActiveChat((currentActiveChat) => {
          if (currentActiveChat && newMsg.sender === currentActiveChat._id) {
            setMessages((prev) => [...prev, newMsg]);
          }
          return currentActiveChat;
        });
      });
    }
    return () => {
      if (socket) socket.close();
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const res = await api.get(`/message/${activeChat._id}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;
    try {
      const res = await api.post(`/message/send/${activeChat._id}`, { text: message });
      setMessages((prev) => [...prev, res.data.message]);
      setMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans antialiased flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8 flex-grow w-full">
        <Sidebar />
        
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-divider h-[600px] flex overflow-hidden transition-colors duration-300">
            
            {/* Sidebar / Chat List */}
            <div className="w-1/3 border-r border-divider flex flex-col bg-canvas">
              <div className="p-4 border-b border-divider">
                <h2 className="text-xl font-serif font-bold mb-4">Messages</h2>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-secondary" />
                  <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full pl-9 pr-4 py-2 border border-divider bg-surface rounded-full text-sm placeholder:text-secondary text-primary focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-secondary text-sm">Loading users...</div>
                ) : users.length > 0 ? (
                  users.map(u => (
                    <div 
                      key={u._id} 
                      onClick={() => setActiveChat(u)}
                      className={`flex items-center gap-3 p-4 cursor-pointer border-b border-divider transition-colors ${activeChat?._id === u._id ? 'bg-surface border-l-4 border-l-accent' : 'hover:bg-surface/50 border-l-4 border-l-transparent'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold shrink-0 overflow-hidden border border-divider">
                        {u.profilePic ? <img src={u.profilePic} alt="profile" className="w-full h-full object-cover" /> : u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-primary truncate">{u.name}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-secondary truncate">Click to message...</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-secondary text-sm">No users found.</div>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="w-2/3 flex flex-col bg-surface">
              {activeChat ? (
                <>
              <div className="p-4 border-b border-divider flex items-center justify-between bg-canvas">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold overflow-hidden border border-divider">
                    {activeChat.profilePic ? <img src={activeChat.profilePic} alt="profile" className="w-full h-full object-cover" /> : activeChat.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{activeChat.name}</h3>
                    <p className="text-xs text-secondary">Active now</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map(msg => {
                  const isMe = msg.sender === currentUser?.id;
                  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-accent text-white rounded-br-sm' : 'bg-canvas border border-divider text-primary rounded-bl-sm'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70 text-right' : 'text-secondary'}`}>{time}</p>
                    </div>
                  </div>
                )})}
              </div>
              
              <div className="p-4 border-t border-divider bg-canvas">
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-divider bg-surface rounded-full px-4 py-2.5 text-sm placeholder:text-secondary focus:ring-1 focus:ring-accent outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                  <button onClick={handleSendMessage} className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer" disabled={!message.trim()}>
                    <Send className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-secondary">
                  <p>Select a user to start messaging</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
