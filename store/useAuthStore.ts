import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  phoneNumber: string;
  verificationId: string;
  user: User | null;
  
  // Auth actions
  setPhoneNumber: (phone: string) => void;
  setVerificationId: (id: string) => void;
  verifyOTP: (otp: string) => Promise<boolean>;
  completeProfile: (userData: Partial<User>) => void;
  completeOnboarding: () => void;
  logout: () => void;
  
  // Mock functions for demo
  mockSendOTP: () => Promise<string>;
  mockVerifyOTP: (otp: string, verificationId: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isOnboarded: false,
      phoneNumber: '',
      verificationId: '',
      user: null,
      
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      
      setVerificationId: (id) => set({ verificationId: id }),
      
      verifyOTP: async (otp) => {
        try {
          // In a real app, this would call a Firebase or other auth service
          const success = await get().mockVerifyOTP(otp, get().verificationId);
          
          if (success) {
            set({ isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('OTP verification failed:', error);
          return false;
        }
      },
      
      completeProfile: (userData) => {
        const { phoneNumber } = get();
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.name || 'User',
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
          phone: phoneNumber,
        };
        
        set({ user: newUser });
      },
      
      completeOnboarding: () => set({ isOnboarded: true }),
      
      logout: () => set({ 
        isAuthenticated: false,
        user: null,
      }),
      
      // Mock functions for demo purposes
      mockSendOTP: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a random verification ID
        const verificationId = `v-${Math.random().toString(36).substring(2, 10)}`;
        
        // In a real app, this would send an SMS via Firebase or another service
        console.log('Sending OTP to', get().phoneNumber);
        
        return verificationId;
      },
      
      mockVerifyOTP: async (otp, verificationId) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, any 4-digit code works
        const isValid = otp.length === 4 && verificationId.startsWith('v-');
        
        return isValid;
      },
    }),
    {
      name: 'hit-me-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        user: state.user,
      }),
    }
  )
);