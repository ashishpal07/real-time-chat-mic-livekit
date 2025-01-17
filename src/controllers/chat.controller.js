import Room from '../models/room.model.js';
import { generateToken } from '../services/token.service.js';

const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    const room = new Room({ name });
    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getToken = async (req, res) => {
  const { userId, roomName } = req.body;
  try {
    const token = generateToken(userId, roomName);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createRoom, getToken };
