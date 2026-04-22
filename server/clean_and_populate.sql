USE movie_booking;

-- Clear all existing data
DELETE FROM booking_details;
DELETE FROM bookings;
DELETE FROM seats;
DELETE FROM showtimes;
DELETE FROM movies;
DELETE FROM theaters;

-- Reset auto increment to 1
ALTER TABLE movies AUTO_INCREMENT = 1;
ALTER TABLE theaters AUTO_INCREMENT = 1;
ALTER TABLE showtimes AUTO_INCREMENT = 1;
ALTER TABLE seats AUTO_INCREMENT = 1;
ALTER TABLE bookings AUTO_INCREMENT = 1;
ALTER TABLE booking_details AUTO_INCREMENT = 1;

-- Add theaters
INSERT INTO theaters (id, name, location, total_seats) VALUES
(1, 'Grand Cinema', 'Downtown', 240),
(2, 'Galaxy Multiplex', 'City Center', 240),
(3, 'CineSquare', 'Lake Road', 240),
(4, 'Silver Screens', 'Mall Plaza', 240),
(5, 'Star View', 'Riverside', 240);

-- Insert 30 Movies
INSERT INTO movies (title, description, genre, duration, rating, poster_url, release_date, status) VALUES
('The Dark Knight', 'Batman faces the Joker in a thrilling battle for Gotham', 'Action', 152, 9.0, 'https://via.placeholder.com/300x450?text=The+Dark+Knight', '2024-01-01', 'now_showing'),
('Inception', 'A skilled thief leads a team to plant an idea in someones mind', 'Sci-Fi', 148, 8.8, 'https://via.placeholder.com/300x450?text=Inception', '2024-01-02', 'now_showing'),
('Interstellar', 'A team of astronauts travels through a wormhole to save humanity', 'Sci-Fi', 169, 8.7, 'https://via.placeholder.com/300x450?text=Interstellar', '2024-01-03', 'now_showing'),
('Gladiator', 'A former slave-turned-gladiator fights for his freedom and justice', 'Action', 155, 8.5, 'https://via.placeholder.com/300x450?text=Gladiator', '2024-01-04', 'now_showing'),
('Dune', 'Paul Atreides leads a dangerous journey across Arrakis to protect his future and his people', 'Sci-Fi', 155, 8.0, 'https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg', '2024-01-05', 'now_showing'),
('Star Wars', 'A farm boy joins a rebellion to battle an empire and discover a larger destiny', 'Sci-Fi', 121, 8.6, 'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg', '2024-01-06', 'now_showing'),
('Avatar', 'A paraplegic Marine infiltrates an alien civilization', 'Sci-Fi', 162, 8.0, 'https://via.placeholder.com/300x450?text=Avatar', '2024-01-07', 'now_showing'),
('The Matrix', 'A computer programmer discovers the true nature of his reality', 'Sci-Fi', 136, 8.7, 'https://via.placeholder.com/300x450?text=The+Matrix', '2024-01-08', 'now_showing'),
('Titanic', 'A love story unfolds aboard the ill-fated RMS Titanic', 'Romance', 194, 7.9, 'https://via.placeholder.com/300x450?text=Titanic', '2024-01-09', 'now_showing'),
('Forrest Gump', 'A man with low IQ achieves extraordinary things in his life', 'Drama', 142, 8.8, 'https://via.placeholder.com/300x450?text=Forrest+Gump', '2024-01-10', 'now_showing'),
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years', 'Drama', 142, 9.3, 'https://via.placeholder.com/300x450?text=The+Shawshank+Redemption', '2024-01-11', 'now_showing'),
('Jurassic Park', 'A pragmatic paleontologist tours an almost complete theme park', 'Adventure', 127, 8.1, 'https://via.placeholder.com/300x450?text=Jurassic+Park', '2024-01-12', 'now_showing'),
('The Avengers', 'Earths mightiest heroes must come together to save the world', 'Action', 143, 8.0, 'https://via.placeholder.com/300x450?text=The+Avengers', '2024-01-13', 'now_showing'),
('Black Panther', 'A young king fights to protect his nation and its secrets', 'Action', 134, 7.3, 'https://via.placeholder.com/300x450?text=Black+Panther', '2024-01-14', 'now_showing'),
('Avengers Endgame', 'The Avengers make one final stand against Thanos', 'Action', 181, 8.4, 'https://via.placeholder.com/300x450?text=Avengers+Endgame', '2024-01-15', 'now_showing'),
('The Lion King', 'A young lion flees his kingdom after his fathers death', 'Animation', 88, 8.5, 'https://via.placeholder.com/300x450?text=The+Lion+King', '2024-01-16', 'now_showing'),
('Frozen', 'Two sisters fight to save their frozen kingdom', 'Animation', 102, 7.4, 'https://via.placeholder.com/300x450?text=Frozen', '2024-01-17', 'now_showing'),
('Toy Story', 'A cowboy doll is jealous of a space ranger', 'Animation', 81, 8.3, 'https://via.placeholder.com/300x450?text=Toy+Story', '2024-01-18', 'now_showing'),
('Finding Nemo', 'A fish searches for his kidnapped son across the ocean', 'Animation', 100, 8.1, 'https://via.placeholder.com/300x450?text=Finding+Nemo', '2024-01-19', 'now_showing'),
('The Good the Bad and the Ugly', 'Three gunslingers search for buried gold', 'Western', 161, 8.9, 'https://via.placeholder.com/300x450?text=The+Good+Bad+Ugly', '2024-01-20', 'now_showing'),
('Back to the Future', 'A teenager is sent back to 1955 in a time machine', 'Comedy', 116, 8.5, 'https://via.placeholder.com/300x450?text=Back+to+the+Future', '2024-01-21', 'now_showing'),
('Independence Day', 'Aliens attack Earth and humans must fight back', 'Sci-Fi', 145, 7.0, 'https://via.placeholder.com/300x450?text=Independence+Day', '2024-01-22', 'now_showing'),
('E.T. the Extra-Terrestrial', 'A boy befriends an alien stranded on Earth', 'Sci-Fi', 115, 7.9, 'https://via.placeholder.com/300x450?text=ET', '2024-01-23', 'now_showing'),
('The Sixth Sense', 'A boy who sees dead people helps a psychologist', 'Thriller', 107, 8.2, 'https://via.placeholder.com/300x450?text=The+Sixth+Sense', '2024-01-24', 'now_showing'),
('Jaws', 'A police chief hunts a massive great white shark', 'Thriller', 124, 8.0, 'https://via.placeholder.com/300x450?text=Jaws', '2024-01-25', 'now_showing'),
('WALL-E', 'A lonely waste-collecting robot leaves Earth and discovers a mission that may save humanity', 'Sci-Fi', 98, 8.4, 'https://upload.wikimedia.org/wikipedia/en/4/4c/WALL-E_poster.jpg', '2024-01-26', 'now_showing'),
('Arrival', 'A linguist works with the military to understand visitors who have landed across the world', 'Sci-Fi', 116, 7.9, 'https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg', '2024-01-27', 'now_showing'),
('The Martian', 'An astronaut stranded on Mars uses science and determination to survive', 'Sci-Fi', 144, 8.0, 'https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg', '2024-01-28', 'now_showing'),
('Blade Runner 2049', 'A new blade runner uncovers a secret that could change what remains of society', 'Sci-Fi', 164, 8.0, 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png', '2024-01-29', 'now_showing'),
('Gravity', 'Two astronauts struggle to survive after debris destroys their shuttle in orbit', 'Sci-Fi', 91, 7.7, 'https://upload.wikimedia.org/wikipedia/en/f/f6/Gravity_Poster.jpg', '2024-01-30', 'now_showing');
