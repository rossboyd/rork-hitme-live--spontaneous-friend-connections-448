import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HitRequest, Contact, User } from '@/types';

interface AppState {
  user: User | null;
  contacts: Contact[];
  outboundRequests: HitRequest[];
  inboundRequests: HitRequest[];
  hitMeDuration: number;
  hitMeEndTime: number | null;
  isHitMeModeActive: boolean;
  pendingNotifications: string[];
  dismissedRequests: string[];
  hasCompletedOnboarding: boolean;
  // Actions
  setUser: (user: User) => void;
  addContact: (contact: Contact) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  deleteContact: (contactId: string) => void;
  updateContactLastOnline: (contactId: string) => void;
  addOutboundRequest: (request: Omit<HitRequest, 'id' | 'createdAt' | 'status'>) => void;
  deleteOutboundRequest: (requestId: string) => void;
  updateOutboundRequest: (requestId: string, updates: Partial<HitRequest>) => void;
  updateRequestStatus: (requestId: string, status: HitRequest['status']) => void;
  dismissRequest: (requestId: string) => void;
  expireRequests: () => void;
  toggleHitMeMode: () => void;
  setHitMeDuration: (minutes: number) => void;
  setHitMeEndTime: (timestamp: number | null) => void;
  setPendingNotifications: (requestIds: string[]) => void;
  addToDismissedRequests: (requestId: string) => void;
  clearDismissedRequests: () => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      contacts: [],
      outboundRequests: [],
      inboundRequests: [],
      hitMeDuration: 30,
      hitMeEndTime: null,
      isHitMeModeActive: false,
      pendingNotifications: [],
      dismissedRequests: [],
      hasCompletedOnboarding: false,
      
      // Actions implementation...
      setUser: (user) => set({ user }),
      addContact: (contact) => set((state) => ({
        contacts: [...state.contacts, contact]
      })),
      // Rest of the actions...
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
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
      }),
    }
  )
);