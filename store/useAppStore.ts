// Split into smaller stores for better performance and maintainability
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HitRequest, Contact, User, Mode, RequestStatus } from '@/types';
import { mockContacts } from '@/mocks/contacts';
import { mockRequests } from '@/mocks/requests';

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
  updateContactModes: (contactId: string, modes: Mode[]) => void;
  toggleContactMode: (contactId: string, mode: Mode) => void;
}

interface RequestsSlice {
  outboundRequests: HitRequest[];
  inboundRequests: HitRequest[];
  addOutboundRequest: (request: Omit<HitRequest, 'id' | 'createdAt' | 'status'>) => void;
  deleteOutboundRequest: (requestId: string) => void;
  updateOutboundRequest: (requestId: string, updates: Partial<HitRequest>) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
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

interface OnboardingSlice {
  isFirstLaunch: boolean;
  hasCompletedOnboarding: boolean;
  setIsFirstLaunch: (value: boolean) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  resetOnboarding: () => void;
}

interface DebugSlice {
  resetToMockData: () => void;
  loadMockData: () => void;
}

// Combine all slices into one interface
type AppState = UserSlice & ContactsSlice & RequestsSlice & HitMeModeSlice & OnboardingSlice & DebugSlice;

// Create the store with proper typing
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User slice
      user: null,
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
      updateContactModes: (contactId, modes) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, modes } 
            : contact
        )
      })),
      toggleContactMode: (contactId, mode) => set((state) => {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return state;
        
        const currentModes = contact.modes || [];
        const updatedModes = currentModes.includes(mode)
          ? currentModes.filter(m => m !== mode)
          : [...currentModes, mode];
        
        return {
          contacts: state.contacts.map(c => 
            c.id === contactId 
              ? { ...c, modes: updatedModes } 
              : c
          )
        };
      }),

      // Requests slice
      outboundRequests: [],
      inboundRequests: [],
      addOutboundRequest: (request) => set((state) => ({
        outboundRequests: [...state.outboundRequests, {
          id: `request-${Date.now()}`,
          createdAt: Date.now(),
          status: 'pending' as RequestStatus,
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
          req.id === requestId ? { ...req, status: 'dismissed' as RequestStatus } : req
        )
      })),
      expireRequests: () => set((state) => {
        const now = Date.now();
        return {
          outboundRequests: state.outboundRequests.map(req => 
            req.expiresAt && req.expiresAt < now && req.status === 'pending'
              ? { ...req, status: 'expired' as RequestStatus }
              : req
          ),
          inboundRequests: state.inboundRequests.map(req => 
            req.expiresAt && req.expiresAt < now && req.status === 'pending'
              ? { ...req, status: 'expired' as RequestStatus }
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

      // Onboarding slice
      isFirstLaunch: true,
      hasCompletedOnboarding: false,
      setIsFirstLaunch: (value) => set({
        isFirstLaunch: value
      }),
      setHasCompletedOnboarding: (value) => set({
        hasCompletedOnboarding: value
      }),
      resetOnboarding: () => set({
        hasCompletedOnboarding: false,
        isFirstLaunch: true
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
        hasCompletedOnboarding: false,
        isFirstLaunch: true,
        currentMode: null,
        user: null
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
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        isFirstLaunch: state.isFirstLaunch,
        currentMode: state.currentMode,
      }),
    }
  )
);