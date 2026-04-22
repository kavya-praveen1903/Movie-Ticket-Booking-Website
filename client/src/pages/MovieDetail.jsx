import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { moviesAPI } from '../api';
import { formatCurrency, formatShowDate, formatShowTime } from '../utils/movieUi';
import MoviePoster from '../components/MoviePoster';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieAndShows();
  }, [id]);

  const fetchMovieAndShows = async () => {
    try {
      const movieRes = await moviesAPI.getById(id);
      const showsRes = await moviesAPI.getShows(id);
      setMovie(movieRes.data);
      setShows(showsRes.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!movie) return <div className="text-center py-20">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/')} className="mb-6 text-sm uppercase tracking-[0.2em] text-gray-400 transition hover:text-white">
        Back to Home
      </button>

      <div className="grid gap-8 lg:grid-cols-[340px,1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gray-950 shadow-2xl">
          <MoviePoster movie={movie} className="h-full w-full object-cover" />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="rounded-full border border-[#b20710]/30 bg-[#b20710]/10 px-4 py-2">
              Rating {movie.rating}/10
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">{movie.genre}</span>
            <span className="rounded-full border border-white/10 px-4 py-2">{movie.duration} min</span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              From {formatCurrency(250)}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            {movie.title}
          </h1>
          <p className="mb-10 max-w-3xl text-base leading-8 text-gray-300">{movie.description}</p>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose a Showtime</h2>
              <p className="mt-1 text-sm text-gray-400">
                Pick a slot to open the seat layout and book instantly.
              </p>
            </div>
            <p className="hidden text-sm text-gray-400 sm:block">{shows.length} shows available</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shows.map((show, index) => (
              <Link
                key={show.id}
                to={`/booking/${show.id}`}
                className="rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:-translate-y-1 hover:border-[#b20710]/40 hover:bg-[#b20710]/10"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  {show.theater_name ? `${show.theater_name} · ${show.theater_location || 'Location TBA'}` : show.theater_location || 'Theater location'}
                </p>
                <p className="text-xs uppercase tracking-[0.25em] text-[#d85c63]">
                  {`Screen ${show.screen_number || index + 1}`}
                </p>
                <p className="mt-3 text-xl font-bold text-white">{formatShowTime(show.show_time)}</p>
                <p className="mt-2 text-sm text-gray-300">{formatShowDate(show.show_date)}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
                  <span>{show.available_seats} seats left</span>
                  <span>{formatCurrency(show.price || 250)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
