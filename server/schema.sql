CREATE DATABASE IF NOT EXISTS movie_booking;
USE movie_booking;

-- Drop old/stale tables
DROP TABLE IF EXISTS booking_details;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS showtimes;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS theaters;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(100),
  duration INT,
  rating DECIMAL(3,1),
  poster_url VARCHAR(500),
  release_date DATE,
  status VARCHAR(50) DEFAULT 'now_showing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theaters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  total_seats INT DEFAULT 240,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS showtimes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  movie_id INT NOT NULL,
  theater_id INT NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  available_seats INT DEFAULT 80,
  price DECIMAL(10,2) DEFAULT 250,
  screen_number INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  showtime_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_showtime_seat (showtime_id, seat_number)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  showtime_id INT NOT NULL,
  total_seats INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  payment_status VARCHAR(50) DEFAULT 'completed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  seat_id INT NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

CREATE INDEX idx_movie_genre ON movies(genre);
CREATE INDEX idx_showtime_date ON showtimes(show_date);
CREATE INDEX idx_booking_user ON bookings(user_id);
