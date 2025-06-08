import { HitRequest, RequestStatus, RequestUrgency } from '@/types';

// Helper to create timestamps
const now = Date.now();
const minutesAgo = (minutes: number) => now - minutes * 60 * 1000;
const minutesFromNow = (minutes: number) => now + minutes * 60 * 1000;

export const mockRequests: HitRequest[] = [
  {
    id: 'request-1',
    senderId: 'user-1',
    receiverId: 'contact-1',
    message: "Hey, let's catch up when you're free!",
    status: 'pending' as RequestStatus,
    urgency: 'medium' as RequestUrgency,
    duration: 60,
    createdAt: minutesAgo(30),
    expiresAt: minutesFromNow(120),
  },
  {
    id: 'request-2',
    senderId: 'contact-2',
    receiverId: 'user-1',
    message: "I need to discuss something important with you.",
    status: 'pending' as RequestStatus,
    urgency: 'high' as RequestUrgency,
    duration: 30,
    createdAt: minutesAgo(15),
    expiresAt: minutesFromNow(60),
  },
  {
    id: 'request-3',
    senderId: 'user-1',
    receiverId: 'contact-3',
    message: "Just checking in. No rush.",
    status: 'expired' as RequestStatus,
    urgency: 'low' as RequestUrgency,
    duration: 15,
    createdAt: minutesAgo(180),
    expiresAt: minutesAgo(30),
  },
  {
    id: 'request-4',
    senderId: 'contact-4',
    receiverId: 'user-1',
    message: "Need your input on a project.",
    status: 'completed' as RequestStatus,
    urgency: 'medium' as RequestUrgency,
    duration: 45,
    createdAt: minutesAgo(240),
    expiresAt: minutesAgo(120),
  },
  {
    id: 'request-5',
    senderId: 'user-1',
    receiverId: 'contact-5',
    message: "Urgent: Need to discuss the presentation.",
    status: 'pending' as RequestStatus,
    urgency: 'high' as RequestUrgency,
    duration: 20,
    createdAt: minutesAgo(10),
    expiresAt: minutesFromNow(180),
  },
];