import { useState } from 'react';
import { bookingsApi } from '../utils/api';

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

export default function BookingModal({ seat, seatData, date, onClose, onSuccess }) {
  const [form, setForm] = useState({
    user_name: '',
    user_phone: '',
    user_email: '',
    start_time: '08:00',
    end_time: '10:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pricePerHour = seatData?.price_per_hour || (seat <= 58 ? 50 : 30);
  const section = seatData?.section || (seat <= 58 ? 'AC' : 'NON_AC');

  const [sh, sm] = form.start_time.split(':').map(Number);
  const [eh, em] = form.end_time.split(':').map(Number);
  const durationHours = (eh * 60 + em - (sh * 60 + sm)) / 60;
  const amount = durationHours > 0 ? (durationHours * pricePerHour).toFixed(2) : 0;

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (durationHours <= 0) {
      setError('End time must be after start time');
      return;
    }
    if (form.user_phone.length < 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await bookingsApi.create({
        seat_id: seatData?.id,
        booking_date: date,
        start_time: form.start_time,
        end_time: form.end_time,
        user_name: form.user_name,
        user_phone: form.user_phone,
        user_email: form.user_email || undefined,
      });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-5 rounded-t-2xl text-white ${section === 'AC' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Seat {seat}</h2>
              <p className="text-sm opacity-90">{section === 'AC' ? '❄️ A/C Section' : '🌿 Non-A/C Section'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Date display */}
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 flex items-center gap-2">
            <span>📅</span>
            <span className="font-medium">{new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Time slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Start Time</label>
              <select
                value={form.start_time}
                onChange={set('start_time')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {TIME_SLOTS.slice(0, -1).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">End Time</label>
              <select
                value={form.end_time}
                onChange={set('end_time')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {TIME_SLOTS.slice(1).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          {durationHours > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {durationHours}h × ₹{pricePerHour}/hr
              </div>
              <div className="text-lg font-bold text-amber-700">₹{amount}</div>
            </div>
          )}

          {/* User details */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.user_name}
                onChange={set('user_name')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                maxLength={10}
                value={form.user_phone}
                onChange={set('user_phone')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Email (optional)</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.user_email}
                onChange={set('user_email')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || durationHours <= 0}
              className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {loading ? 'Processing…' : `Proceed to Pay ₹${amount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
