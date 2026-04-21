import { useState, useRef, useEffect, useCallback } from 'react';
import { ICE_SERVERS } from '../utils/webrtcConfig';

const useWebRTC = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionState, setConnectionState] = useState('idle'); // idle | connecting | connected | disconnected
  const [error, setError] = useState(null);

  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Initialize local media stream
  const initializeLocalStream = useCallback(async () => {
    try {
      setConnectionState('connecting');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      setError(err.message);
      console.error('Failed to get local stream:', err);
      return null;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(async () => {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
      });

      // Add local tracks to peer connection
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }

      // Handle remote tracks
      peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to remote peer via signaling server
          // Example: socket.emit('ice-candidate', { candidate: event.candidate, to: remotePeerId });
          console.log('ICE Candidate:', event.candidate);
        }
      };

      // Connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        setConnectionState(peerConnection.connectionState);
      };

      peerConnectionRef.current = peerConnection;
      return peerConnection;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create peer connection:', err);
      return null;
    }
  }, [localStream]);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setCameraOn(!cameraOn);
    }
  }, [localStream, cameraOn]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false,
      });
      screenStreamRef.current = screenStream;

      // Replace video track with screen stream
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current
        .getSenders()
        .find((s) => s.track?.kind === 'video');

      if (sender) {
        await sender.replaceTrack(screenTrack);
      }

      // Handle screen share stop
      screenTrack.onended = () => {
        stopScreenShare();
      };

      setIsScreenSharing(true);
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        setError(err.message);
        console.error('Screen share failed:', err);
      }
    }
  }, []);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Switch back to camera
      if (localStream && peerConnectionRef.current) {
        const cameraTrack = localStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track?.kind === 'video');

        if (sender && cameraTrack) {
          await sender.replaceTrack(cameraTrack);
        }
      }

      setIsScreenSharing(false);
      screenStreamRef.current = null;
    } catch (err) {
      setError(err.message);
      console.error('Failed to stop screen share:', err);
    }
  }, [localStream]);

  // End call and cleanup
  const endCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    setConnectionState('idle');
    setIsMuted(false);
    setCameraOn(true);
    setIsScreenSharing(false);
  }, [localStream, remoteStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    isMuted,
    cameraOn,
    isScreenSharing,
    connectionState,
    error,
    initializeLocalStream,
    createPeerConnection,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    endCall,
    peerConnectionRef,
  };
};

export default useWebRTC;
