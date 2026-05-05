const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: ['admin', 'client', 'employee'],
      default: 'client',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    roModel: {
      type: String,
      trim: true,
    },
    amcPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AMCPlan',
    },
    amcExpiry: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // 14-day free trial
    trialEndsAt: {
      type: Date,
    },
    // Password reset
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },
    // Account lockout (OWASP A07)
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    // Refresh token tracking
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: check if account is currently locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save: hash password if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method: increment login attempts and lock if threshold reached
userSchema.methods.incrementLoginAttempts = async function () {
  // If previous lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account if max attempts reached
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  return this.updateOne(updates);
};

// Method: reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Index for performance (email index is already created by `unique: true`)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
