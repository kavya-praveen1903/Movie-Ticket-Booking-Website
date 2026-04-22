import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (email, password, username) => API.post('/auth/register', { email, password, username }),
  login: (email, password) => API.post('/auth/login', { email, password }),
};

export const moviesAPI = {
  getAll: () => API.get('/movies'),
  getById: (id) => API.get(`/movies/${id}`),
  getShows: (movieId) => API.get(`/movies/${movieId}/shows`),
};

export const seatsAPI = {
  getByShow: (showId) => API.get(`/shows/${showId}/seats`),
};

export const bookingsAPI = {
  create: (showId, seatIds, totalPrice) =>
    API.post('/bookings', { show_id: showId, seat_ids: seatIds, total_price: totalPrice }),
  getMyBookings: () => API.get('/bookings'),
};

export default API;
