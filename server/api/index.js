import express from "express";
import pool from "./db.js";

const app = express();
app.use(express.json());

/* 🎬 Get Movies */
app.get("/movies", async (req, res) => {
  try {
    const [movies] = await pool.query("SELECT * FROM movies");
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* 🎭 Get Shows */
app.get("/shows/:movieId", async (req, res) => {
  try {
    const [shows] = await pool.query(
      "SELECT * FROM shows WHERE movie_id=?",
      [req.params.movieId]
    );
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 💺 Get Seats */
app.get("/seats/:showId", async (req, res) => {
  try {
    const [seats] = await pool.query(
      "SELECT * FROM seats WHERE show_id=?",
      [req.params.showId]
    );
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🎟️ BOOK TICKETS (FIXED CORE LOGIC) */
app.post("/book", async (req, res) => {
  const { user_id, show_id, seat_ids } = req.body;

  if (!user_id || !show_id || !seat_ids?.length) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 🔒 Lock seats
    const [seats] = await conn.query(
      `SELECT * FROM seats 
       WHERE id IN (?) AND is_booked = false 
       FOR UPDATE`,
      [seat_ids]
    );

    if (seats.length !== seat_ids.length) {
      throw new Error("Some seats already booked");
    }

    // 💰 Calculate total
    const total = seats.reduce((sum, s) => sum + Number(s.price), 0);

    // 📌 Insert booking
    const [bookingResult] = await conn.query(
      "INSERT INTO bookings (user_id, show_id, total_price) VALUES (?, ?, ?)",
      [user_id, show_id, total]
    );

    const bookingId = bookingResult.insertId;

    // 🎯 Mark seats booked
    await conn.query(
      "UPDATE seats SET is_booked = true WHERE id IN (?)",
      [seat_ids]
    );

    // 🔗 Map seats
    for (let id of seat_ids) {
      await conn.query(
        "INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)",
        [bookingId, id]
      );
    }

    await conn.commit();

    res.json({ message: "Booking successful", bookingId });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));