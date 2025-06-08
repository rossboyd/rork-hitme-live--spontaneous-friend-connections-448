import { create } from 'zustand';
import { lightTheme, darkTheme } from '@/constants/colors';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  colors: typeof lightTheme;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark', // Default to dark theme when offline
  colors: darkTheme, // Default colors
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
}));