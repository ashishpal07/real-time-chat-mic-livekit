import express from 'express';
import { createRoom, getToken } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/create-room', createRoom);
router.post('/get-token', getToken);

export default router;
