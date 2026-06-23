export default function BookingSuccess({ booking, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-5">Your seat has been successfully reserved.</p>

        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm mb-5">
          <div className="flex justify-between">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-semibold font-mono">#{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium">{booking.start_time} – {booking.end_time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-bold text-green-700">₹{booking.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">UTR</span>
            <span className="font-mono text-xs">{booking.payment_reference}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Please show this confirmation to the staff at the reading room.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
        >
          Book Another Seat
        </button>
      </div>
    </div>
  );
}
