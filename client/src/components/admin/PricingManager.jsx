import { useState } from 'react';
import { adminApi } from '../../utils/api';

export default function PricingManager({ onRefresh }) {
  const [acPrice, setAcPrice] = useState('');
  const [nonAcPrice, setNonAcPrice] = useState('');
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState('');

  async function updatePrice(section, price) {
    if (!price || isNaN(price) || Number(price) <= 0) {
      setMsg('Enter a valid price');
      return;
    }
    setLoading(section);
    setMsg('');
    try {
      const res = await adminApi.updatePricing({ section, price_per_hour: Number(price) });
      setMsg(`✓ Updated ${res.data.updated} ${section} seats to ₹${price}/hr`);
      if (section === 'AC') setAcPrice('');
      else setNonAcPrice('');
      onRefresh();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading('');
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Bulk Pricing Update</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* A/C pricing */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-700 mb-3">❄️ A/C Section (Seats 1–58)</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 50"
                value={acPrice}
                onChange={(e) => setAcPrice(e.target.value)}
                className="w-full border border-blue-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
            </div>
            <button
              onClick={() => updatePrice('AC', acPrice)}
              disabled={loading === 'AC'}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {loading === 'AC' ? '…' : 'Set'}
            </button>
          </div>
          <p className="text-xs text-blue-500 mt-1.5">per hour</p>
        </div>

        {/* Non-A/C pricing */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-emerald-700 mb-3">🌿 Non-A/C Section (Seats 59–96)</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 30"
                value={nonAcPrice}
                onChange={(e) => setNonAcPrice(e.target.value)}
                className="w-full border border-emerald-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <button
              onClick={() => updatePrice('NON_AC', nonAcPrice)}
              disabled={loading === 'NON_AC'}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {loading === 'NON_AC' ? '…' : 'Set'}
            </button>
          </div>
          <p className="text-xs text-emerald-500 mt-1.5">per hour</p>
        </div>
      </div>

      {msg && (
        <div className={`text-sm px-3 py-2 rounded-lg ${msg.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </div>
      )}
    </div>
  );
}
