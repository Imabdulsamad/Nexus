import React from 'react';

function CallControls({
  isMuted,
  onToggleMic,
  cameraOn,
  onToggleCamera,
  isScreenSharing,
  onToggleScreenShare,
  onEndCall,
  connectionState,
}) {
  const isConnected = connectionState === 'connected';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-2 shadow-2xl">
        {/* Mute Button */}
        <button
          onClick={onToggleMic}
          disabled={!isConnected}
          className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center group relative
            ${
              isMuted
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }
            ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMuted ? (
              <>
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12m14 0a7 7 0 0 1-13.12 1.88" />
              </>
            ) : (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </>
            )}
          </svg>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
        </button>

        {/* Camera Button */}
        <button
          onClick={onToggleCamera}
          disabled={!isConnected}
          className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center group relative
            ${
              !cameraOn
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }
            ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {!cameraOn ? (
              <>
                <path d="M23 7l-7 5v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </>
            ) : (
              <>
                <path d="M23 7l-7 5v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
                <polyline points="23 13 23 4 12 9" />
              </>
            )}
          </svg>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {cameraOn ? 'Off' : 'On'}
          </span>
        </button>

        {/* Screen Share Button */}
        <button
          onClick={onToggleScreenShare}
          disabled={!isConnected}
          className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center group relative
            ${
              isScreenSharing
                ? 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }
            ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-5" />
            <rect x="5" y="9" width="14" height="9" />
            <path d="M15 5v4h4V5h-4z" />
          </svg>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isScreenSharing ? 'Stop' : 'Share'}
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10" />

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center group relative"
          title="End call"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            <line x1="3" y1="3" x2="21" y2="21" />
          </svg>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            End Call
          </span>
        </button>
      </div>

      {/* Connection Status Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-full text-xs">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              isConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="text-zinc-400">
            {connectionState === 'idle' && 'Not Connected'}
            {connectionState === 'connecting' && 'Connecting...'}
            {connectionState === 'connected' && 'Connected'}
            {connectionState === 'disconnected' && 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CallControls;
