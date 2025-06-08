import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HitRequest, Contact, User } from '@/types';
import { mockContacts } from '@/mocks/contacts';
import { mockRequests } from '@/mocks/requests';

interface AppState {
  user: User | null;
  contacts: Contact[];
  outboundRequests: HitRequest[];
  inboundRequests: HitRequest[];
  isHitMeModeActive: boolean;
  hitMeDuration: number; // in minutes
  hitMeEndTime: number | null; // timestamp when HitMeMode will end
  pendingNotifications: string[]; // IDs of requests that need to be notified
  dismissedRequests: string[]; // IDs of requests dismissed during current HitMeMode session
  
  // Actions
  setUser: (user: User) => void;
  addContact: (contact: Contact) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  deleteContact: (contactId: string) => void;
  addOutboundRequest: (request: Omit<HitRequest, 'id' | 'createdAt' | 'status'>) => void;
  deleteOutboundRequest: (requestId: string) => void;
  updateOutboundRequest: (requestId: string, updates: Partial<HitRequest>) => void;
  updateRequestStatus: (requestId: string, status: HitRequest['status']) => void;
  toggleHitMeMode: () => void;
  dismissRequest: (requestId: string) => void;
  expireRequests: () => void;
  setHitMeDuration: (minutes: number) => void;
  setHitMeEndTime: (timestamp: number | null) => void;
  setPendingNotifications: (requestIds: string[]) => void;
  addToDismissedRequests: (requestId: string) => void;
  clearDismissedRequests: () => void;
  updateContactLastOnline: (contactId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'user-1',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        phone: '+1234567890',
      },
      contacts: mockContacts,
      outboundRequests: [], // Starting with empty outbound requests as requested
      inboundRequests: mockRequests.filter(r => r.receiverId === 'user-1'),
      isHitMeModeActive: false,
      hitMeDuration: 30, // Default 30 minutes
      hitMeEndTime: null,
      pendingNotifications: [],
      dismissedRequests: [],
      
      setUser: (user) => set({ user }),
      
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
        // Also remove any requests associated with this contact
        outboundRequests: state.outboundRequests.filter(
          req => req.receiverId !== contactId
        ),
        inboundRequests: state.inboundRequests.filter(
          req => req.senderId !== contactId
        )
      })),
      
      addOutboundRequest: (request) => set((state) => {
        const newRequest: HitRequest = {
          id: `request-${Date.now()}`,
          createdAt: Date.now(),
          status: 'pending',
          ...request,
        };
        
        return {
          outboundRequests: [...state.outboundRequests, newRequest]
        };
      }),
      
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
      
      toggleHitMeMode: () => set((state) => {
        // If turning on HitMeMode, update the lastOnline timestamp for the current user
        if (!state.isHitMeModeActive) {
          // In a real app, this would update on the server too
          console.log("User went online, updating lastOnline timestamp");
        }
        
        return {
          isHitMeModeActive: !state.isHitMeModeActive
        };
      }),
      
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
      
      updateContactLastOnline: (contactId) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, lastOnline: Date.now() } 
            : contact
        )
      })),
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