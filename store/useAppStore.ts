// Update store to include onboarding state
interface OnboardingSlice {
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

// Add to existing store
export const useAppStore = create<
  UserSlice & ContactsSlice & RequestsSlice & HitMeModeSlice & OnboardingSlice
>()(
  persist(
    (set, get) => ({
      // ... existing store code ...

      // Add onboarding slice
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (completed) => set({ 
        hasCompletedOnboarding: completed 
      }),
    }),
    {
      name: 'hit-me-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ...state,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);