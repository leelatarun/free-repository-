const router = require('express').Router();
const { createBooking, confirmPayment, getBookingById } = require('../controllers/bookingsController');

router.post('/', createBooking);
router.get('/:id', getBookingById);
router.patch('/:id/confirm-payment', confirmPayment);

module.exports = router;
