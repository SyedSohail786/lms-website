const express = require('express');
const router = express.Router();
const { register, login, logout, getAdmin } = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', auth(['admin']), getAdmin);

module.exports = router;