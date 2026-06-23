const db = require('../models/db');

async function getAllSeats(req, res, next) {
  try {
    const { date } = req.query;

    // Get all seats with their booking status for the given date
    let query, params;
    if (date) {
      query = `
        SELECT
          s.id, s.seat_number, s.section, s.price_per_hour, s.is_active,
          COALESCE(
            json_agg(
              json_build_object(
                'id', b.id,
                'start_time', b.start_time,
                'end_time', b.end_time,
                'status', b.status,
                'payment_status', b.payment_status
              )
            ) FILTER (WHERE b.id IS NOT NULL AND b.status = 'ACTIVE' AND b.payment_status IN ('PENDING','PAID')),
            '[]'
          ) AS bookings
        FROM seats s
        LEFT JOIN bookings b ON b.seat_id = s.id AND b.booking_date = $1
        WHERE s.is_active = TRUE
        GROUP BY s.id
        ORDER BY s.seat_number
      `;
      params = [date];
    } else {
      query = `
        SELECT id, seat_number, section, price_per_hour, is_active
        FROM seats WHERE is_active = TRUE ORDER BY seat_number
      `;
      params = [];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getSeatById(req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const seatResult = await db.query(
      'SELECT * FROM seats WHERE id = $1',
      [id]
    );
    if (!seatResult.rows[0]) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    const seat = seatResult.rows[0];

    if (date) {
      const bookingsResult = await db.query(
        `SELECT id, start_time, end_time, status, payment_status
         FROM bookings
         WHERE seat_id = $1 AND booking_date = $2 AND status = 'ACTIVE' AND payment_status IN ('PENDING','PAID')
         ORDER BY start_time`,
        [id, date]
      );
      seat.bookings = bookingsResult.rows;
    }

    res.json(seat);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllSeats, getSeatById };
