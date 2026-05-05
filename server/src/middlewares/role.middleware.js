/**
 * Role-based access control middleware factory.
 * Usage: authorize('admin', 'client')
 * Must be used AFTER the protect middleware.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = { authorize };
