const router = require('express').Router();
const { login, verify } = require('../controllers/authController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/verify', requireAdmin, verify);

module.exports = router;
