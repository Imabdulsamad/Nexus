import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from '../components/ui/Avatar';
import CallControls from '../components/ui/CallControls';
import useWebRTC from '../hooks/useWebRTC';
import { generateMeetingSummary, getLiveCaptions, getSupportTips } from '../utils/aiAssistant';
import ChatPanel from '../components/ui/ChatPanel';

function CallScreen({ contact, onBack }) {
  const webrtc = useWebRTC();
  const [showConnectingOverlay, setShowConnectingOverlay] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [meetingSummary, setMeetingSummary] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [translationLanguage, setTranslationLanguage] = useState(contact?.language === 'Spanish' ? 'Spanish' : 'English');
  const [micLevel, setMicLevel] = useState(0);
  const audioMeterRef = useRef(null);

  const transcript = [
    'Welcome everyone, let’s review the launch plan.',
    'We will ship the first prototype by midweek.',
    'Please confirm any resource gaps before Friday.',
  ];

  useEffect(() => {
    const init = async () => {
      await webrtc.initializeLocalStream();
    };

    init();
    return () => {
      webrtc.endCall();
      if (audioMeterRef.current) cancelAnimationFrame(audioMeterRef.current);
    };
  }, []);

  useEffect(() => {
    if (webrtc.connectionState === 'connected') {
      const timer = setTimeout(() => setShowConnectingOverlay(false), 600);
      return () => clearTimeout(timer);
    }
  }, [webrtc.connectionState]);

  useEffect(() => {
    if (!webrtc.localStream) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(webrtc.localStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const updateMeter = () => {
      analyser.getByteTimeDomainData(data);
      const norm = data.reduce((sum, value) => sum + Math.abs(value - 128), 0) / data.length / 128;
      setMicLevel(Math.min(1, norm));
      audioMeterRef.current = requestAnimationFrame(updateMeter);
    };

    updateMeter();
    return () => {
      cancelAnimationFrame(audioMeterRef.current);
      audioContext.close();
    };
  }, [webrtc.localStream]);

  const startCallSession = async () => {
    setCallStarted(true);
    setShowConnectingOverlay(true);
    await webrtc.createPeerConnection();
  };

  const handleEndCall = () => {
    if (!showSummary) {
      webrtc.endCall();
      const result = generateMeetingSummary(transcript);
      setMeetingSummary(result.summary);
      setActionItems(result.actionItems);
      setShowSummary(true);
      setShowConnectingOverlay(false);
      return;
    }

    onBack();
  };

  const supportTips = getSupportTips(webrtc.error);
  const captions = getLiveCaptions(translationLanguage);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col overflow-hidden" style={{ fontFamily: "'Syne', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-semibold text-white">{contact?.name || 'Unknown Caller'}</p>
            <p className="text-xs text-zinc-500">{contact?.role || 'Video meeting'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full">
          <span className={`w-2 h-2 rounded-full animate-pulse ${webrtc.connectionState === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-xs text-zinc-400">
            {webrtc.connectionState === 'idle' && 'Ready'}
            {webrtc.connectionState === 'connecting' && 'Connecting...'}
            {webrtc.connectionState === 'connected' && 'Connected'}
            {webrtc.connectionState === 'disconnected' && 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className="relative w-full h-full bg-gradient-to-b from-zinc-950 to-zinc-900">
          {callStarted && webrtc.remoteStream ? (
            <video ref={webrtc.remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col gap-5 px-6 text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 ring-2 ring-white/10 flex items-center justify-center">
                <Avatar name={contact?.name || 'Unknown'} avatarIdx={contact?.avatarIdx || 0} size="xl" />
              </div>
              <div className="max-w-xl">
                <p className="text-2xl font-semibold text-white mb-2">Meet in the green room</p>
                <p className="text-sm text-zinc-400">Check microphone, camera, and connection before joining {contact?.name || 'your call'}.</p>
              </div>
            </div>
          )}

          {!callStarted && (
            <div className="absolute inset-x-0 bottom-28 mx-auto max-w-3xl px-4">
              <div className="rounded-3xl border border-white/10 bg-zinc-950/85 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.24em] text-zinc-500 mb-2">Device check</p>
                    <h2 className="text-xl font-semibold text-white">Local preview ready</h2>
                    <p className="text-sm text-zinc-400 mt-1">Your browser is ready for the call. Confirm mic level and start when you’re set.</p>
                  </div>
                  <button onClick={startCallSession} className="self-start lg:self-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl px-5 py-3 text-sm font-semibold transition-all">
                    Start call
                  </button>
                </div>
                <div className="mt-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 mb-2">Microphone level</p>
                  <div className="h-2 rounded-full bg-zinc-900 overflow-hidden border border-white/10">
                    <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${Math.max(10, Math.round(micLevel * 100))}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {showConnectingOverlay && callStarted && webrtc.connectionState !== 'connected' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-30">
              <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950/90 p-8 text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-emerald-400/40 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-t-4 border-emerald-400 animate-spin" />
                </div>
                <p className="text-lg font-semibold text-white mb-2">Putting the call together...</p>
                <p className="text-sm text-zinc-500">Nexus is performing a quick device and network check.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="h-24 rounded-3xl bg-zinc-900/90 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {webrtc.error && (
            <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/30 rounded-3xl px-4 py-3 text-red-200 text-sm max-w-xs z-40 shadow-xl">
              {webrtc.error}
            </div>
          )}

          <div className="absolute left-4 top-24 hidden lg:block w-96 rounded-3xl border border-white/10 bg-zinc-950/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">Nexus AI assistant</p>
                <p className="text-sm font-semibold text-white">Live captions + support</p>
              </div>
              <button onClick={() => setCaptionsEnabled((active) => !active)} className="rounded-full px-3 py-1 text-xs font-semibold border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 transition-colors">
                {captionsEnabled ? 'Captions on' : 'Captions off'}
              </button>
            </div>

            <div className="space-y-3">
              {captionsEnabled ? (
                captions.map((line, index) => (
                  <div key={index} className="rounded-3xl border border-white/5 bg-zinc-900/80 p-3">
                    <p className="text-sm text-zinc-200">{line.original}</p>
                    <p className="text-xs text-zinc-500 mt-1">{line.translated}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Live captioning is paused. Re-enable to see translations and call prompts.</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['English', 'Spanish'].map((lang) => (
                <button key={lang} onClick={() => setTranslationLanguage(lang)} className={`rounded-2xl px-3 py-2 text-xs font-medium transition ${translationLanguage === lang ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-white/5'}`}>
                  {lang}
                </button>
              ))}
            </div>

            {supportTips.length > 0 && (
              <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-900/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500 mb-3">Support tips</p>
                <div className="space-y-3">
                  {supportTips.map((tip) => (
                    <div key={tip.title} className="rounded-2xl bg-zinc-950/80 p-3 border border-white/5">
                      <p className="text-sm font-semibold text-white">{tip.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <ChatPanel compact />
            </div>
          </div>

          {showSummary && (
            <div className="absolute inset-0 z-50 overflow-y-auto bg-zinc-950/95 p-6">
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">Meeting recap</p>
                      <h2 className="text-3xl font-semibold text-white">Nexus AI Summary</h2>
                    </div>
                    <button onClick={handleEndCall} className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors">
                      Finish and return
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                    <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
                      <p className="text-sm text-zinc-400 mb-3">Summary</p>
                      <p className="text-sm text-zinc-200 leading-relaxed">{meetingSummary}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
                      <p className="text-sm text-zinc-400 mb-3">Action items</p>
                      <ul className="space-y-3 list-disc list-inside text-sm text-zinc-200">
                        {actionItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500 mb-4">Transcript preview</p>
                  <div className="space-y-3">
                    {transcript.map((line, index) => (
                      <div key={index} className="rounded-3xl bg-zinc-950/70 p-4 border border-white/5 text-sm text-zinc-300">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CallControls
        isMuted={webrtc.isMuted}
        onToggleMic={webrtc.toggleMic}
        cameraOn={webrtc.cameraOn}
        onToggleCamera={webrtc.toggleCamera}
        isScreenSharing={webrtc.isScreenSharing}
        onToggleScreenShare={webrtc.isScreenSharing ? webrtc.stopScreenShare : webrtc.startScreenShare}
        onEndCall={handleEndCall}
        connectionState={webrtc.connectionState}
      />
    </div>
  );
}

export default CallScreen;
