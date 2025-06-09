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

export type RequestStatus = 'pending' | 'completed' | 'expired' | 'rejected' | 'dismissed';
export type RequestUrgency = 'low' | 'medium' | 'high';

export interface HitRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: RequestStatus;
  urgency: RequestUrgency;
  createdAt: number;
  expiresAt: number;
}

export interface AppState {
  user: User | null;
  contacts: Contact[];
  inboundRequests: HitRequest[];
  outboundRequests: HitRequest[];
  isHitMeModeActive: boolean;
  hitMeDuration: number; // in minutes
  hitMeEndTime: number | null;
  pendingNotifications: string[];
  dismissedRequests: string[];
  currentMode: Mode | null;
  
  // Actions
  setUser: (user: User) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  addRequest: (request: HitRequest) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  dismissRequest: (id: string) => void;
  toggleHitMeMode: () => void;
  setHitMeDuration: (minutes: number) => void;
  setHitMeEndTime: (timestamp: number | null) => void;
  expireRequests: () => void;
  setPendingNotifications: (contactIds: string[]) => void;
  addToDismissedRequests: (requestId: string) => void;
  clearDismissedRequests: () => void;
  updateContactLastOnline: (contactId: string) => void;
  setCurrentMode: (mode: Mode | null) => void;
  toggleContactFavorite: (contactId: string) => void;
}