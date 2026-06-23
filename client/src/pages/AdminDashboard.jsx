import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../utils/api';
import StatsCard from '../components/admin/StatsCard';
import BookingsTable from '../components/admin/BookingsTable';
import PricingManager from '../components/admin/PricingManager';

const TABS = ['Overview', 'Bookings', 'Pricing'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);

  const LIMIT = 20;

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await adminApi.dashboard();
      setStats(res.data);
    } catch (err) {
      console.error('Dashboard fetch failed', err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBookings({
        date: filterDate || undefined,
        status: filterStatus || undefined,
        page,
        limit: LIMIT,
      });
      setBookings(res.data.bookings);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Bookings fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterStatus, page]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (tab === 'Bookings') fetchBookings();
  }, [tab, fetchBookings]);

  function handleRefresh() {
    fetchDashboard();
    if (tab === 'Bookings') fetchBookings();
  }

  const occupancyAC = stats?.occupancy?.find((o) => o.section === 'AC');
  const occupancyNonAC = stats?.occupancy?.find((o) => o.section === 'NON_AC');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lucky Reading Room · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'Overview' && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatsCard
                icon="🪑"
                label="Total Seats"
                value={stats?.totalSeats ?? '—'}
                color="blue"
              />
              <StatsCard
                icon="📅"
                label="Today's Bookings"
                value={stats?.todayBookings ?? '—'}
                color="purple"
              />
              <StatsCard
                icon="💰"
                label="Total Revenue"
                value={stats ? `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}` : '—'}
                color="green"
              />
              <StatsCard
                icon="📊"
                label="Today's Occupancy"
                value={stats ? `${Math.round(((stats.todayBookings) / stats.totalSeats) * 100)}%` : '—'}
                color="amber"
              />
            </div>

            {/* Section breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'A/C Section', section: occupancyAC, total: 58, color: 'blue', icon: '❄️' },
                { label: 'Non-A/C Section', section: occupancyNonAC, total: 38, color: 'emerald', icon: '🌿' },
              ].map(({ label, section, total: sTotal, color, icon }) => {
                const booked = parseInt(section?.booked || 0);
                const pct = Math.round((booked / sTotal) * 100);
                return (
                  <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">{icon} {label}</span>
                      <span className="text-sm font-bold text-gray-800">{booked}/{sTotal}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${color === 'blue' ? 'bg-blue-400' : 'bg-emerald-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{pct}% occupied today · {sTotal - booked} available</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleRefresh}
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
            >
              ↻ Refresh stats
            </button>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'Bookings' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <button
                onClick={() => { setFilterDate(''); setFilterStatus(''); setPage(1); }}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 border border-gray-200 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={fetchBookings}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <BookingsTable bookings={bookings} onRefresh={handleRefresh} />
              )}
            </div>

            {/* Pagination */}
            {total > LIMIT && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{total} total bookings</span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    ← Prev
                  </button>
                  <span className="px-3 py-1.5">Page {page}</span>
                  <button
                    disabled={page * LIMIT >= total}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pricing Tab */}
        {tab === 'Pricing' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <PricingManager onRefresh={handleRefresh} />
          </div>
        )}
      </div>
    </div>
  );
}
