const socket = io('http://localhost:3000');

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');

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

const toggleMicButton = document.getElementById('toggleMic');
let audioTrack;

toggleMicButton.addEventListener('click', async () => {
  if (!audioTrack) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioTrack = stream.getAudioTracks()[0];
    const roomToken = prompt('Enter Room Token');
    const room = await LiveKit.connect('ws://localhost:7880', roomToken);
    room.localParticipant.publishTrack(audioTrack);
    toggleMicButton.textContent = 'Mic ON';
  } else {
    audioTrack.stop();
    audioTrack = null;
    toggleMicButton.textContent = 'Mic OFF';
  }
});
