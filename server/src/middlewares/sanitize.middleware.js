/**
 * Custom sanitization middleware compatible with Express 5.
 *
 * express-mongo-sanitize and xss-clean crash on Express 5 because
 * req.query is now a read-only getter. This middleware sanitizes
 * only req.body and req.params (the mutable inputs we control).
 */

/**
 * Recursively strip keys that start with '$' or contain '.'
 * to prevent NoSQL injection (replaces express-mongo-sanitize).
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block keys starting with '$' or containing '.'
    if (key.startsWith('$') || key.includes('.')) {
      continue; // strip the dangerous key entirely
    }
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

/**
 * Basic XSS sanitization — escape HTML entities in string values
 * (replaces xss-clean).
 */
const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const sanitizeStrings = (obj) => {
  if (obj === null || typeof obj !== 'object') return escapeHtml(obj);

  if (Array.isArray(obj)) {
    return obj.map(sanitizeStrings);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeStrings(value);
  }
  return sanitized;
};

/**
 * Combined middleware: NoSQL injection + XSS protection
 */
const sanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeStrings(sanitizeObject(req.body));
  }
  if (req.params) {
    req.params = sanitizeStrings(sanitizeObject(req.params));
  }
  next();
};

module.exports = { sanitize };
