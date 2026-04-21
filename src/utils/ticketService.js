const TICKETS_KEY = 'nexus_tickets';

export const createTicket = (ticketData) => {
  const tickets = getTickets();
  const newTicket = {
    id: Date.now().toString(),
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority || 'Medium',
    category: ticketData.category || 'Technical',
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: ticketData.assignee || 'Support Team',
  };
  tickets.push(newTicket);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  return newTicket;
};

export const getTickets = () => {
  try {
    const tickets = localStorage.getItem(TICKETS_KEY);
    return tickets ? JSON.parse(tickets) : [];
  } catch {
    return [];
  }
};

export const updateTicket = (id, updates) => {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === id);
  if (index !== -1) {
    tickets[index] = { ...tickets[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    return tickets[index];
  }
  return null;
};

export const deleteTicket = (id) => {
  const tickets = getTickets();
  const filtered = tickets.filter(t => t.id !== id);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(filtered));
  return true;
};

export const getTicketById = (id) => {
  const tickets = getTickets();
  return tickets.find(t => t.id === id) || null;
};