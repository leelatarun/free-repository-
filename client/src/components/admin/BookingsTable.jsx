import { useState } from 'react';
import { adminApi } from '../../utils/api';

const STATUS_BADGE = {
  ACTIVE: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  COMPLETED: 'bg-green-100 text-green-700',
};

const PAYMENT_BADGE = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-red-100 text-red-600',
};

export default function BookingsTable({ bookings, onRefresh }) {
  const [updating, setUpdating] = useState(null);

  async function updateStatus(id, status) {
    setUpdating(id);
    try {
      await adminApi.updateBooking(id, { status });
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    } finally {
      setUpdating(null);
    }
  }

  async function markPaid(id) {
    const ref = prompt('Enter payment reference / UTR:');
    if (!ref) return;
    setUpdating(id);
    try {
      await adminApi.updateBooking(id, { payment_status: 'PAID', payment_reference: ref });
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    } finally {
      setUpdating(null);
    }
  }

  if (!bookings.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl mb-3">📋</div>
        <p>No bookings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 px-4 text-gray-500 font-medium">ID</th>
            <th className="py-3 px-4 text-gray-500 font-medium">Seat</th>
            <th className="py-3 px-4 text-gray-500 font-medium">Customer</th>
            <th className="py-3 px-4 text-gray-500 font-medium">Date & Time</th>
            <th className="py-3 px-4 text-gray-500 font-medium">Amount</th>
            <th className="py-3 px-4 text-gray-500 font-medium">Payment</th>
            <th className="py-3 px-4 text-gray-500 font-medium">Status</th>
            <th className="py-3 px-4 text-gray-500 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-mono text-gray-500">#{b.id}</td>
              <td className="py-3 px-4">
                <span className={`font-semibold ${b.section === 'AC' ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {b.seat_number}
                </span>
                <span className="text-xs text-gray-400 ml-1">{b.section}</span>
              </td>
              <td className="py-3 px-4">
                <p className="font-medium text-gray-800">{b.user_name}</p>
                <p className="text-xs text-gray-400">{b.user_phone}</p>
              </td>
              <td className="py-3 px-4">
                <p>{new Date(b.booking_date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                <p className="text-xs text-gray-400">{b.start_time} – {b.end_time}</p>
              </td>
              <td className="py-3 px-4 font-semibold">₹{b.amount}</td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${PAYMENT_BADGE[b.payment_status]}`}>
                  {b.payment_status}
                </span>
                {b.payment_reference && (
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{b.payment_reference.slice(0, 12)}…</p>
                )}
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_BADGE[b.status]}`}>
                  {b.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1 flex-wrap">
                  {b.payment_status === 'PENDING' && (
                    <button
                      onClick={() => markPaid(b.id)}
                      disabled={updating === b.id}
                      className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded-lg transition-colors"
                    >
                      Mark Paid
                    </button>
                  )}
                  {b.status === 'ACTIVE' && (
                    <button
                      onClick={() => updateStatus(b.id, 'CANCELLED')}
                      disabled={updating === b.id}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {b.status === 'ACTIVE' && (
                    <button
                      onClick={() => updateStatus(b.id, 'COMPLETED')}
                      disabled={updating === b.id}
                      className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-1 rounded-lg transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
