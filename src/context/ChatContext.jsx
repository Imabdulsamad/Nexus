import { createContext, useContext, useState, useEffect } from 'react';
import { getAISupportResponse, generateTicketFromQuery } from '../utils/aiAssistant';
import { createTicket, getTickets } from '../utils/ticketService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async (text) => {
    const userMessage = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    addMessage(userMessage);

    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      const response = getAISupportResponse(text);
      const aiMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'ai',
        timestamp: new Date(),
        type: response.type,
        suggestions: response.suggestions
      };
      addMessage(aiMessage);
      setIsTyping(false);
    }, 1000);
  };

  const createSupportTicket = (query, category = 'Technical') => {
    const ticketData = generateTicketFromQuery(query, category);
    const ticket = createTicket(ticketData);
    setTickets(prev => [...prev, ticket]);
    return ticket;
  };

  const refreshTickets = () => {
    setTickets(getTickets());
  };

  const value = {
    messages,
    isTyping,
    tickets,
    sendMessage,
    createSupportTicket,
    refreshTickets,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};