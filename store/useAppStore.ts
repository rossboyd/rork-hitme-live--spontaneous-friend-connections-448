import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, HitRequest } from '@/types';
import { mockContacts } from '@/mocks/contacts';
import { mockRequests } from '@/mocks/requests';

interface AppState {
  // Contacts
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Requests
  inboundRequests: HitRequest[];
  outboundRequests: HitRequest[];
  addRequest: (request: HitRequest) => void;
  updateRequest: (id: string, request: Partial<HitRequest>) => void;
  deleteRequest: (id: string) => void;
  updateRequestStatus: (id: string, status: HitRequest['status']) => void;
  expireRequests: () => void;
  deleteOutboundRequest: (id: string) => void;
  updateOutboundRequest: (id: string, updates: Partial<HitRequest>) => void;
  
  // Live Mode
  isLiveMode: boolean;
  toggleLiveMode: () => void;
  
  // Hit List (favorite contacts to notify when available)
  hitList: string[]; // Array of contact IDs
  addToHitList: (contactId: string) => void;
  removeFromHitList: (contactId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Contacts
      contacts: mockContacts,
      addContact: (contact) => 
        set((state) => ({ contacts: [...state.contacts, contact] })),
      updateContact: (id, updatedContact) => 
        set((state) => ({
          contacts: state.contacts.map((contact) => 
            contact.id === id ? { ...contact, ...updatedContact } : contact
          ),
        })),
      deleteContact: (id) => 
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),
      
      // Requests
      inboundRequests: mockRequests.filter((req) => req.receiverId === 'user-1'),
      outboundRequests: mockRequests.filter((req) => req.senderId === 'user-1'),
      addRequest: (request) => 
        set((state) => {
          if (request.senderId === 'user-1') {
            return { outboundRequests: [...state.outboundRequests, request] };
          } else {
            return { inboundRequests: [...state.inboundRequests, request] };
          }
        }),
      updateRequest: (id, updatedRequest) => 
        set((state) => ({
          inboundRequests: state.inboundRequests.map((request) => 
            request.id === id ? { ...request, ...updatedRequest } : request
          ),
          outboundRequests: state.outboundRequests.map((request) => 
            request.id === id ? { ...request, ...updatedRequest } : request
          ),
        })),
      deleteRequest: (id) => 
        set((state) => ({
          inboundRequests: state.inboundRequests.filter((request) => request.id !== id),
          outboundRequests: state.outboundRequests.filter((request) => request.id !== id),
        })),
      updateRequestStatus: (id, status) => 
        set((state) => ({
          inboundRequests: state.inboundRequests.map((request) => 
            request.id === id ? { ...request, status } : request
          ),
          outboundRequests: state.outboundRequests.map((request) => 
            request.id === id ? { ...request, status } : request
          ),
        })),
      // New function to check and expire requests
      expireRequests: () => 
        set((state) => {
          const now = Date.now();
          const updatedOutboundRequests = state.outboundRequests.map(request => {
            // If request is pending and has expired, update status
            if (request.status === 'pending' && request.expiresAt && request.expiresAt < now) {
              return { ...request, status: 'expired' };
            }
            return request;
          });
          
          const updatedInboundRequests = state.inboundRequests.map(request => {
            // If request is pending and has expired, update status
            if (request.status === 'pending' && request.expiresAt && request.expiresAt < now) {
              return { ...request, status: 'expired' };
            }
            return request;
          });
          
          return { 
            outboundRequests: updatedOutboundRequests,
            inboundRequests: updatedInboundRequests
          };
        }),
      // Alias for deleteRequest specifically for outbound requests
      deleteOutboundRequest: (id) => 
        set((state) => ({
          outboundRequests: state.outboundRequests.filter((request) => request.id !== id),
        })),
      // Alias for updateRequest specifically for outbound requests
      updateOutboundRequest: (id, updates) => 
        set((state) => ({
          outboundRequests: state.outboundRequests.map((request) => 
            request.id === id ? { ...request, ...updates } : request
          ),
        })),
      
      // Live Mode
      isLiveMode: false,
      toggleLiveMode: () => set((state) => ({ isLiveMode: !state.isLiveMode })),
      
      // Hit List
      hitList: ['contact-2', 'contact-4'], // Default with some contacts
      addToHitList: (contactId) => 
        set((state) => ({
          hitList: state.hitList.includes(contactId) 
            ? state.hitList 
            : [...state.hitList, contactId],
        })),
      removeFromHitList: (contactId) => 
        set((state) => ({
          hitList: state.hitList.filter((id) => id !== contactId),
        })),
    }),
    {
      name: 'hitme-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);