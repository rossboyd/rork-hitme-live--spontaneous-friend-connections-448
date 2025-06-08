export type UrgencyLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

export interface HitRequest {
  id: string;
  senderId: string;
  receiverId: string;
  topic: string;
  urgency: UrgencyLevel;
  createdAt: number;
  expiresAt: number | null;
  status: 'pending' | 'expired' | 'completed' | 'dismissed';
}

export interface Contact extends User {
  lastSeen?: number;
  lastOnline?: number; // Timestamp when they were last in HitMeMode
}