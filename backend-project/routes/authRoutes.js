const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// PUBLIC
router.post('/login', authController.login);

// PROTECTED
router.get('/me', auth, authController.me);
router.put('/change-password', auth, authController.changePassword);

module.exports = router;