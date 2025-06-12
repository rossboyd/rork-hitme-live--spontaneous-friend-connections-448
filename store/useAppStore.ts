// Split into smaller stores for better performance and maintainability
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HitRequest, Contact, User, Mode, ModeRankings, SortOrder } from '@/types';
import { mockContacts } from '@/mocks/contacts';
import { mockRequests } from '@/mocks/requests';

// Separate interfaces for better TypeScript support
interface UserSlice {
  user: User | null;
  setUser: (user: User) => void;
}

interface ContactsSlice {
  contacts: Contact[];
  modeRankings: ModeRankings;
  contactSortOrder: SortOrder;
  addContact: (contact: Contact) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  deleteContact: (contactId: string) => void;
  updateContactLastOnline: (contactId: string) => void;
  updateContactModes: (contactId: string, modes: Mode[]) => void;
  toggleContactMode: (contactId: string, mode: Mode) => void;
  updateModeRanking: (mode: Mode, contactId: string, rank: number) => void;
  reorderContactsInMode: (mode: Mode, contactIds: string[]) => void;
  setContactSortOrder: (order: SortOrder) => void;
  initializeModeRankings: () => void;
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
  currentMode: Mode | null;
  toggleHitMeMode: () => void;
  setHitMeDuration: (minutes: number) => void;
  setHitMeEndTime: (timestamp: number | null) => void;
  setPendingNotifications: (requestIds: string[]) => void;
  addToDismissedRequests: (requestId: string) => void;
  clearDismissedRequests: () => void;
  setCurrentMode: (mode: Mode | null) => void;
}


interface DebugSlice {
  resetToMockData: () => void;
  loadMockData: () => void;
}

// Combine all slices into one interface
type AppState = UserSlice & ContactsSlice & RequestsSlice & HitMeModeSlice & DebugSlice;

