const db = require('../models/db');

async function createBooking(req, res, next) {
  try {
    const {
      seat_id,
      booking_date,
      start_time,
      end_time,
      user_name,
      user_phone,
      user_email,
    } = req.body;

    if (!seat_id || !booking_date || !start_time || !end_time || !user_name || !user_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check seat exists and is active
    const seatResult = await db.query(
      'SELECT * FROM seats WHERE id = $1 AND is_active = TRUE',
      [seat_id]
    );
    if (!seatResult.rows[0]) {
      return res.status(404).json({ error: 'Seat not found or inactive' });
    }
    const seat = seatResult.rows[0];

    // Check for conflicting bookings
    const conflict = await db.query(
      `SELECT id FROM bookings
       WHERE seat_id = $1 AND booking_date = $2
         AND status = 'ACTIVE' AND payment_status IN ('PENDING','PAID')
         AND (start_time < $4 AND end_time > $3)`,
      [seat_id, booking_date, start_time, end_time]
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'Seat already booked for this time slot' });
    }

    // Calculate amount
    const [sh, sm] = start_time.split(':').map(Number);
    const [eh, em] = end_time.split(':').map(Number);
    const durationHours = (eh * 60 + em - (sh * 60 + sm)) / 60;
    if (durationHours <= 0) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    const amount = (durationHours * parseFloat(seat.price_per_hour)).toFixed(2);

    const result = await db.query(
      `INSERT INTO bookings
        (seat_id, booking_date, start_time, end_time, user_name, user_phone, user_email, amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [seat_id, booking_date, start_time, end_time, user_name, user_phone, user_email || null, amount]
    );

    res.status(201).json({
      booking: result.rows[0],
      upi: {
        id: process.env.UPI_ID,
        name: process.env.UPI_NAME,
        phone: process.env.UPI_PHONE,
        amount,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function confirmPayment(req, res, next) {
  try {
    const { id } = req.params;
    const { payment_reference } = req.body;

    if (!payment_reference) {
      return res.status(400).json({ error: 'Payment reference (UTR/transaction ID) required' });
    }

    const result = await db.query(
      `UPDATE bookings
       SET payment_status = 'PAID', payment_reference = $1
       WHERE id = $2 AND payment_status = 'PENDING'
       RETURNING *`,
      [payment_reference, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Booking not found or already processed' });
    }

    res.json({ booking: result.rows[0], message: 'Payment confirmed' });
  } catch (err) {
    next(err);
  }
}

async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT b.*, s.seat_number, s.section, s.price_per_hour
       FROM bookings b JOIN seats s ON b.seat_id = s.id
       WHERE b.id = $1`,
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking, confirmPayment, getBookingById };
