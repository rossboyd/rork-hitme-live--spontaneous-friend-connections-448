import { HitRequest } from '@/types';

export const mockRequests: HitRequest[] = [
  // Inbound requests (to user-1)
  {
    id: 'request-1',
    senderId: 'contact-1',
    receiverId: 'user-1',
    message: 'Project update',
    topic: 'Project update',
    urgency: 'medium',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 2,
    status: 'pending',
  },
  {
    id: 'request-2',
    senderId: 'contact-2',
    receiverId: 'user-1',
    message: 'Quick question about the meeting',
    topic: 'Quick question about the meeting',
    urgency: 'low',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 3,
    status: 'pending',
  },
  {
    id: 'request-3',
    senderId: 'contact-3',
    receiverId: 'user-1',
    message: 'Urgent client issue',
    topic: 'Urgent client issue',
    urgency: 'high',
    createdAt: Date.now() - 1000 * 60 * 30,
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
    status: 'pending',
  }
  
  // Removed all outbound requests as requested
];