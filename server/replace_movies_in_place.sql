USE movie_booking;

UPDATE movies
SET
  title = 'Dune',
  description = 'Paul Atreides leads a dangerous journey across Arrakis to protect his future and his people',
  genre = 'Sci-Fi',
  duration = 155,
  rating = 8.0,
  poster_url = 'https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg'
WHERE id = 5;

UPDATE movies
SET
  title = 'Star Wars',
  description = 'A farm boy joins a rebellion to battle an empire and discover a larger destiny',
  genre = 'Sci-Fi',
  duration = 121,
  rating = 8.6,
  poster_url = 'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg'
WHERE id = 6;

UPDATE movies
SET
  title = 'WALL-E',
  description = 'A lonely waste-collecting robot leaves Earth and discovers a mission that may save humanity',
  genre = 'Sci-Fi',
  duration = 98,
  rating = 8.4,
  poster_url = 'https://upload.wikimedia.org/wikipedia/en/4/4c/WALL-E_poster.jpg'
WHERE id = 26;

UPDATE movies
SET
  title = 'Arrival',
  description = 'A linguist works with the military to understand visitors who have landed across the world',
  genre = 'Sci-Fi',
  duration = 116,
  rating = 7.9,
  poster_url = 'https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg'
WHERE id = 27;

UPDATE movies
SET
  title = 'The Martian',
  description = 'An astronaut stranded on Mars uses science and determination to survive',
  genre = 'Sci-Fi',
  duration = 144,
  rating = 8.0,
  poster_url = 'https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg'
WHERE id = 28;

UPDATE movies
SET
  title = 'Blade Runner 2049',
  description = 'A new blade runner uncovers a secret that could change what remains of society',
  genre = 'Sci-Fi',
  duration = 164,
  rating = 8.0,
  poster_url = 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png'
WHERE id = 29;

UPDATE movies
SET
  title = 'Gravity',
  description = 'Two astronauts struggle to survive after debris destroys their shuttle in orbit',
  genre = 'Sci-Fi',
  duration = 91,
  rating = 7.7,
  poster_url = 'https://upload.wikimedia.org/wikipedia/en/f/f6/Gravity_Poster.jpg'
WHERE id = 30;
