import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Platform,
  Keyboard,
  Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/common/Button'; // Fixed import path
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';
import { AnimatedView } from '@/components/AnimatedView';

// Rest of the verify.tsx code remains the same