USE movie_booking;

-- Clear existing data
DELETE FROM booking_seats;
DELETE FROM bookings;
DELETE FROM seats;
DELETE FROM shows;
DELETE FROM movies;

-- Insert 30 Movies with Poster URLs
INSERT INTO movies (title, description, genre, duration, rating, poster_url, release_date) VALUES
('The Dark Knight', 'Batman faces the Joker in a thrilling battle for Gotham', 'Action', 152, 9.0, 'https://via.placeholder.com/300x450?text=The+Dark+Knight', '2024-01-01'),
('Inception', 'A skilled thief leads a team to plant an idea in someones mind', 'Sci-Fi', 148, 8.8, 'https://via.placeholder.com/300x450?text=Inception', '2024-01-02'),
('Interstellar', 'A team of astronauts travels through a wormhole to save humanity', 'Sci-Fi', 169, 8.7, 'https://via.placeholder.com/300x450?text=Interstellar', '2024-01-03'),
('Gladiator', 'A former slave-turned-gladiator fights for his freedom and justice', 'Action', 155, 8.5, 'https://via.placeholder.com/300x450?text=Gladiator', '2024-01-04'),
('Pulp Fiction', 'Multiple interconnected stories unfold in Los Angeles', 'Drama', 154, 8.9, 'https://via.placeholder.com/300x450?text=Pulp+Fiction', '2024-01-05'),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control', 'Drama', 175, 9.2, 'https://via.placeholder.com/300x450?text=The+Godfather', '2024-01-06'),
('Avatar', 'A paraplegic Marine infiltrates an alien civilization', 'Sci-Fi', 162, 8.0, 'https://via.placeholder.com/300x450?text=Avatar', '2024-01-07'),
('The Matrix', 'A computer programmer discovers the true nature of his reality', 'Sci-Fi', 136, 8.7, 'https://via.placeholder.com/300x450?text=The+Matrix', '2024-01-08'),
('Titanic', 'A love story unfolds aboard the ill-fated RMS Titanic', 'Romance', 194, 7.9, 'https://via.placeholder.com/300x450?text=Titanic', '2024-01-09'),
('Forrest Gump', 'A man with low IQ achieves extraordinary things in his life', 'Drama', 142, 8.8, 'https://via.placeholder.com/300x450?text=Forrest+Gump', '2024-01-10'),
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years', 'Drama', 142, 9.3, 'https://via.placeholder.com/300x450?text=The+Shawshank+Redemption', '2024-01-11'),
('Jurassic Park', 'A pragmatic paleontologist tours an almost complete theme park', 'Adventure', 127, 8.1, 'https://via.placeholder.com/300x450?text=Jurassic+Park', '2024-01-12'),
('The Avengers', 'Earths mightiest heroes must come together to save the world', 'Action', 143, 8.0, 'https://via.placeholder.com/300x450?text=The+Avengers', '2024-01-13'),
('Black Panther', 'A young king fights to protect his nation and its secrets', 'Action', 134, 7.3, 'https://via.placeholder.com/300x450?text=Black+Panther', '2024-01-14'),
('Avengers Endgame', 'The Avengers make one final stand against Thanos', 'Action', 181, 8.4, 'https://via.placeholder.com/300x450?text=Avengers+Endgame', '2024-01-15'),
('The Lion King', 'A young lion flees his kingdom after his fathers death', 'Animation', 88, 8.5, 'https://via.placeholder.com/300x450?text=The+Lion+King', '2024-01-16'),
('Frozen', 'Two sisters fight to save their frozen kingdom', 'Animation', 102, 7.4, 'https://via.placeholder.com/300x450?text=Frozen', '2024-01-17'),
('Toy Story', 'A cowboy doll is jealous of a space ranger', 'Animation', 81, 8.3, 'https://via.placeholder.com/300x450?text=Toy+Story', '2024-01-18'),
('Finding Nemo', 'A fish searches for his kidnapped son across the ocean', 'Animation', 100, 8.1, 'https://via.placeholder.com/300x450?text=Finding+Nemo', '2024-01-19'),
('The Good the Bad and the Ugly', 'Three gunslingers search for buried gold', 'Western', 161, 8.9, 'https://via.placeholder.com/300x450?text=The+Good+Bad+Ugly', '2024-01-20'),
('Back to the Future', 'A teenager is sent back to 1955 in a time machine', 'Comedy', 116, 8.5, 'https://via.placeholder.com/300x450?text=Back+to+the+Future', '2024-01-21'),
('Independence Day', 'Aliens attack Earth and humans must fight back', 'Sci-Fi', 145, 7.0, 'https://via.placeholder.com/300x450?text=Independence+Day', '2024-01-22'),
('E.T. the Extra-Terrestrial', 'A boy befriends an alien stranded on Earth', 'Sci-Fi', 115, 7.9, 'https://via.placeholder.com/300x450?text=ET', '2024-01-23'),
('The Sixth Sense', 'A boy who sees dead people helps a psychologist', 'Thriller', 107, 8.2, 'https://via.placeholder.com/300x450?text=The+Sixth+Sense', '2024-01-24'),
('Jaws', 'A police chief hunts a massive great white shark', 'Thriller', 124, 8.0, 'https://via.placeholder.com/300x450?text=Jaws', '2024-01-25'),
('Psycho', 'A woman is murdered in a motel by its proprietor', 'Thriller', 109, 8.4, 'https://via.placeholder.com/300x450?text=Psycho', '2024-01-26'),
('The Silence of the Lambs', 'An FBI trainee seeks help from a cannibalistic psychopath', 'Thriller', 118, 8.6, 'https://via.placeholder.com/300x450?text=The+Silence+of+the+Lambs', '2024-01-27'),
('Se7en', 'Two detectives hunt a serial killer with biblical obsessions', 'Thriller', 127, 8.6, 'https://via.placeholder.com/300x450?text=Se7en', '2024-01-28'),
('The Departed', 'An undercover cop and a mole in the police attempt to identify each other', 'Thriller', 151, 8.5, 'https://via.placeholder.com/300x450?text=The+Departed', '2024-01-29'),
('Fight Club', 'An insomniac office worker forms an underground fight club', 'Drama', 139, 8.8, 'https://via.placeholder.com/300x450?text=Fight+Club', '2024-01-30');

