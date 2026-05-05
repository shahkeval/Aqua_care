/**
 * Seed script for AMC Plans.
 * Run: node src/seeds/seedPlans.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const AMCPlan = require('../models/AMCPlan');

const plans = [
  {
    name: 'Basic',
    description: 'Essential RO maintenance for budget-conscious homes. Includes routine checkups and basic filter replacements.',
    price: 1499,
    durationMonths: 12,
    serviceFrequencyDays: 90,
    features: [
      'Quarterly service visits (4/year)',
      'Basic sediment filter replacement',
      'RO membrane checkup',
      'Free labour charges',
      'Phone support (Mon-Sat)',
    ],
    isPopular: false,
    isActive: true,
  },
  {
    name: 'Standard',
    description: 'Our most popular plan with comprehensive coverage. Ideal for families who want complete peace of mind.',
    price: 2499,
    durationMonths: 12,
    serviceFrequencyDays: 60,
    features: [
      'Bi-monthly service visits (6/year)',
      'All filter replacements included',
      'RO membrane replacement (1/year)',
      'UV lamp replacement',
      'Free labour & spare parts',
      'Priority phone & WhatsApp support',
      'Emergency visit within 24 hours',
    ],
    isPopular: true,
    isActive: true,
  },
  {
    name: 'Premium',
    description: 'The ultimate protection plan with unlimited services, premium parts, and VIP priority support.',
    price: 3999,
    durationMonths: 12,
    serviceFrequencyDays: 30,
    features: [
      'Monthly service visits (12/year)',
      'All filter & membrane replacements',
      'UV + UF lamp replacement',
      'Free labour, parts & consumables',
      'TDS meter calibration',
      'Water quality testing',
      'Dedicated technician assigned',
      'VIP 24/7 support with 4-hour response',
      'Annual deep cleaning & sanitization',
    ],
    isPopular: false,
    isActive: true,
  },
];

const seedPlans = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing plans
    await AMCPlan.deleteMany({});
    console.log('Cleared existing plans');

    // Insert seed plans
    const created = await AMCPlan.insertMany(plans);
    console.log(`Seeded ${created.length} AMC plans:`);
    created.forEach((p) => console.log(`  - ${p.name}: ₹${p.price}/year`));

    await mongoose.disconnect();
    console.log('Done. Disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedPlans();
