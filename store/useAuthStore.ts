import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  phoneVerified: boolean;
  
  // Auth actions
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  
  // Phone verification
  setPhoneNumber: (phone: string) => void;
  verifyPhone: () => void;
  
  // Onboarding
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      phoneVerified: false,
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      setPhoneNumber: (phone) => set((state) => ({
        user: state.user 
          ? { ...state.user, phone } 
          : { 
              id: 'user-1', 
              name: '', 
              phone, 
              createdAt: new Date().toISOString() 
            }
      })),
      
      verifyPhone: () => set({ 
        phoneVerified: true 
      }),
      
      completeOnboarding: () => set({ 
        isOnboarded: true,
        isAuthenticated: true
      }),
    }),
    {
      name: 'hitme-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);