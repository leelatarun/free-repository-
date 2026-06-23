import { useState } from 'react';
import SeatMap from '../components/SeatMap';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';
import BookingSuccess from '../components/BookingSuccess';
import { useSeats } from '../hooks/useSeats';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [date, setDate] = useState(todayStr());
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [modal, setModal] = useState(null); // 'booking' | 'payment' | 'success'
  const [bookingData, setBookingData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const { seatMap, loading, error, refetch } = useSeats(date);

  function handleSeatSelect(seatNumber) {
    setSelectedSeat(seatNumber);
    setModal('booking');
  }

  function handleBookingSuccess(data) {
    setBookingData(data);
    setModal('payment');
  }

  function handlePaymentSuccess(booking) {
    setConfirmedBooking(booking);
    setModal('success');
    refetch();
  }

  function handleClose() {
    setModal(null);
    setSelectedSeat(null);
    setBookingData(null);
  }

  function handleSuccessClose() {
    setModal(null);
    setSelectedSeat(null);
    setBookingData(null);
    setConfirmedBooking(null);
  }

  const totalSeats = 96;
  const bookedCount = Object.values(seatMap).filter((s) => s.bookings?.length > 0).length;
  const availableCount = totalSeats - bookedCount;
  const acBooked = Object.values(seatMap).filter((s) => s.section === 'AC' && s.bookings?.length > 0).length;
  const nonAcBooked = Object.values(seatMap).filter((s) => s.section === 'NON_AC' && s.bookings?.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-1">Book Your Study Seat</h1>
          <p className="text-blue-100 text-sm mb-6">Choose a seat, pick your time, pay via UPI.</p>

          {/* Date picker */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-blue-100">Select Date:</label>
            <input
              type="date"
              value={date}
              min={todayStr()}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSeat(null);
              }}
              className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Occupancy Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{availableCount}</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{bookedCount}</p>
              <p className="text-xs text-gray-500">Booked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{58 - acBooked}</p>
              <p className="text-xs text-gray-500">A/C Free</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{38 - nonAcBooked}</p>
              <p className="text-xs text-gray-500">Non-A/C Free</p>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="flex-1 min-w-[160px]">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Occupancy</span>
              <span>{Math.round((bookedCount / totalSeats) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(bookedCount / totalSeats) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Seat Map */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SeatMap
          seatMap={seatMap}
          selectedSeat={selectedSeat}
          onSelect={handleSeatSelect}
          loading={loading}
        />
      </div>

      {/* Modals */}
      {modal === 'booking' && selectedSeat && (
        <BookingModal
          seat={selectedSeat}
          seatData={seatMap[selectedSeat]}
          date={date}
          onClose={handleClose}
          onSuccess={handleBookingSuccess}
        />
      )}

      {modal === 'payment' && bookingData && (
        <PaymentModal
          bookingData={bookingData}
          onClose={handleClose}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {modal === 'success' && confirmedBooking && (
        <BookingSuccess
          booking={confirmedBooking}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}
