const {
  verifyAccessToken,
} = require('../utils/token.util');
const User = require('../models/User');

/**
 * Protect routes — verify JWT access token from Authorization header.
 * Attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, no token provided',
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from DB (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User belonging to this token no longer exists',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Contact admin.',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
    });
  }
};

module.exports = { protect };
