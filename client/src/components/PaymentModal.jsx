import { useState } from 'react';
import { bookingsApi } from '../utils/api';

export default function PaymentModal({ bookingData, onClose, onSuccess }) {
  const { booking, upi } = bookingData;
  const [txnRef, setTxnRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const upiLink = `upi://pay?pa=${upi.id}&pn=${encodeURIComponent(upi.name)}&am=${upi.amount}&cu=INR&tn=${encodeURIComponent(`Seat ${booking.seat_id} Booking #${booking.id}`)}`;

  function copyUpiId() {
    navigator.clipboard.writeText(upi.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleConfirm(e) {
    e.preventDefault();
    if (!txnRef.trim()) {
      setError('Enter the UPI transaction ID / UTR number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await bookingsApi.confirmPayment(booking.id, txnRef.trim());
      onSuccess(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-t-2xl text-white text-center">
          <div className="text-3xl mb-1">💳</div>
          <h2 className="text-lg font-bold">Complete Payment</h2>
          <p className="text-sm opacity-90 mt-1">Booking #{booking.id} · Seat {booking.seat_id}</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Amount */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-800 mt-1">₹{booking.amount}</p>
          </div>

          {/* UPI QR Code */}
          <div className="flex flex-col items-center gap-3 bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Scan & Pay via UPI</p>
            <img
              src="/upi-qr.png"
              alt="Scan to pay via UPI"
              className="w-48 h-48 object-contain border border-gray-200 rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback if image not found */}
            <div
              className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center text-gray-400 text-sm text-center hidden"
            >
              QR Code<br />Not Found<br /><span className="text-xs">Add upi-qr.png to /client/public/</span>
            </div>

            {/* UPI ID */}
            <div className="w-full bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">UPI ID</p>
                <p className="font-mono text-sm font-semibold text-gray-800">{upi.id}</p>
              </div>
              <button
                onClick={copyUpiId}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded-lg transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            {/* Deep link button */}
            <a
              href={upiLink}
              className="w-full text-center bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors block"
            >
              Open UPI App
            </a>
          </div>

          {/* Instructions */}
          <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>Scan QR or open UPI app above</li>
            <li>Pay <strong className="text-gray-700">₹{booking.amount}</strong> to {upi.name}</li>
            <li>Copy the <strong className="text-gray-700">UTR / Transaction ID</strong> from your UPI app</li>
            <li>Paste it below and confirm</li>
          </ol>

          {/* Transaction ref input */}
          <form onSubmit={handleConfirm} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                UTR / Transaction ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 412345678901"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {loading ? 'Confirming…' : 'Confirm Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
