// ICE Server Configuration
export const ICE_SERVERS = [
  {
    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
  },
  {
    urls: ['stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302'],
  },
  // TURN servers (for production, use your own TURN server)
  // {
  //   urls: 'turn:your-turn-server.com',
  //   username: 'username',
  //   credential: 'password',
  // },
];

// Signaling Events (for Socket.io/Firebase integration)
export const SIGNALING_EVENTS = {
  // Peer events
  PEER_JOINED: 'peer-joined',
  PEER_LEFT: 'peer-left',
  CALL_INITIATED: 'call-initiated',
  CALL_ANSWERED: 'call-answered',
  CALL_REJECTED: 'call-rejected',
  CALL_ENDED: 'call-ended',

  // WebRTC events
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
};

// Default constraints for media devices
export const MEDIA_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

// Screen share constraints
export const SCREEN_CONSTRAINTS = {
  video: {
    cursor: 'always',
    frameRate: { ideal: 30 },
  },
  audio: false,
};
