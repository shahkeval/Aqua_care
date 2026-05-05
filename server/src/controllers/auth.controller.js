const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  hashResetToken,
} = require('../utils/token.util');
const { sendPasswordResetEmail } = require('../utils/email.util');

const TRIAL_DAYS = 14;

/**
 * @desc    Register a new client user (with 14-day free trial)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, roModel } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists',
      });
    }

    // Calculate trial end date
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      roModel,
      role: 'client', // Public registration is always client
      trialEndsAt,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          trialEndsAt: user.trialEndsAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Registration failed',
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password and lockout fields
    const user = await User.findOne({ email }).select(
      '+password +loginAttempts +lockUntil'
    );

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        status: 'error',
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Contact admin.',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          trialEndsAt: user.trialEndsAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Login failed',
    });
  }
};

/**
 * @desc    Refresh access token using refresh token cookie
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'No refresh token provided',
      });
    }

    // Verify token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and verify stored token matches
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token',
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    res.status(200).json({
      status: 'success',
      data: { accessToken },
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired refresh token',
    });
  }
};

/**
 * @desc    Logout user (clear refresh token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    // Clear refresh token from DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
    });
  }
};

/**
 * @desc    Send password reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration (OWASP A01)
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const { resetToken, hashedToken } = generateResetToken();

    // Store hashed token in DB with 10min expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send password reset email',
    });
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the provided token and find matching user
    const hashedToken = hashResetToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpiry');

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired password reset token',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Password reset failed',
    });
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user profile',
    });
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
