const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');
const { sanitize } = require('./middlewares/sanitize.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const planRoutes = require('./routes/plan.routes');

const app = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors({ origin: env.CLIENT_URL, credentials: true })); // Enable CORS
app.use(express.json({ limit: '10kb' })); // Body parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); // Parse cookies for refresh tokens
app.use(sanitize); // NoSQL injection + XSS protection (Express 5 compatible)

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
app.use('/api', apiLimiter);

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
