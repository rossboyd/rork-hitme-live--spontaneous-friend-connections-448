import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '@/constants/colors';

type ThemeMode = 'light' | 'dark';
type ThemeColor = 'green' | 'pink';

interface ThemeState {
  mode: ThemeMode;
  color: ThemeColor;
  colors: typeof themes.green.light;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      color: 'green',
      colors: themes.green.dark,
      setMode: (mode) => set((state) => ({ 
        mode,
        colors: themes[state.color][mode]
      })),
      setColor: (color) => set((state) => ({
        color,
        colors: themes[color][state.mode]
      })),
      toggleMode: () => set((state) => {
        const newMode = state.mode === 'light' ? 'dark' : 'light';
        return { 
          mode: newMode,
          colors: themes[state.color][newMode]
        };
      }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);