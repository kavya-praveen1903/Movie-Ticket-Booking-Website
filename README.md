🎬 MovieFlix – Movie Ticket Booking System
==========================================

A full-stack movie ticket booking platform that allows users to browse movies, view showtimes, select seats, and book tickets seamlessly. The system is designed to simulate a real-world cinema booking experience with dynamic seat management and user authentication.

📌 Overview
-----------

MovieFlix is a DBMS-based web application that demonstrates how database design integrates with a modern full-stack system. It focuses on efficient data handling, real-time seat availability, and smooth user interaction.

The project follows a structured client-server architecture:

*   **Frontend** handles UI/UX and user interactions
    
*   **Backend** manages API logic and business rules
    
*   **Database** ensures data consistency and relationships
    

✨ Key Features
--------------

*   🎞️ Browse movies by genre
    
*   📄 View detailed movie information and showtimes
    
*   🏢 Display theater name, location, and screen number
    
*   💺 Interactive seat selection with visual layout
    
*   🔐 User authentication (Register/Login)
    
*   🎟️ Ticket booking system
    
*   📜 Booking history tracking


🛠️ Tech Stack
--------------

### Frontend

*   React (Vite)
    
*   Tailwind CSS
    

### Backend

*   Node.js
    
*   Express.js
    

### Database

*   MySQL


🧠 Concepts Demonstrated
------------------------

*   Relational database design
    
*   Data normalization and schema structuring
    
*   CRUD operations using MySQL
    
*   REST API development
    
*   Client-server architecture
    
*   State management in frontend
    
*   Seat allocation logic
    
*   Authentication and session handling
    

🚀 How to Run the Project
-------------------------

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

🔌 API Endpoints
----------------

### Authentication

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

📂 Important Files
------------------

- [server/schema.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/schema.sql)
- [server/clean_and_populate.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/clean_and_populate.sql)
- [server/add_showtimes_seats.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/add_showtimes_seats.sql)
- [server/fix_posters.sql](/c:/Users/KIIT0001/DBMS%20FINAL%20PROJECT/server/fix_posters.sql)

⚠️ Notes & Troubleshooting
--------------------------

*   If seats are not visible → restart backend and reopen the show
    
*   If showtime data is not updating → restart backend
    
*   If posters don’t load → hard refresh (Ctrl + F5)
