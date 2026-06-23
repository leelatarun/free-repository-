const router = require('express').Router();
const { getAllSeats, getSeatById } = require('../controllers/seatsController');

router.get('/', getAllSeats);
router.get('/:id', getSeatById);

module.exports = router;