// Create the store with proper typing
export const useAppStore = create<AppState>()(
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
      modeRankings: {},
      contactSortOrder: 'alphabetical',
      addContact: (contact) => set((state) => {
        const newContacts = [...state.contacts, contact];
        // Initialize rankings for this contact in all their modes
        const newRankings = { ...state.modeRankings };
        contact.modes?.forEach(mode => {
          if (!newRankings[mode]) {
            newRankings[mode] = {};
          }
          // Add to end of the list
          const existingRanks = Object.values(newRankings[mode]);
          const maxRank = existingRanks.length > 0 ? Math.max(...existingRanks) : -1;
          newRankings[mode][contact.id] = maxRank + 1;
        });
        
        return {
          contacts: newContacts,
          modeRankings: newRankings
        };
      }),
      updateContact: (contactId, updates) => set((state) => {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return state;
        
        const updatedContact = { ...contact, ...updates };
        const newContacts = state.contacts.map(c => 
          c.id === contactId ? updatedContact : c
        );
        
        // Update rankings if modes changed
        let newRankings = { ...state.modeRankings };
        if (updates.modes) {
          const oldModes = contact.modes || [];
          const newModes = updates.modes;
          
          // Remove from old modes that are no longer present
          oldModes.forEach(mode => {
            if (!newModes.includes(mode) && newRankings[mode]) {
              delete newRankings[mode][contactId];
            }
          });
          
          // Add to new modes
          newModes.forEach(mode => {
            if (!oldModes.includes(mode)) {
              if (!newRankings[mode]) {
                newRankings[mode] = {};
              }
              const existingRanks = Object.values(newRankings[mode]);
              const maxRank = existingRanks.length > 0 ? Math.max(...existingRanks) : -1;
              newRankings[mode][contactId] = maxRank + 1;
            }
          });
        }
        
        return {
          contacts: newContacts,
          modeRankings: newRankings
        };
      }),
      deleteContact: (contactId) => set((state) => {
        // Remove from rankings
        const newRankings = { ...state.modeRankings };
        Object.keys(newRankings).forEach(mode => {
          if (newRankings[mode][contactId] !== undefined) {
            delete newRankings[mode][contactId];
          }
        });
        
        return {
          contacts: state.contacts.filter(contact => contact.id !== contactId),
          outboundRequests: state.outboundRequests.filter(
            req => req.receiverId !== contactId
          ),
          inboundRequests: state.inboundRequests.filter(
            req => req.senderId !== contactId
          ),
          modeRankings: newRankings
        };
      }),
      updateContactLastOnline: (contactId) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, lastOnline: Date.now() } 
            : contact
        )
      })),
      updateContactModes: (contactId, modes) => set((state) => {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return state;
        
        const oldModes = contact.modes || [];
        let newRankings = { ...state.modeRankings };
        
        // Remove from old modes that are no longer present
        oldModes.forEach(mode => {
          if (!modes.includes(mode) && newRankings[mode]) {
            delete newRankings[mode][contactId];
          }
        });
        
        // Add to new modes
        modes.forEach(mode => {
          if (!oldModes.includes(mode)) {
            if (!newRankings[mode]) {
              newRankings[mode] = {};
            }
            const existingRanks = Object.values(newRankings[mode]);
            const maxRank = existingRanks.length > 0 ? Math.max(...existingRanks) : -1;
            newRankings[mode][contactId] = maxRank + 1;
          }
        });
        
        return {
          contacts: state.contacts.map(contact => 
            contact.id === contactId 
              ? { ...contact, modes } 
              : contact
          ),
          modeRankings: newRankings
        };
      }),
      toggleContactMode: (contactId, mode) => set((state) => {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return state;
        
        const currentModes = contact.modes || [];
        const updatedModes = currentModes.includes(mode)
          ? currentModes.filter(m => m !== mode)
          : [...currentModes, mode];
        
        let newRankings = { ...state.modeRankings };
        
        if (currentModes.includes(mode)) {
          // Removing from mode
          if (newRankings[mode]) {
            delete newRankings[mode][contactId];
          }
        } else {
          // Adding to mode
          if (!newRankings[mode]) {
            newRankings[mode] = {};
          }
          const existingRanks = Object.values(newRankings[mode]);
          const maxRank = existingRanks.length > 0 ? Math.max(...existingRanks) : -1;
          newRankings[mode][contactId] = maxRank + 1;
        }
        
        return {
          contacts: state.contacts.map(c => 
            c.id === contactId 
              ? { ...c, modes: updatedModes } 
              : c
          ),
          modeRankings: newRankings
        };
      }),
      updateModeRanking: (mode, contactId, rank) => set((state) => ({
        modeRankings: {
          ...state.modeRankings,
          [mode]: {
            ...state.modeRankings[mode],
            [contactId]: rank
          }
        }
      })),
      reorderContactsInMode: (mode, contactIds) => set((state) => {
        const newRankings = { ...state.modeRankings };
        if (!newRankings[mode]) {
          newRankings[mode] = {};
        }
        
        // Assign new rankings based on the order (0-indexed)
        contactIds.forEach((contactId, index) => {
          newRankings[mode][contactId] = index;
        });
        
        console.log(`Reordered ${mode} contacts:`, contactIds);
        console.log(`New rankings for ${mode}:`, newRankings[mode]);
        
        return {
          modeRankings: newRankings
        };
      }),
      setContactSortOrder: (order) => set({ contactSortOrder: order }),
      initializeModeRankings: () => set((state) => {
        const newRankings = { ...state.modeRankings };
        let hasChanges = false;
        
        state.contacts.forEach(contact => {
          contact.modes?.forEach(mode => {
            if (!newRankings[mode]) {
              newRankings[mode] = {};
              hasChanges = true;
            }
            if (newRankings[mode][contact.id] === undefined) {
              const existingRanks = Object.values(newRankings[mode]);
              const maxRank = existingRanks.length > 0 ? Math.max(...existingRanks) : -1;
              newRankings[mode][contact.id] = maxRank + 1;
              hasChanges = true;
            }
          });
        });
        
        if (hasChanges) {
          console.log('Initialized mode rankings:', newRankings);
          return { modeRankings: newRankings };
        }
        
        return state;
      }),

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
      currentMode: null,
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
      setCurrentMode: (mode) => set({
        currentMode: mode
      }),

      // Debug slice
      resetToMockData: () => set({
        contacts: [...mockContacts],
        outboundRequests: [],
        inboundRequests: [...mockRequests],
        isHitMeModeActive: false,
        hitMeDuration: 30,
        hitMeEndTime: null,
        pendingNotifications: [],
        dismissedRequests: [],
        currentMode: null,
        modeRankings: {},
        contactSortOrder: 'alphabetical',
        user: {
          id: 'user-1',
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
          phone: '+44987654321',
        }
      }),
      loadMockData: () => set((state) => ({
        contacts: [...mockContacts],
        inboundRequests: [...mockRequests],
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
        currentMode: state.currentMode,
        modeRankings: state.modeRankings,
        contactSortOrder: state.contactSortOrder,
      }),
    }
  )
);