-- Insert Showtimes for each movie (2-3 shows per day)
INSERT INTO shows (movie_id, show_date, show_time, screen_number) VALUES
(1, CURDATE(), '10:00:00', 1), (1, CURDATE(), '14:00:00', 1), (1, CURDATE(), '19:00:00', 2),
(2, CURDATE(), '11:00:00', 2), (2, CURDATE(), '15:00:00', 3),
(3, CURDATE(), '12:00:00', 3), (3, CURDATE(), '17:00:00', 1),
(4, CURDATE(), '10:30:00', 2), (4, CURDATE(), '15:30:00', 2),
(5, CURDATE(), '13:00:00', 3), (5, CURDATE(), '18:00:00', 1),
(6, CURDATE(), '11:30:00', 1), (6, CURDATE(), '16:30:00', 3),
(7, CURDATE(), '10:00:00', 2), (7, CURDATE(), '14:00:00', 2),
(8, CURDATE(), '12:00:00', 1), (8, CURDATE(), '19:00:00', 3),
(9, CURDATE(), '11:00:00', 3), (9, CURDATE(), '15:00:00', 1),
(10, CURDATE(), '13:00:00', 2), (10, CURDATE(), '17:00:00', 2),
(11, CURDATE(), '10:30:00', 1), (11, CURDATE(), '14:30:00', 3),
(12, CURDATE(), '12:00:00', 2), (12, CURDATE(), '18:00:00', 1),
(13, CURDATE(), '11:00:00', 3), (13, CURDATE(), '15:00:00', 2),
(14, CURDATE(), '10:00:00', 1), (14, CURDATE(), '16:00:00', 3),
(15, CURDATE(), '13:00:00', 1), (15, CURDATE(), '19:00:00', 2),
(16, CURDATE(), '11:30:00', 2), (16, CURDATE(), '15:30:00', 3),
(17, CURDATE(), '10:00:00', 1), (17, CURDATE(), '14:00:00', 2),
(18, CURDATE(), '12:00:00', 3), (18, CURDATE(), '17:00:00', 1),
(19, CURDATE(), '11:00:00', 2), (19, CURDATE(), '15:00:00', 3),
(20, CURDATE(), '13:00:00', 1), (20, CURDATE(), '18:00:00', 2),
(21, CURDATE(), '10:30:00', 3), (21, CURDATE(), '14:30:00', 1),
(22, CURDATE(), '12:00:00', 2), (22, CURDATE(), '19:00:00', 3),
(23, CURDATE(), '11:00:00', 1), (23, CURDATE(), '15:00:00', 2),
(24, CURDATE(), '10:00:00', 3), (24, CURDATE(), '16:00:00', 1),
(25, CURDATE(), '13:00:00', 2), (25, CURDATE(), '18:00:00', 3),
(26, CURDATE(), '11:30:00', 1), (26, CURDATE(), '15:30:00', 2),
(27, CURDATE(), '10:00:00', 3), (27, CURDATE(), '14:00:00', 1),
(28, CURDATE(), '12:00:00', 2), (28, CURDATE(), '17:00:00', 3),
(29, CURDATE(), '11:00:00', 1), (29, CURDATE(), '15:00:00', 2),
(30, CURDATE(), '10:00:00', 1), (30, CURDATE(), '13:30:00', 3), (30, CURDATE(), '19:30:00', 2);

