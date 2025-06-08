import { HitRequest } from '@/types';

export const mockRequests: HitRequest[] = [
  // Inbound requests (to user-1)
  {
    id: 'request-1',
    senderId: 'contact-1',
    receiverId: 'user-1',
    topic: 'Project update',
    urgency: 'medium',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 2, // Expires in 2 days
    status: 'pending',
  },
  {
    id: 'request-2',
    senderId: 'contact-2',
    receiverId: 'user-1',
    topic: 'Quick question about the meeting',
    urgency: 'low',
    createdAt: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 3, // Expires in 3 days
    status: 'pending',
  },
  {
    id: 'request-3',
    senderId: 'contact-3',
    receiverId: 'user-1',
    topic: 'Urgent client issue',
    urgency: 'high',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    expiresAt: Date.now() + 1000 * 60 * 60 * 12, // Expires in 12 hours
    status: 'pending',
  }
  
  // Removed all outbound requests as requested
];