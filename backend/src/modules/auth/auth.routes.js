import express from 'express';
import { requestOtp, verifyOtp } from './auth.controller.js';

const router = express.Router();

// POST /api/auth/request-otp
router.post('/request-otp', requestOtp);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

export default router;