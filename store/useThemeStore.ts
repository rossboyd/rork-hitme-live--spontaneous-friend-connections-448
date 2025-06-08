import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '@/constants/colors';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  colors: typeof lightTheme;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      colors: darkTheme,
      setTheme: (theme) => set({ 
        theme, 
        colors: theme === 'light' ? lightTheme : darkTheme 
      }),
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        return { 
          theme: newTheme, 
          colors: newTheme === 'light' ? lightTheme : darkTheme 
        };
      }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);