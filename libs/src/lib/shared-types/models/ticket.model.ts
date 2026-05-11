export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Escalated';
export type TicketPriority = 'Low' | 'Normal' | 'High' | 'Critical';
export type TicketCategory = 'Payment' | 'Committee' | 'Account' | 'Technical' | 'Other';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderType: 'User' | 'Admin' | 'System';
  content: string;
  attachmentUrl?: string;
  sentAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  assignedTo?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
