import { apiRequest } from './client';

export interface HelpdeskTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export async function fetchHelpdeskTickets(): Promise<HelpdeskTicket[]> {
  try {
    const res = await apiRequest<{ items: HelpdeskTicket[] }>('/helpdesk/tickets');
    return res.data?.items || [];
  } catch {
    return [];
  }
}

export async function createHelpdeskTicket(subject: string, category: string, priority: string, description: string): Promise<HelpdeskTicket> {
  const res = await apiRequest<HelpdeskTicket>('/helpdesk/tickets', {
    method: 'POST',
    body: JSON.stringify({ subject, category, priority, description }),
  });
  return res.data!;
}
