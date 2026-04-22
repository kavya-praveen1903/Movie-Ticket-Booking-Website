import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-[#b20710]">
          MovieFlix
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-300">{user.username || user.email}</span>
              <Link to="/my-bookings" className="hover:text-[#b20710]">
                My Bookings
              </Link>
              <button onClick={onLogout} className="rounded bg-[#b20710] px-4 py-2 hover:bg-[#8f0610]">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="rounded bg-[#b20710] px-4 py-2 hover:bg-[#8f0610]">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
