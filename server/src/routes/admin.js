const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const {
  getDashboard,
  getAllBookings,
  updateBookingStatus,
  updateSeatPricing,
  getAllSeatsAdmin,
} = require('../controllers/adminController');

router.use(requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id', updateBookingStatus);
router.get('/seats', getAllSeatsAdmin);
router.patch('/seats/pricing', updateSeatPricing);

module.exports = router;
