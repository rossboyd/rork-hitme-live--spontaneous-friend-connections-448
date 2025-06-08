import { HitRequest } from '@/types';

export const mockRequests: HitRequest[] = [
  {
    id: 'request-1',
    senderId: 'user-1',
    receiverId: 'contact-1',
    message: "Hey, let's catch up when you're free!",
    status: 'pending',
    duration: 60, // 60 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(), // 22 hours from now
  },
  {
    id: 'request-2',
    senderId: 'user-1',
    receiverId: 'contact-2',
    message: "I need to discuss something important",
    status: 'pending',
    duration: 30, // 30 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.5).toISOString(), // 23.5 hours from now
  },
  {
    id: 'request-3',
    senderId: 'contact-3',
    receiverId: 'user-1',
    message: "Can we talk about the project?",
    status: 'pending',
    duration: 15, // 15 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.25).toISOString(), // 23.25 hours from now
  },
  {
    id: 'request-4',
    senderId: 'user-1',
    receiverId: 'contact-4',
    message: "Quick question about tomorrow",
    status: 'completed',
    duration: 5, // 5 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago (expired)
  },
  {
    id: 'request-5',
    senderId: 'contact-5',
    receiverId: 'user-1',
    message: "Need your advice on something",
    status: 'expired',
    duration: 20, // 20 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago (expired)
  },
  {
    id: 'request-6',
    senderId: 'user-1',
    receiverId: 'contact-6',
    message: "Let's plan for the weekend",
    status: 'cancelled',
    duration: 45, // 45 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // 12 hours from now
  },
  {
    id: 'request-7',
    senderId: 'contact-7',
    receiverId: 'user-1',
    message: "Urgent: Need to discuss the presentation",
    status: 'pending',
    duration: 30, // 30 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.8).toISOString(), // 23.8 hours from now
  },
  {
    id: 'request-8',
    senderId: 'user-1',
    receiverId: 'contact-8',
    message: "Just checking in, how are you?",
    status: 'pending',
    duration: 15, // 15 minutes
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.9).toISOString(), // 23.9 hours from now
  },
];