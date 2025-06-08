import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HitRequest, Contact, User } from '@/types';

// Rest of the file remains the same...