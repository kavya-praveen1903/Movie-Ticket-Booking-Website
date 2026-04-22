# MovieFlix DBMS Project

A movie ticket booking project built with React, Vite, Tailwind CSS, Node.js, Express, and MySQL.

## Structure

```text
DBMS FINAL PROJECT/
  client/   React frontend
  server/   Express + MySQL backend
```

## Run The Project

### 1. Database setup

From the `server` folder, create the schema and load sample data.

```powershell
cd server
mysql -u root -p < schema.sql
mysql -u root -p movie_booking < clean_and_populate.sql
mysql -u root -p movie_booking < add_showtimes_seats.sql
mysql -u root -p movie_booking < fix_posters.sql
```

### 2. Backend

```powershell
cd server
copy .env.example .env
npm install
npm run dev
```

The backend runs on `http://localhost:5001` by default.

### 3. Frontend

```powershell
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Main Features

- Browse movies by genre
- View movie details and showtimes
- See theater name/location and screen number
- Select seats with a visual seat layout
- Register and log in
- Book tickets and view booking history

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Movies

- `GET /api/movies`
- `GET /api/movies/:id`
- `GET /api/movies/:movieId/shows`

### Seats and bookings

- `GET /api/shows/:id/seats`
- `POST /api/bookings`
- `GET /api/bookings`

## Important Files

- [server/schema.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/schema.sql)
- [server/clean_and_populate.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/clean_and_populate.sql)
- [server/add_showtimes_seats.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/add_showtimes_seats.sql)
- [server/fix_posters.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/fix_posters.sql)

## Notes

- If booking pages show no seats, restart the backend and open the show again. Missing seat rows are auto-created now.
- If showtime cards do not update, restart the backend because theater/showtime formatting is server-driven.
- If posters do not update, hard refresh the browser with `Ctrl + F5`.
