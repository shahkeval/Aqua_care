/**
 * Generic validation middleware using Joi schemas.
 * Validates req.body against the provided schema.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first
      stripUnknown: true, // Remove unknown fields (security)
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    // Replace body with sanitized/validated values
    req.body = value;
    next();
  };
};

module.exports = { validate };
