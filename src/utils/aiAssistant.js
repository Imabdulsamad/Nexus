export const suggestMeetingTimes = (contacts) => {
  return contacts.slice(0, 3).map((contact, index) => ({
    id: contact.id,
    contact: contact.name,
    time: contact.availability?.[0] || `Mon ${10 + index}:00 AM`,
    note: `Great fit for ${contact.name} based on shared availability and timezone.`,
  }));
};

export const generateMeetingSummary = (transcript = []) => {
  const summary = transcript.length
    ? `The call focused on design direction, launch timing, and next steps for the product release.`
    : `This meeting focused on alignment, action planning, and a quick device check.`;

  const actionItems = [
    'Share the updated product spec with the group.',
    'Schedule follow-up for QA and handoff.',
    'Confirm browser permissions ahead of the next call.',
  ];

  return {
    transcript,
    summary,
    actionItems,
  };
};

export const getLiveCaptions = (language) => {
  const lines = [
    'Hey everyone, can you hear me clearly?',
    'Let’s walk through the project timeline.',
    'I think we should push the demo release to Thursday.',
    'Please share any blocker updates by EOD.',
  ];

  if (language === 'Spanish') {
    return lines.map((line) => ({
      original: line,
      translated: {
        'Hey everyone, can you hear me clearly?': 'Hola a todos, ¿me escuchan claramente?',
        'Let’s walk through the project timeline.': 'Repasemos la cronograma del proyecto.',
        'I think we should push the demo release to Thursday.': 'Creo que deberíamos mover el lanzamiento de la demo a jueves.',
        'Please share any blocker updates by EOD.': 'Por favor comparte actualizaciones de bloqueos antes del final del día.',
      }[line] || line,
    }));
  }

  return lines.map((line) => ({ original: line, translated: line }));
};

export const getSupportTips = (error) => {
  if (!error) return [];
  const normalized = error.toLowerCase();
  const tips = [];

  if (normalized.includes('permission') || normalized.includes('blocked')) {
    tips.push({
      title: 'Browser Permissions',
      description: 'Your camera or microphone appears blocked. Open browser settings and allow access for this site.',
    });
  }

  if (normalized.includes('device') || normalized.includes('not found')) {
    tips.push({
      title: 'Device Check',
      description: 'If your camera or mic is missing, reconnect it or select a different input in your device settings.',
    });
  }

  if (!tips.length) {
    tips.push({
      title: 'Connection Help',
      description: 'Try refreshing the page or switching browsers if the device continues to fail.',
    });
  }

  return tips;
};

export const getAISupportResponse = (query) => {
  const normalized = query.toLowerCase();
  if (normalized.includes('ticket') || normalized.includes('create') || normalized.includes('issue')) {
    return {
      type: 'ticket_suggestion',
      message: 'I can help you create a support ticket. What issue are you experiencing?',
      suggestions: ['Connection problems', 'Device not working', 'Audio/video issues', 'Other technical problem']
    };
  }
  if (normalized.includes('help') || normalized.includes('support')) {
    return {
      type: 'help',
      message: 'I\'m here to help! You can ask about technical issues, create support tickets, or get troubleshooting tips.',
      suggestions: ['Create a ticket', 'Troubleshooting guide', 'Contact support']
    };
  }
  return {
    type: 'general',
    message: 'How can I assist you today? I can help with technical support, ticket creation, or general questions.',
    suggestions: ['Technical support', 'Create ticket', 'Meeting help']
  };
};

export const generateTicketFromQuery = (query, category = 'Technical') => {
  const priority = query.toLowerCase().includes('urgent') || query.toLowerCase().includes('critical') ? 'High' : 'Medium';
  return {
    title: `Support Request: ${query.slice(0, 50)}${query.length > 50 ? '...' : ''}`,
    description: query,
    priority,
    category,
  };
};
