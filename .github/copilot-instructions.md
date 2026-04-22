<!-- MovieFlix - Movie Ticket Booking Website Setup Instructions -->

# MovieFlix Development Guide

## Overview
This is a full-stack movie ticket booking website with a minimal file structure, built with React, Tailwind CSS, Node.js, Express, and MySQL.

## Project Structure

```
DBMS FINAL PROJECT/
├── server/
│   ├── index.js           # Express server + all API routes
│   ├── db.js              # Database connection pool
│   ├── schema.sql         # Database schema
│   ├── package.json
│   ├── .env.example
│   └── .env (create from example)
│
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.css          # Tailwind + custom styles
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx        # Main router & auth state
│       ├── api.js         # API service with axios
│       ├── components/
│       │   └── Navbar.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── MovieDetail.jsx
│           ├── BookingPage.jsx
│           ├── MyBookings.jsx
│           └── Auth.jsx
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 16+
- MySQL Server running
- npm package manager

### 1. Database Setup

```bash
cd server
mysql -u root -p < schema.sql
```

This creates the `movie_booking` database with all tables.

### 2. Backend Configuration

```bash
cd server
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_booking
PORT=5000
JWT_SECRET=your_secret_key_here
```

### 3. Install Dependencies & Run

```bash
# Backend
cd server
npm install
npm run dev    # Runs on http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev    # Runs on http://localhost:3000
```

## Key Features

- **Minimal Files**: Everything organized in just 2 main folders
- **Netflix-like UI**: Dark theme, grid layout, hover effects
- **Authentication**: JWT-based user auth with bcrypt
- **Seat Selection**: Interactive seat map with real-time booking
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Clean Code**: Well-organized, easy to understand

## Architecture

### Backend
- Express server with built-in routes (no separate route files)
- Connection pooling for MySQL
- JWT middleware for protected routes
- Password hashing with bcrypt

### Frontend
- React Router for navigation
- Axios with interceptors for API calls
- localStorage for token persistence
- Reusable components

## API Flow

1. **Authentication** → User registers/logs in
2. **Browse** → Load all movies from database
3. **Select** → View movie details and showtimes
4. **Book** → Select seats and create booking
5. **Confirm** → View booking in "My Bookings"

## Database Relationships

```
users (1) ──→ (many) bookings
                        ↓
movies (1) ──→ (many) shows ──→ (many) seats
                        ↑
                   bookings (through show_id)
                        
booking_seats (junction table linking bookings & seats)
```

## Testing the App

1. Create user account at `/auth`
2. Browse movies on homepage
3. Click a movie to see details & showtimes
4. Select showtime → choose seats → confirm booking
5. View bookings in "My Bookings"

## Common Customizations

### Add More Movies
In MySQL:
```sql
INSERT INTO movies VALUES (NULL, 'Movie Title', 'Description', 'Genre', 120, 8.5, 'poster_url.jpg', '2024-01-01', NOW());
INSERT INTO shows VALUES (NULL, 1, '2024-01-15', '14:00:00', 1, NOW());
INSERT INTO seats VALUES (NULL, 1, 'A', 1, 0, 250, NOW();
```

### Change Seat Price
In `client/src/pages/BookingPage.jsx`:
```javascript
const SEAT_PRICE = 250; // Change this value
```

### Modify UI Colors
In `client/tailwind.config.js`:
```javascript
colors: {
  netflix: {
    red: '#e50914',
    dark: '#0a0e27'
  }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check vite.config.js proxy settings |
| Database connection fails | Verify MySQL is running, check .env |
| 401 Unauthorized on bookings | Ensure token is in localStorage, check JWT_SECRET |
| Seats not loading | Verify shows exist with seats in database |
| Build failures | Delete node_modules & reinstall: `npm install` |

## Environment Files

### .env.example (server)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=movie_booking
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

## Performance Tips

- Database indexes on frequently queried columns (included in schema)
- Connection pooling reduces overhead
- Vite for fast frontend development
- JWT tokens stored in localStorage for persistence

## Future Enhancement Ideas

- Payment gateway (Stripe/PayPal)
- Email notifications
- Admin panel for managers
- Review & rating system
- Social sharing
- Seat availability WebSocket sync

---

**Note**: This project is intentionally kept minimal for learning purposes. All code is self-contained to reduce complexity.
