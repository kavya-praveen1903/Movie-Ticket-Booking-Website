import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { moviesAPI } from '../api';
import { formatShowDate } from '../utils/movieUi';
import MoviePoster from '../components/MoviePoster';

const MAIN_GENRES = ['Action', 'Sci-Fi', 'Thriller', 'Drama', 'Animation'];
const FEATURED_FIRST_TITLES = [
  'Jaws',
  'WALL-E',
  'Arrival',
  'The Martian',
  'Blade Runner 2049',
  'Gravity',
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await moviesAPI.getAll();
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = useMemo(() => {
    const availableGenres = new Set(movies.map((movie) => movie.genre).filter(Boolean));
    return ['All', ...MAIN_GENRES.filter((genre) => availableGenres.has(genre))];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    const sourceMovies =
      selectedGenre === 'All' ? movies : movies.filter((movie) => movie.genre === selectedGenre);

    return [...sourceMovies].sort((a, b) => {
      const aPriority = FEATURED_FIRST_TITLES.indexOf(a.title);
      const bPriority = FEATURED_FIRST_TITLES.indexOf(b.title);

      const normalizedA = aPriority === -1 ? Number.MAX_SAFE_INTEGER : aPriority;
      const normalizedB = bPriority === -1 ? Number.MAX_SAFE_INTEGER : bPriority;

      if (normalizedA !== normalizedB) return normalizedA - normalizedB;
      return 0;
    });
  }, [movies, selectedGenre]);

  if (loading) return <div className="text-center py-20">Loading movies...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(178,7,16,0.32),_transparent_34%),linear-gradient(135deg,_rgba(17,24,39,0.95),_rgba(3,7,18,0.98))] p-8 shadow-2xl">
        
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
          Choose a movie, explore a proper seat map, and make the booking flow feel polished!
        </h1>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedGenre === genre
                  ? 'border-[#b20710] bg-[#b20710] text-white shadow-lg shadow-[#3b0409]/40'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-[#b20710]/40 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} className="group">
            <div className="movie-card h-[22rem]">
              <MoviePoster movie={movie} className="movie-poster" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="rounded-2xl border border-white/10 bg-black/55 p-3 backdrop-blur-sm transition duration-300 group-hover:border-[#b20710]/40 group-hover:bg-black/70">
                  <p className="mb-1 text-[11px] uppercase tracking-[0.28em] text-[#d85c63]">
                    {movie.genre}
                  </p>
                  <h3 className="min-h-[3rem] text-base font-bold text-white">{movie.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                    <span>{movie.rating}/10</span>
                    <span>{movie.duration} min</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Release: {formatShowDate(movie.release_date)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-gray-400">
          No movies found in the {selectedGenre} category.
        </div>
      )}
    </div>
  );
}
