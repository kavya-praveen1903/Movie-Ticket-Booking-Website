import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seatsAPI, bookingsAPI } from '../api';
import { formatCurrency } from '../utils/movieUi';

const SEAT_PRICE = 250;
const SECTION_LABELS = [
  { name: 'Front Rows', rows: ['A', 'B', 'C'], accent: 'border-sky-400/40 text-sky-200' },
  { name: 'Center Rows', rows: ['D', 'E', 'F'], accent: 'border-amber-400/40 text-amber-200' },
  { name: 'Back Rows', rows: ['G', 'H'], accent: 'border-emerald-400/40 text-emerald-200' },
];

const getSeatRow = (seatNumber = '') => seatNumber.charAt(0);
const getSeatIndex = (seatNumber = '') => Number.parseInt(seatNumber.slice(1), 10) || 0;

export default function BookingPage() {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeats();
  }, [showId]);

  const fetchSeats = async () => {
    try {
      const response = await seatsAPI.getByShow(showId);
      setSeats(response.data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const seatsByRow = useMemo(() => {
    const groupedSeats = {};

    seats.forEach((seat) => {
      const row = getSeatRow(seat.seat_number);
      if (!groupedSeats[row]) groupedSeats[row] = [];
      groupedSeats[row].push(seat);
    });

    Object.keys(groupedSeats).forEach((row) => {
      groupedSeats[row].sort((a, b) => getSeatIndex(a.seat_number) - getSeatIndex(b.seat_number));
    });

    return groupedSeats;
  }, [seats]);

  const sortedRows = useMemo(() => Object.keys(seatsByRow).sort(), [seatsByRow]);

  const selectedSeatObjects = useMemo(
    () => seats.filter((seat) => selectedSeatIds.includes(seat.id)).sort((a, b) => a.seat_number.localeCompare(b.seat_number)),
    [seats, selectedSeatIds]
  );

  const toggleSeat = (seatId, status) => {
    if (status !== 'available') return;

    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeatIds.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    if (!localStorage.getItem('token')) {
      navigate('/auth');
      return;
    }

    setBooking(true);
    try {
      const totalPrice = selectedSeatIds.length * SEAT_PRICE;
      const response = await bookingsAPI.create(showId, selectedSeatIds, totalPrice);
      alert(`Booking successful. Booking ID: ${response.data.booking_id}`);
      navigate('/my-bookings');
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.error || error.message || 'Please try again.';
      console.error('Booking error full:', error.response || error);
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session has expired. Please log in again.');
        navigate('/auth');
        return;
      }
      alert(`Booking failed: ${msg}`);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading seats...</div>;
  if (seats.length === 0) return <div className="py-20 text-center text-[#c81d25]">No seats available for this show.</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid gap-8 xl:grid-cols-[1fr,320px]">
        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(2,6,23,0.94))] p-6 shadow-2xl sm:p-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#d85c63]">Seat Layout</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Select Your Seats</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">
              Show ID: {showId}
            </div>
          </div>

          <div className="mb-10 px-4 sm:px-10">
            <div className="cinema-screen mx-auto mb-3 max-w-3xl">Screen This Way</div>
            <p className="text-center text-xs uppercase tracking-[0.35em] text-gray-500">
              Best view from the center rows
            </p>
          </div>

          <div className="space-y-7">
            {SECTION_LABELS.filter((section) => section.rows.some((row) => seatsByRow[row])).map((section) => (
              <div key={section.name} className="rounded-3xl border border-white/10 bg-black/20 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.25em] ${section.accent}`}>
                    {section.name}
                  </div>
                  <p className="text-xs text-gray-400">
                    {section.rows.filter((row) => seatsByRow[row]).join(', ')} rows
                  </p>
                </div>

                <div className="space-y-3">
                  {section.rows.filter((row) => seatsByRow[row]).map((row) => (
                    <div key={row} className="seat-row">
                      <span className="seat-row-label">{row}</span>
                      <div className="seat-grid">
                        <div className="seat-cluster">
                          {seatsByRow[row].slice(0, Math.ceil(seatsByRow[row].length / 2)).map((seat) => (
                            <button
                              key={seat.id}
                              type="button"
                              onClick={() => toggleSeat(seat.id, seat.status)}
                              className={`seat ${
                                seat.status !== 'available'
                                  ? 'booked'
                                  : selectedSeatIds.includes(seat.id)
                                  ? 'selected'
                                  : 'available'
                              }`}
                              disabled={seat.status !== 'available'}
                              title={`${seat.seat_number} - ${seat.status}`}
                            >
                              {seat.seat_number}
                            </button>
                          ))}
                        </div>
                        <div className="seat-aisle" />
                        <div className="seat-cluster">
                          {seatsByRow[row].slice(Math.ceil(seatsByRow[row].length / 2)).map((seat) => (
                            <button
                              key={seat.id}
                              type="button"
                              onClick={() => toggleSeat(seat.id, seat.status)}
                              className={`seat ${
                                seat.status !== 'available'
                                  ? 'booked'
                                  : selectedSeatIds.includes(seat.id)
                                  ? 'selected'
                                  : 'available'
                              }`}
                              disabled={seat.status !== 'available'}
                              title={`${seat.seat_number} - ${seat.status}`}
                            >
                              {seat.seat_number}
                            </button>
                          ))}
                        </div>
                      </div>
                      <span className="seat-row-label">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 text-sm text-gray-300 sm:grid-cols-3">
            <div className="legend-chip">
              <span className="seat available pointer-events-none">A1</span>
              Available
            </div>
            <div className="legend-chip">
              <span className="seat selected pointer-events-none">B4</span>
              Selected
            </div>
            <div className="legend-chip">
              <span className="seat booked pointer-events-none">C7</span>
              Booked
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d85c63]">Booking Summary</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Your Selection</h2>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Selected Seats</p>
            <p className="mt-3 min-h-8 text-lg font-semibold text-white">
              {selectedSeatObjects.length > 0
                ? selectedSeatObjects.map((seat) => seat.seat_number).join(', ')
                : 'No seats chosen yet'}
            </p>
          </div>

          <div className="mt-5 space-y-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm">
            <div className="flex items-center justify-between text-gray-300">
              <span>Seats selected</span>
              <span className="font-semibold text-white">{selectedSeatObjects.length}</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>Price per seat</span>
              <span className="font-semibold text-white">{formatCurrency(SEAT_PRICE)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base">
              <span className="font-medium text-gray-200">Total</span>
              <span className="text-2xl font-black text-[#c81d25]">
                {formatCurrency(selectedSeatObjects.length * SEAT_PRICE)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBooking}
            disabled={booking || selectedSeatObjects.length === 0}
            className="mt-6 w-full rounded-2xl bg-[#b20710] py-3 font-bold text-white transition hover:bg-[#8f0610] disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            {booking ? 'Processing...' : 'Confirm Booking'}
          </button>

          <p className="mt-4 text-xs leading-6 text-gray-400">
            Tip: if you are not signed in, selecting confirm will take you to the auth page first.
          </p>
        </aside>
      </div>
    </div>
  );
}
