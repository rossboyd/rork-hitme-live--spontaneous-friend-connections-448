import { HitRequest } from '@/types';

// Current timestamp
const now = Date.now();

// Helper to create timestamps
const minutesAgo = (minutes: number) => now - minutes * 60 * 1000;
const minutesFromNow = (minutes: number) => now + minutes * 60 * 1000;

export const mockRequests: HitRequest[] = [
  {
    id: 'request-1',
    senderId: 'user-1',
    receiverId: 'contact-1',
    message: "Hey, let me know when you're free to chat about the project",
    status: 'pending',
    urgency: 'medium',
    duration: 30,
    createdAt: minutesAgo(30),
    expiresAt: minutesFromNow(120),
  },
  {
    id: 'request-2',
    senderId: 'user-1',
    receiverId: 'contact-2',
    message: "Need to discuss the weekend plans",
    status: 'pending',
    urgency: 'high',
    duration: 15,
    createdAt: minutesAgo(60),
    expiresAt: minutesFromNow(60),
  },
  {
    id: 'request-3',
    senderId: 'contact-3',
    receiverId: 'user-1',
    message: "Can we catch up soon?",
    status: 'pending',
    urgency: 'low',
    duration: 45,
    createdAt: minutesAgo(120),
    expiresAt: minutesFromNow(180),
  },
  {
    id: 'request-4',
    senderId: 'user-1',
    receiverId: 'contact-4',
    message: "Let's talk about the presentation",
    status: 'completed',
    urgency: 'high',
    duration: 20,
    createdAt: minutesAgo(240),
    expiresAt: minutesAgo(120),
  },
  {
    id: 'request-5',
    senderId: 'contact-5',
    receiverId: 'user-1',
    message: "Need your advice on something",
    status: 'expired',
    urgency: 'medium',
    duration: 10,
    createdAt: minutesAgo(300),
    expiresAt: minutesAgo(180),
  },
  {
    id: 'request-6',
    senderId: 'user-1',
    receiverId: 'contact-6',
    message: "Quick question about the meeting tomorrow",
    status: 'cancelled',
    urgency: 'low',
    duration: 5,
    createdAt: minutesAgo(360),
    expiresAt: minutesAgo(240),
  },
];