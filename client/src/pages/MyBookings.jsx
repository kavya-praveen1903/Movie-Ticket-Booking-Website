import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../api';
import { formatCurrency, formatShowDate, formatShowTime } from '../utils/movieUi';
import MoviePoster from '../components/MoviePoster';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.error || 'Failed to load bookings. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading bookings...</div>;
  if (error) return <div className="text-center py-20 text-[#c81d25]">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d85c63]">My Bookings</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Your Movie Tickets</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center text-gray-400">
          No bookings yet.{' '}
          <a href="/" className="font-semibold text-[#c81d25] hover:underline">
            Browse movies
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm md:grid-cols-[120px,1fr]"
            >
              <MoviePoster movie={booking} className="h-44 w-full rounded-2xl object-cover md:h-full" />

              <div className="flex flex-col justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-white">{booking.title}</h2>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                      {booking.status || 'confirmed'}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-gray-300 sm:grid-cols-2">
                    <p>{formatShowDate(booking.show_date)}</p>
                    <p>{formatShowTime(booking.show_time)}</p>
                    <p>Booking ID: {booking.id}</p>
                    <p>Seats: {booking.seat_numbers || booking.total_seats}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <p className="text-sm text-gray-400">
                    Payment: {booking.payment_status || 'completed'}
                  </p>
                  <p className="text-xl font-black text-[#c81d25]">
                    {formatCurrency(booking.total_price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
