import { useState, useEffect, useCallback } from 'react';
import { seatsApi } from '../utils/api';

export function useSeats(date) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeats = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setError(null);
    try {
      const res = await seatsApi.getAll(date);
      setSeats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load seats');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // Build a map: seatNumber -> seat data
  const seatMap = seats.reduce((acc, s) => {
    acc[s.seat_number] = s;
    return acc;
  }, {});

  return { seats, seatMap, loading, error, refetch: fetchSeats };
}
