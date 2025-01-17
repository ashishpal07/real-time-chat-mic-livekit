const socket = io('http://localhost:3000');

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const toggleMicButton = document.getElementById('toggleMic');
const statusText = document.getElementById('status');

let room;
let audioTrack;
let isAudioEnabled = false;

sendMessageButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('send-message', { roomName: 'general', message });
    messageInput.value = '';
  }
});

socket.on('message', (message) => {
  const msgElement = document.createElement('div');
  msgElement.textContent = message;
  messagesDiv.appendChild(msgElement);
});

async function joinRoom() {
  const roomName = document.getElementById('room-name').value;
  const participantName = document.getElementById('participant-name').value;

  if (!roomName || !participantName) {
    alert('Room name and participant name are required.');
    return;
  }

  try {
    const response = await fetch('/api/chat/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, participantName }),
    });
    const { token } = await response.json();

    if (!token) {
      alert('Failed to fetch token.');
      return;
    }

    console.log("token fron fe = ",token);
    

    room = await LiveKit.connect('ws://localhost:7880', token, {
      audio: true,
      video: false,
    });

    document.getElementById('join-room').hidden = true;
    document.getElementById('chat-container').hidden = false;
    document.getElementById('audio-container').hidden = false;
    statusText.textContent = 'Connected to ' + roomName;

    room.on('participantConnected', (participant) => {
      console.log('Participant connected:', participant.identity);
    });

    room.on('participantDisconnected', (participant) => {
      console.log('Participant disconnected:', participant.identity);
    });
  } catch (error) {
    console.error('Error joining room:', error);
    alert('Failed to join room.');
  }
}

toggleMicButton.addEventListener('click', async () => {
  if (!audioTrack) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioTrack = stream.getAudioTracks()[0];
    room.localParticipant.publishTrack(audioTrack);
    toggleMicButton.textContent = 'Mic ON';
    statusText.textContent = 'Mic On';
  } else {
    audioTrack.stop();
    audioTrack = null;
    toggleMicButton.textContent = 'Mic OFF';
    statusText.textContent = 'Mic Off';
  }
});
