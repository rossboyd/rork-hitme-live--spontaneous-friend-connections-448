// Update the store to handle auth state
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HitRequest, Contact, User } from '@/types';

interface AppState {
  // ... existing state ...

  // Auth state
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;

  // ... rest of the state and actions ...
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null, // Start with no user
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // ... rest of the implementation ...
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