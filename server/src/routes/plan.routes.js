const express = require('express');
const router = express.Router();

const { getPlans, getPlanById } = require('../controllers/plan.controller');

// Public routes
router.get('/', getPlans);
router.get('/:id', getPlanById);

module.exports = router;
