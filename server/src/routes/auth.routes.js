const express = require('express');
const router = express.Router();

const {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} = require('../controllers/auth.controller');

const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/auth.validator');

// Public routes (with auth rate limiting)
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
