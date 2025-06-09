// This file is no longer needed as we're using store/useAppStore.ts
// Keeping this file to avoid import errors, but it just re-exports from the store
import { useAppStore as storeAppStore } from '@/store/useAppStore';

export const useAppStore = storeAppStore;