import express from 'express';
import { getDashboardData, updateProfile } from './user.controller.js';

const router = express.Router();

// GET /api/user/:userId/dashboard
router.get('/:userId/dashboard', getDashboardData);

// PUT /api/user/:userId/profile
router.put('/:userId/profile', updateProfile);

export default router;