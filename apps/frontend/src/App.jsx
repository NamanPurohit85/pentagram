import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/LoginPage';
import HomePage from './Pages/HomePage';
import ProfilePage from './Pages/ProfilePage';
import ExplorePage from './Pages/ExplorePage';
import MessagesPage from './Pages/MessagesPage';
import BookmarksPage from './Pages/BookmarksPage';
import { AuthContext } from './AuthContext';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/profile/:id" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/explore" element={user ? <ExplorePage /> : <Navigate to="/login" />} />
      <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
      <Route path="/bookmarks" element={user ? <BookmarksPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
