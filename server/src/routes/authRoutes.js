const express = require('express');
const router = express.Router();
const { registerCustomer, registerContractor, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register-customer', registerCustomer);
router.post('/register-contractor', registerContractor);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
