import { useState, useRef, useEffect } from 'react';
import { useChat } from "../../context/ChatContext";
import { Avatar } from "./Avatar";

const ChatPanel = ({ className = '', compact = false }) => {
  const { messages, isTyping, sendMessage, createSupportTicket } = useChat();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateTicket = () => {
    if (inputText.trim()) {
      createSupportTicket(inputText.trim());
      sendMessage(`Created support ticket: "${inputText.trim()}"`);
      setInputText('');
    }
  };

  return (
    <div className={`bg-zinc-900/50 border border-white/8 rounded-3xl flex flex-col ${compact ? 'h-96' : 'h-full max-h-96'} ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-emerald-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">IT Support</p>
            <p className="text-xs text-zinc-500">Ask me anything</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-500 mb-2">Welcome to IT Support!</p>
            <p className="text-xs text-zinc-600">Ask about technical issues or create support tickets.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-emerald-400">
                  <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                </svg>
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${
              message.sender === 'user'
                ? 'bg-emerald-500 text-zinc-950'
                : 'bg-zinc-800 text-zinc-200'
            }`}>
              <p className="text-sm">{message.text}</p>
              {message.suggestions && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="block w-full text-left text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.sender === 'user' && (
              <Avatar name="You" size="sm" />
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-emerald-400">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
            </div>
            <div className="bg-zinc-800 px-3 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleCreateTicket}
            disabled={!inputText.trim()}
            className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-300 rounded-xl transition-colors"
          >
            Create Ticket
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for help or describe your issue..."
            className="flex-1 px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 text-zinc-950 rounded-xl font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;