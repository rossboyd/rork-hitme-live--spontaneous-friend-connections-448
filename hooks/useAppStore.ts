// Split into smaller stores for better performance and maintainability
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HitRequest, Contact, User } from '@/types';

// Separate interfaces for better TypeScript support
interface UserSlice {
  user: User | null;
  setUser: (user: User) => void;
}

interface ContactsSlice {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  deleteContact: (contactId: string) => void;
  updateContactLastOnline: (contactId: string) => void;
}

interface RequestsSlice {
  outboundRequests: HitRequest[];
  inboundRequests: HitRequest[];
  addOutboundRequest: (request: Omit<HitRequest, 'id' | 'createdAt' | 'status'>) => void;
  deleteOutboundRequest: (requestId: string) => void;
  updateOutboundRequest: (requestId: string, updates: Partial<HitRequest>) => void;
  updateRequestStatus: (requestId: string, status: HitRequest['status']) => void;
  dismissRequest: (requestId: string) => void;
  expireRequests: () => void;
}

interface HitMeModeSlice {
  isHitMeModeActive: boolean;
  hitMeDuration: number;
  hitMeEndTime: number | null;
  pendingNotifications: string[];
  dismissedRequests: string[];
  toggleHitMeMode: () => void;
  setHitMeDuration: (minutes: number) => void;
  setHitMeEndTime: (timestamp: number | null) => void;
  setPendingNotifications: (requestIds: string[]) => void;
  addToDismissedRequests: (requestId: string) => void;
  clearDismissedRequests: () => void;
}

// Create the store with proper typing
export const useAppStore = create<
  UserSlice & ContactsSlice & RequestsSlice & HitMeModeSlice
>()(
  persist(
    (set, get) => ({
      // User slice
      user: {
        id: 'user-1',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        phone: '+44987654321',
      },
      setUser: (user) => set({ user }),

      // Contacts slice
      contacts: [],
      addContact: (contact) => set((state) => ({
        contacts: [...state.contacts, contact]
      })),
      updateContact: (contactId, updates) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === contactId ? { ...contact, ...updates } : contact
        )
      })),
      deleteContact: (contactId) => set((state) => ({
        contacts: state.contacts.filter(contact => contact.id !== contactId),
        outboundRequests: state.outboundRequests.filter(
          req => req.receiverId !== contactId
        ),
        inboundRequests: state.inboundRequests.filter(
          req => req.senderId !== contactId
        )
      })),
      updateContactLastOnline: (contactId) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, lastOnline: Date.now() } 
            : contact
        )
      })),

      // Requests slice
      outboundRequests: [],
      inboundRequests: [],
      addOutboundRequest: (request) => set((state) => ({
        outboundRequests: [...state.outboundRequests, {
          id: `request-${Date.now()}`,
          createdAt: Date.now(),
          status: 'pending',
          ...request,
        }]
      })),
      deleteOutboundRequest: (requestId) => set((state) => ({
        outboundRequests: state.outboundRequests.filter(req => req.id !== requestId)
      })),
      updateOutboundRequest: (requestId, updates) => set((state) => ({
        outboundRequests: state.outboundRequests.map(req => 
          req.id === requestId ? { ...req, ...updates } : req
        )
      })),
      updateRequestStatus: (requestId, status) => set((state) => ({
        outboundRequests: state.outboundRequests.map(req => 
          req.id === requestId ? { ...req, status } : req
        ),
        inboundRequests: state.inboundRequests.map(req => 
          req.id === requestId ? { ...req, status } : req
        )
      })),
      dismissRequest: (requestId) => set((state) => ({
        inboundRequests: state.inboundRequests.map(req => 
          req.id === requestId ? { ...req, status: 'dismissed' } : req
        )
      })),
      expireRequests: () => set((state) => {
        const now = Date.now();
        return {
          outboundRequests: state.outboundRequests.map(req => 
            req.expiresAt && req.expiresAt < now && req.status === 'pending'
              ? { ...req, status: 'expired' }
              : req
          ),
          inboundRequests: state.inboundRequests.map(req => 
            req.expiresAt && req.expiresAt < now && req.status === 'pending'
              ? { ...req, status: 'expired' }
              : req
          )
        };
      }),

      // HitMeMode slice
      isHitMeModeActive: false,
      hitMeDuration: 30,
      hitMeEndTime: null,
      pendingNotifications: [],
      dismissedRequests: [],
      toggleHitMeMode: () => set((state) => ({
        isHitMeModeActive: !state.isHitMeModeActive
      })),
      setHitMeDuration: (minutes) => set({
        hitMeDuration: minutes
      }),
      setHitMeEndTime: (timestamp) => set({
        hitMeEndTime: timestamp
      }),
      setPendingNotifications: (requestIds) => set({
        pendingNotifications: requestIds
      }),
      addToDismissedRequests: (requestId) => set((state) => ({
        dismissedRequests: [...state.dismissedRequests, requestId]
      })),
      clearDismissedRequests: () => set({
        dismissedRequests: []
      }),
    }),
    {
      name: 'hit-me-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        contacts: state.contacts,
        outboundRequests: state.outboundRequests,
        inboundRequests: state.inboundRequests,
        hitMeDuration: state.hitMeDuration,
      }),
    }
  )
);