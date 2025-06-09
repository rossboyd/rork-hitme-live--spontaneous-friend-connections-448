export type Mode = 'work' | 'social' | 'family';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email?: string;
  lastOnline?: number;
  modes?: Mode[];
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email?: string;
}

export type RequestStatus = 'pending' | 'completed' | 'expired' | 'dismissed';
export type UrgencyLevel = 'low' | 'medium' | 'high';

export interface HitRequest {
  id: string;
  senderId: string;
  receiverId: string;
  topic: string;
  status: RequestStatus;
  urgency: UrgencyLevel;
  createdAt: number;
  expiresAt: number | null;
}