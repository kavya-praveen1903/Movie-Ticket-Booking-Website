const POSTER_OVERRIDES = {
  'The Dark Knight': 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
  Inception: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
  Interstellar: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
  Gladiator: 'https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png',
  Dune: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg',
  'Star Wars': 'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg',
  Avatar: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg',
  'The Matrix': 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png',
  Titanic: 'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png',
  'Forrest Gump': 'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg',
  'The Shawshank Redemption': 'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg',
  'Jurassic Park': 'https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg',
  'The Avengers': 'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg',
  'Black Panther': 'https://upload.wikimedia.org/wikipedia/en/d/d6/Black_Panther_%28film%29_poster.jpg',
  'Avengers Endgame': 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',
  'Avengers: Endgame': 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',
  'The Lion King': 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg',
  Frozen: 'https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg',
  'Toy Story': 'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
  'Finding Nemo': 'https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg',
  'The Good the Bad and the Ugly': 'https://upload.wikimedia.org/wikipedia/en/4/45/Good_the_bad_and_the_ugly_poster.jpg',
  'Back to the Future': 'https://upload.wikimedia.org/wikipedia/en/d/d2/Back_to_the_Future.jpg',
  'Independence Day': 'https://upload.wikimedia.org/wikipedia/en/b/bb/Independence_day_movieposter.jpg',
  'E.T. the Extra-Terrestrial': 'https://upload.wikimedia.org/wikipedia/en/6/66/E_t_the_extra_terrestrial_ver3.jpg',
  'The Sixth Sense': 'https://upload.wikimedia.org/wikipedia/en/a/a4/The_Sixth_Sense_poster.png',
  Jaws: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Jaws_movie_poster.jpg',
  'WALL-E': 'https://upload.wikimedia.org/wikipedia/en/4/4c/WALL-E_poster.jpg',
  Arrival: 'https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg',
  'The Martian': 'https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg',
  'Blade Runner 2049': 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png',
  Gravity: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Gravity_Poster.jpg',
};

export const isPlaceholderPoster = (posterUrl) =>
  !posterUrl || posterUrl.includes('via.placeholder.com') || posterUrl.includes('placeholder.com');

export const getMoviePoster = (movie) => {
  if (!movie) return '';

  const mappedPoster = POSTER_OVERRIDES[movie.title];
  if (mappedPoster) return mappedPoster;

  if (!isPlaceholderPoster(movie.poster_url)) return movie.poster_url;
  return createFallbackPoster(movie.title);
};

const createFallbackPoster = (title = 'Now Showing') => {
  const label = encodeURIComponent(title);
  return `https://dummyimage.com/600x900/111827/f59e0b&text=${label}`;
};

export const formatShowDate = (value) => {
  if (!value) return 'Date TBA';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

export const formatShowTime = (value) => {
  if (!value) return 'Time TBA';

  const [hours = '0', minutes = '0'] = String(value).split(':');
  const parsed = new Date();
  parsed.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(parsed);
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
