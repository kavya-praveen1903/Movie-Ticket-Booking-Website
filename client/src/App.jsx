import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import Auth from './pages/Auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div className="container-main flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <Router>
      <div className="container-main">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/booking/:showId" element={<BookingPage />} />
          <Route path="/my-bookings" element={user ? <MyBookings /> : <Auth setUser={setUser} />} />
          <Route path="/auth" element={<Auth setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}
