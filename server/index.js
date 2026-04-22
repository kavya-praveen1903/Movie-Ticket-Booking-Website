import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { query } from './db.js';
import { createShowtimeSeeds, movieSeeds, theaterSeeds } from './seedData.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DEFAULT_SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const DEFAULT_SEATS_PER_ROW = 10;
const THEATER_PRESETS = [
  { name: 'Grand Cinema', location: 'Downtown' },
  { name: 'Galaxy Multiplex', location: 'City Center' },
  { name: 'CineSquare', location: 'Lake Road' },
  { name: 'Silver Screens', location: 'Mall Plaza' },
  { name: 'Star View', location: 'Riverside' },
];
const DB_INIT_HEADER = 'x-init-key';
const EFFECTIVE_SHOW_DATE_SQL = `CASE
  WHEN (
    SELECT COUNT(*)
    FROM showtimes movie_future
    WHERE movie_future.movie_id = s.movie_id
      AND movie_future.show_date >= CURDATE()
  ) = 0
  THEN DATE_ADD(
    CURDATE(),
    INTERVAL DATEDIFF(
      s.show_date,
      (
        SELECT MIN(movie_seed.show_date)
        FROM showtimes movie_seed
        WHERE movie_seed.movie_id = s.movie_id
      )
    ) DAY
  )
  ELSE s.show_date
END`;

// MIDDLEWARE - JWT Verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const createDefaultSeatLayout = async (showId) => {
  const existingSeats = await query('SELECT id FROM seats WHERE showtime_id = ? LIMIT 1', [showId]);
  if (existingSeats.length > 0) return;

  const seatValues = [];
  const seatPlaceholders = [];

  DEFAULT_SEAT_ROWS.forEach((row) => {
    for (let seatNumber = 1; seatNumber <= DEFAULT_SEATS_PER_ROW; seatNumber += 1) {
      seatPlaceholders.push('(?, ?, ?)');
      seatValues.push(showId, `${row}${seatNumber}`, 'available');
    }
  });

  await query(
    `INSERT INTO seats (showtime_id, seat_number, status) VALUES ${seatPlaceholders.join(', ')}`,
    seatValues
  );
};

const withFallbackTheaters = (shows) =>
  shows.map((show, index) => {
    const preset = THEATER_PRESETS[index % THEATER_PRESETS.length];
    const hasSpecificTheater =
      show.theater_name &&
      show.theater_location &&
      !(show.theater_name === 'Grand Cinema' && show.theater_location === 'Downtown');

    if (hasSpecificTheater) return show;

    return {
      ...show,
      theater_name: preset.name,
      theater_location: preset.location,
    };
  });

