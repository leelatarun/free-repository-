const db = require('../models/db');

async function getDashboard(req, res, next) {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [totalSeats, todayBookings, revenue, occupancy] = await Promise.all([
      db.query('SELECT COUNT(*) FROM seats WHERE is_active = TRUE'),
      db.query(
        `SELECT COUNT(*) FROM bookings WHERE booking_date = $1 AND status = 'ACTIVE'`,
        [today]
      ),
      db.query(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM bookings WHERE payment_status = 'PAID'`
      ),
      db.query(
        `SELECT
          s.section,
          COUNT(DISTINCT b.seat_id) AS booked,
          COUNT(DISTINCT s.id) AS total
         FROM seats s
         LEFT JOIN bookings b ON b.seat_id = s.id AND b.booking_date = $1 AND b.status = 'ACTIVE'
         WHERE s.is_active = TRUE
         GROUP BY s.section`,
        [today]
      ),
    ]);

    res.json({
      totalSeats: parseInt(totalSeats.rows[0].count),
      todayBookings: parseInt(todayBookings.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].total),
      occupancy: occupancy.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllBookings(req, res, next) {
  try {
    const { date, status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (date) {
      params.push(date);
      conditions.push(`b.booking_date = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`b.status = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);
    const result = await db.query(
      `SELECT b.*, s.seat_number, s.section
       FROM bookings b JOIN seats s ON b.seat_id = s.id
       ${where}
       ORDER BY b.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM bookings b ${where}`,
      params.slice(0, -2)
    );

    res.json({
      bookings: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, payment_status, payment_reference } = req.body;

    const updates = [];
    const params = [];

    if (status) {
      params.push(status);
      updates.push(`status = $${params.length}`);
    }
    if (payment_status) {
      params.push(payment_status);
      updates.push(`payment_status = $${params.length}`);
    }
    if (payment_reference) {
      params.push(payment_reference);
      updates.push(`payment_reference = $${params.length}`);
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const result = await db.query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateSeatPricing(req, res, next) {
  try {
    const { section, price_per_hour, seat_ids } = req.body;

    let result;
    if (seat_ids && seat_ids.length > 0) {
      result = await db.query(
        `UPDATE seats SET price_per_hour = $1
         WHERE id = ANY($2::int[])
         RETURNING id, seat_number, section, price_per_hour`,
        [price_per_hour, seat_ids]
      );
    } else if (section) {
      result = await db.query(
        `UPDATE seats SET price_per_hour = $1
         WHERE section = $2
         RETURNING id, seat_number, section, price_per_hour`,
        [price_per_hour, section]
      );
    } else {
      return res.status(400).json({ error: 'Provide section or seat_ids' });
    }

    res.json({ updated: result.rows.length, seats: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getAllSeatsAdmin(req, res, next) {
  try {
    const result = await db.query(
      `SELECT s.*,
        (SELECT COUNT(*) FROM bookings b WHERE b.seat_id = s.id AND b.booking_date = CURRENT_DATE AND b.status = 'ACTIVE') AS today_bookings
       FROM seats s ORDER BY s.seat_number`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  getAllBookings,
  updateBookingStatus,
  updateSeatPricing,
  getAllSeatsAdmin,
};
