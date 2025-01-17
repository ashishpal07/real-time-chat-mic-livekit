import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/db.js';

dbConnect();
dotenv.config();

import authRoutes from './routes/user.routes.js';
import chatRoutes from './routes/room.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

export default app;
