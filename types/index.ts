// User types
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  createdAt: string;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  lastOnline?: string;
  isOnline?: boolean;
}

// Request types
export type RequestStatus = 'pending' | 'completed' | 'expired' | 'cancelled';
export type RequestUrgency = 'high' | 'medium' | 'low';

export interface HitRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: RequestStatus;
  urgency: RequestUrgency;
  duration?: number; // in minutes
  createdAt: number; // timestamp in milliseconds
  expiresAt?: number; // timestamp in milliseconds
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  border: string;
  notification: string;
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
  };
  urgency: {
    high: string;
    medium: string;
    low: string;
  };
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}