// backend/src/modules/messages/messages.routes.js
import express from 'express';
import { getInbox, getChatHistory, sendMessage, markAsRead } from './messages.controller.js';

const router = express.Router();

router.get('/inbox/:userId', getInbox);
router.get('/history', getChatHistory);
router.post('/send', sendMessage);
router.put('/read', markAsRead);

export default router;