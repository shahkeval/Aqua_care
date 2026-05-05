const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

/**
 * Generate a JWT access token (short-lived)
 * Only store non-sensitive data in the payload
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY }
  );
};

/**
 * Generate a JWT refresh token (long-lived)
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY }
  );
};

/**
 * Verify an access token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/**
 * Verify a refresh token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

/**
 * Generate a random token for password reset
 */
const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Hash the token before storing in DB (OWASP A02)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  return { resetToken, hashedToken };
};

/**
 * Hash a reset token for comparison
 */
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateResetToken,
  hashResetToken,
};
