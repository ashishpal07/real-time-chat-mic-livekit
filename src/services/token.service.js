import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = async (identity, roomName) => {  
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity,
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  const token = await at.toJwt();
  
  return token;
};

export { generateToken };
