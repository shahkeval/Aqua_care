const AMCPlan = require('../models/AMCPlan');

/**
 * @desc    Get all active AMC plans (public)
 * @route   GET /api/plans
 * @access  Public
 */
const getPlans = async (req, res) => {
  try {
    const plans = await AMCPlan.find({ isActive: true }).sort({ price: 1 });

    res.status(200).json({
      status: 'success',
      results: plans.length,
      data: { plans },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch plans',
    });
  }
};

/**
 * @desc    Get a single AMC plan by ID
 * @route   GET /api/plans/:id
 * @access  Public
 */
const getPlanById = async (req, res) => {
  try {
    const plan = await AMCPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Plan not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { plan },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch plan',
    });
  }
};

module.exports = {
  getPlans,
  getPlanById,
};
