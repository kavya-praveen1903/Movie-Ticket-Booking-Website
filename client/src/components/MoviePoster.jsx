import React, { useState } from 'react';
import { getMoviePoster, isPlaceholderPoster } from '../utils/movieUi';

export default function MoviePoster({ movie, className = '' }) {
  const [failed, setFailed] = useState(false);
  const posterUrl = getMoviePoster(movie);
  const showFallback = failed || isPlaceholderPoster(posterUrl);

  if (showFallback) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 text-center text-sm text-gray-300 ${className}`}>
        Poster unavailable
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={movie?.title}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