const ensureInitializationAuthorized = (req, res) => {
  const providedKey = req.headers[DB_INIT_HEADER];
  if (!process.env.JWT_SECRET || providedKey !== process.env.JWT_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
};

const initializeHostedDatabase = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        genre VARCHAR(100),
        duration INT,
        rating DECIMAL(3, 1),
        poster_url VARCHAR(500),
        release_date DATE,
        status VARCHAR(50) DEFAULT 'now_showing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS theaters (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        total_seats INT DEFAULT 240,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS showtimes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        movie_id INT NOT NULL,
        theater_id INT NOT NULL,
        show_date DATE NOT NULL,
        show_time TIME NOT NULL,
        available_seats INT DEFAULT 80,
        price DECIMAL(10, 2) DEFAULT 250,
        screen_number INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        showtime_id INT NOT NULL,
        seat_number VARCHAR(10) NOT NULL,
        status VARCHAR(20) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_showtime_seat (showtime_id, seat_number)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        showtime_id INT NOT NULL,
        total_seats INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        payment_status VARCHAR(50) DEFAULT 'completed',
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS booking_details (
        id INT PRIMARY KEY AUTO_INCREMENT,
        booking_id INT NOT NULL,
        seat_id INT NOT NULL,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
      )
    `);

    await connection.query('DELETE FROM booking_details');
    await connection.query('DELETE FROM bookings');
    await connection.query('DELETE FROM seats');
    await connection.query('DELETE FROM showtimes');
    await connection.query('DELETE FROM movies');
    await connection.query('DELETE FROM theaters');

    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE movies AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE theaters AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE showtimes AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE seats AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE bookings AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE booking_details AUTO_INCREMENT = 1');

    for (const theater of theaterSeeds) {
      await connection.execute(
        'INSERT INTO theaters (name, location, total_seats) VALUES (?, ?, ?)',
        [theater.name, theater.location, theater.total_seats]
      );
    }

    for (const movie of movieSeeds) {
      await connection.execute(
        `INSERT INTO movies
          (title, description, genre, duration, rating, poster_url, release_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          movie.title,
          movie.description,
          movie.genre,
          movie.duration,
          movie.rating,
          movie.poster_url,
          movie.release_date,
          movie.status,
        ]
      );
    }

    const movieRows = await connection.query('SELECT id, title FROM movies ORDER BY id');
    const theaterRows = await connection.query('SELECT id, name FROM theaters ORDER BY id');
    const movieIdByTitle = new Map(movieRows[0].map((movie) => [movie.title, movie.id]));
    const theaterIdByName = new Map(theaterRows[0].map((theater) => [theater.name, theater.id]));

    for (const show of createShowtimeSeeds()) {
      await connection.execute(
        `INSERT INTO showtimes
          (movie_id, theater_id, show_date, show_time, available_seats, price, screen_number)
         VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), ?, ?, ?, ?)`,
        [
          movieIdByTitle.get(show.movie_title),
          theaterIdByName.get(show.theater_name),
          show.show_date_offset,
          show.show_time,
          show.available_seats,
          show.price,
          show.screen_number,
        ]
      );
    }

    await connection.commit();

    const movieCountRows = await connection.query('SELECT COUNT(*) AS count FROM movies');
    const showtimeCountRows = await connection.query('SELECT COUNT(*) AS count FROM showtimes');
    const theaterCountRows = await connection.query('SELECT COUNT(*) AS count FROM theaters');

    return {
      movies: movieCountRows[0][0].count,
      showtimes: showtimeCountRows[0][0].count,
      theaters: theaterCountRows[0][0].count,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await query('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', 
      [email, hashedPassword, username || email.split('@')[0]]);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MOVIES ROUTES ====================

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await query('SELECT * FROM movies ORDER BY release_date DESC');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movies = await query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (movies.length === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json(movies[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SHOWS/SHOWTIMES ROUTES ====================

app.get('/api/movies/:movieId/shows', async (req, res) => {
  try {
    const shows = await query(
      `SELECT
         s.id,
         s.movie_id,
         s.theater_id,
         s.show_time,
         s.available_seats,
         s.price,
         s.screen_number,
         ${EFFECTIVE_SHOW_DATE_SQL} AS effective_show_date,
         t.name AS theater_name,
         t.location AS theater_location
       FROM showtimes s
       LEFT JOIN theaters t ON s.theater_id = t.id
       WHERE s.movie_id = ?
         AND (
           (
             SELECT COUNT(*)
             FROM showtimes movie_future
             WHERE movie_future.movie_id = s.movie_id
               AND movie_future.show_date >= CURDATE()
           ) = 0
           OR s.show_date >= CURDATE()
         )
       ORDER BY effective_show_date, s.show_time`,
      [req.params.movieId]
    );
    res.json(
      withFallbackTheaters(shows).map(({ effective_show_date, ...show }) => ({
        ...show,
        show_date: effective_show_date,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/shows/:id/seats', async (req, res) => {
  try {
    await createDefaultSeatLayout(req.params.id);

    const seats = await query(
      'SELECT * FROM seats WHERE showtime_id = ? ORDER BY seat_number',
      [req.params.id]
    );
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BOOKINGS ROUTES ====================

app.post('/api/bookings', verifyToken, async (req, res) => {
  const { show_id, seat_ids, total_price } = req.body;
  if (!show_id || !seat_ids?.length || !total_price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify user still exists (token may outlive a DB reset)
  const userCheck = await query('SELECT id FROM users WHERE id = ?', [req.user.id]);
  if (userCheck.length === 0) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock and verify seats are still available
    const [seats] = await conn.query(
      'SELECT id FROM seats WHERE id IN (?) AND status = ? FOR UPDATE',
      [seat_ids, 'available']
    );
    if (seats.length !== seat_ids.length) {
      throw new Error('One or more seats are no longer available');
    }

    const [result] = await conn.query(
      'INSERT INTO bookings (user_id, showtime_id, total_seats, total_price, status, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, show_id, seat_ids.length, total_price, 'confirmed', 'completed']
    );
    const booking_id = result.insertId;

    for (const seat_id of seat_ids) {
      await conn.query('INSERT INTO booking_details (booking_id, seat_id) VALUES (?, ?)', [booking_id, seat_id]);
      await conn.query('UPDATE seats SET status = ? WHERE id = ?', ['booked', seat_id]);
    }

    await conn.query(
      'UPDATE showtimes SET available_seats = available_seats - ? WHERE id = ?',
      [seat_ids.length, show_id]
    );

    await conn.commit();
    res.status(201).json({ booking_id, message: 'Booking successful' });
  } catch (error) {
    await conn.rollback();
    console.error('Booking error:', error);
    res.status(400).json({ error: error.message });
  } finally {
    conn.release();
  }
});

app.get('/api/bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await query(
      `SELECT b.id, b.user_id, b.showtime_id, b.total_seats, b.total_price, b.status, b.payment_status, b.booking_date,
              m.title, m.poster_url, ${EFFECTIVE_SHOW_DATE_SQL} AS effective_show_date, s.show_time,
              GROUP_CONCAT(se.seat_number ORDER BY se.seat_number SEPARATOR ', ') AS seat_numbers
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN movies m ON s.movie_id = m.id
       LEFT JOIN booking_details bd ON b.id = bd.booking_id
       LEFT JOIN seats se ON bd.seat_id = se.id
       WHERE b.user_id = ?
       GROUP BY b.id, b.user_id, b.showtime_id, b.total_seats, b.total_price, b.status, b.payment_status, b.booking_date, m.title, m.poster_url, s.show_date, s.show_time
       ORDER BY b.booking_date DESC`,
      [req.user.id]
    );
    res.json(
      bookings.map(({ effective_show_date, ...booking }) => ({
        ...booking,
        show_date: effective_show_date,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/', (req, res) => {
  res.json({
    status: 'Server is running',
    message: 'Use /health or /api endpoints.',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await query('SELECT DATABASE() AS database_name, NOW() AS server_time');
    res.json({ ok: true, ...result[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/admin/init-db', async (req, res) => {
  if (!ensureInitializationAuthorized(req, res)) return;

  try {
    const counts = await initializeHostedDatabase();
    res.json({ ok: true, message: 'Database initialized successfully', counts });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
