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

export interface HitRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: RequestStatus;
  duration?: number; // in minutes
  createdAt: string;
  expiresAt?: string;
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
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}