-- Insert Seats (10 seats per row, 8 rows per show = 80 seats per show) for first 63 shows
INSERT INTO seats (show_id, row_number, seat_number, is_booked, price) VALUES
(1,'A',1,0,250),(1,'A',2,0,250),(1,'A',3,0,250),(1,'A',4,0,250),(1,'A',5,0,250),(1,'A',6,0,250),(1,'A',7,0,250),(1,'A',8,0,250),(1,'A',9,0,250),(1,'A',10,0,250),
(1,'B',1,0,250),(1,'B',2,0,250),(1,'B',3,0,250),(1,'B',4,0,250),(1,'B',5,0,250),(1,'B',6,0,250),(1,'B',7,0,250),(1,'B',8,0,250),(1,'B',9,0,250),(1,'B',10,0,250),
(1,'C',1,0,250),(1,'C',2,0,250),(1,'C',3,0,250),(1,'C',4,0,250),(1,'C',5,0,250),(1,'C',6,0,250),(1,'C',7,0,250),(1,'C',8,0,250),(1,'C',9,0,250),(1,'C',10,0,250),
(1,'D',1,0,250),(1,'D',2,0,250),(1,'D',3,0,250),(1,'D',4,0,250),(1,'D',5,0,250),(1,'D',6,0,250),(1,'D',7,0,250),(1,'D',8,0,250),(1,'D',9,0,250),(1,'D',10,0,250),
(1,'E',1,0,250),(1,'E',2,0,250),(1,'E',3,0,250),(1,'E',4,0,250),(1,'E',5,0,250),(1,'E',6,0,250),(1,'E',7,0,250),(1,'E',8,0,250),(1,'E',9,0,250),(1,'E',10,0,250),
(1,'F',1,0,250),(1,'F',2,0,250),(1,'F',3,0,250),(1,'F',4,0,250),(1,'F',5,0,250),(1,'F',6,0,250),(1,'F',7,0,250),(1,'F',8,0,250),(1,'F',9,0,250),(1,'F',10,0,250),
(1,'G',1,0,250),(1,'G',2,0,250),(1,'G',3,0,250),(1,'G',4,0,250),(1,'G',5,0,250),(1,'G',6,0,250),(1,'G',7,0,250),(1,'G',8,0,250),(1,'G',9,0,250),(1,'G',10,0,250),
(1,'H',1,0,250),(1,'H',2,0,250),(1,'H',3,0,250),(1,'H',4,0,250),(1,'H',5,0,250),(1,'H',6,0,250),(1,'H',7,0,250),(1,'H',8,0,250),(1,'H',9,0,250),(1,'H',10,0,250),
(2,'A',1,0,250),(2,'A',2,0,250),(2,'A',3,0,250),(2,'A',4,0,250),(2,'A',5,0,250),(2,'A',6,0,250),(2,'A',7,0,250),(2,'A',8,0,250),(2,'A',9,0,250),(2,'A',10,0,250),
(2,'B',1,0,250),(2,'B',2,0,250),(2,'B',3,0,250),(2,'B',4,0,250),(2,'B',5,0,250),(2,'B',6,0,250),(2,'B',7,0,250),(2,'B',8,0,250),(2,'B',9,0,250),(2,'B',10,0,250),
(2,'C',1,0,250),(2,'C',2,0,250),(2,'C',3,0,250),(2,'C',4,0,250),(2,'C',5,0,250),(2,'C',6,0,250),(2,'C',7,0,250),(2,'C',8,0,250),(2,'C',9,0,250),(2,'C',10,0,250),
(2,'D',1,0,250),(2,'D',2,0,250),(2,'D',3,0,250),(2,'D',4,0,250),(2,'D',5,0,250),(2,'D',6,0,250),(2,'D',7,0,250),(2,'D',8,0,250),(2,'D',9,0,250),(2,'D',10,0,250),
(2,'E',1,0,250),(2,'E',2,0,250),(2,'E',3,0,250),(2,'E',4,0,250),(2,'E',5,0,250),(2,'E',6,0,250),(2,'E',7,0,250),(2,'E',8,0,250),(2,'E',9,0,250),(2,'E',10,0,250),
(2,'F',1,0,250),(2,'F',2,0,250),(2,'F',3,0,250),(2,'F',4,0,250),(2,'F',5,0,250),(2,'F',6,0,250),(2,'F',7,0,250),(2,'F',8,0,250),(2,'F',9,0,250),(2,'F',10,0,250),
(2,'G',1,0,250),(2,'G',2,0,250),(2,'G',3,0,250),(2,'G',4,0,250),(2,'G',5,0,250),(2,'G',6,0,250),(2,'G',7,0,250),(2,'G',8,0,250),(2,'G',9,0,250),(2,'G',10,0,250),
(2,'H',1,0,250),(2,'H',2,0,250),(2,'H',3,0,250),(2,'H',4,0,250),(2,'H',5,0,250),(2,'H',6,0,250),(2,'H',7,0,250),(2,'H',8,0,250),(2,'H',9,0,250),(2,'H',10,0,250),
(3,'A',1,0,250),(3,'A',2,0,250),(3,'A',3,0,250),(3,'A',4,0,250),(3,'A',5,0,250),(3,'A',6,0,250),(3,'A',7,0,250),(3,'A',8,0,250),(3,'A',9,0,250),(3,'A',10,0,250),
(3,'B',1,0,250),(3,'B',2,0,250),(3,'B',3,0,250),(3,'B',4,0,250),(3,'B',5,0,250),(3,'B',6,0,250),(3,'B',7,0,250),(3,'B',8,0,250),(3,'B',9,0,250),(3,'B',10,0,250),
(3,'C',1,0,250),(3,'C',2,0,250),(3,'C',3,0,250),(3,'C',4,0,250),(3,'C',5,0,250),(3,'C',6,0,250),(3,'C',7,0,250),(3,'C',8,0,250),(3,'C',9,0,250),(3,'C',10,0,250),
(3,'D',1,0,250),(3,'D',2,0,250),(3,'D',3,0,250),(3,'D',4,0,250),(3,'D',5,0,250),(3,'D',6,0,250),(3,'D',7,0,250),(3,'D',8,0,250),(3,'D',9,0,250),(3,'D',10,0,250),
(3,'E',1,0,250),(3,'E',2,0,250),(3,'E',3,0,250),(3,'E',4,0,250),(3,'E',5,0,250),(3,'E',6,0,250),(3,'E',7,0,250),(3,'E',8,0,250),(3,'E',9,0,250),(3,'E',10,0,250),
(3,'F',1,0,250),(3,'F',2,0,250),(3,'F',3,0,250),(3,'F',4,0,250),(3,'F',5,0,250),(3,'F',6,0,250),(3,'F',7,0,250),(3,'F',8,0,250),(3,'F',9,0,250),(3,'F',10,0,250),
(3,'G',1,0,250),(3,'G',2,0,250),(3,'G',3,0,250),(3,'G',4,0,250),(3,'G',5,0,250),(3,'G',6,0,250),(3,'G',7,0,250),(3,'G',8,0,250),(3,'G',9,0,250),(3,'G',10,0,250),
(3,'H',1,0,250),(3,'H',2,0,250),(3,'H',3,0,250),(3,'H',4,0,250),(3,'H',5,0,250),(3,'H',6,0,250),(3,'H',7,0,250),(3,'H',8,0,250),(3,'H',9,0,250),(3,'H',10,0,250);
