import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Alert, 
  Platform,
  Text
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';
import { Users } from 'lucide-react-native';
import { HitRequest } from '@/types';
import * as Haptics from 'expo-haptics';
import { DurationSelector } from '@/components/DurationSelector';
import { QueueReview } from '@/components/QueueReview';
import { SlideToLiveToggle } from '@/components/SlideToLiveToggle';
import { LiveModeStatus } from '@/components/LiveModeStatus';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  const { 
    inboundRequests, 
    contacts, 
    isHitMeModeActive, 
    toggleHitMeMode, 
    dismissRequest, 
    updateRequestStatus,
    expireRequests,
    hitMeDuration,
    setHitMeDuration,
    hitMeEndTime,
    setHitMeEndTime,
    pendingNotifications,
    setPendingNotifications,
    dismissedRequests,
    addToDismissedRequests,
    clearDismissedRequests,
    updateContactLastOnline,
    user
  } = useAppStore();
  
  const { setTheme, colors = darkTheme } = useThemeStore();
  const [pendingRequests, setPendingRequests] = useState<HitRequest[]>([]);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [showQueueReview, setShowQueueReview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Set theme based on HitMeMode status
  useEffect(() => {
    setTheme(isHitMeModeActive ? 'light' : 'dark');
  }, [isHitMeModeActive, setTheme]);

  useEffect(() => {
    // Check for expired requests on mount and every minute
    expireRequests();
    const interval = setInterval(expireRequests, 60000);
    
    return () => clearInterval(interval);
  }, [expireRequests]);

  useEffect(() => {
    // Filter and sort requests
    const pending = inboundRequests.filter(req => 
      req.status === 'pending' && !dismissedRequests.includes(req.id)
    );
    
    // Sort by urgency (high > medium > low) and then by creation date (newest first)
    const sortByUrgency = (a: HitRequest, b: HitRequest) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.createdAt - a.createdAt;
    };
    
    const sortedRequests = [...pending].sort(sortByUrgency);
    setPendingRequests(sortedRequests);
    
    // Set all pending request senders as selected by default
    setSelectedIds(sortedRequests.map(req => req.senderId));
  }, [inboundRequests, dismissedRequests]);

  // Timer countdown effect
  useEffect(() => {
    if (isHitMeModeActive && hitMeEndTime) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = hitMeEndTime - now;
        
        if (remaining <= 0) {
          setTimeRemaining(0);
          toggleHitMeMode(); // Auto turn off
          setHitMeEndTime(null);
          clearDismissedRequests();
          return;
        }
        
        setTimeRemaining(remaining);
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeRemaining(null);
    }
  }, [isHitMeModeActive, hitMeEndTime, toggleHitMeMode, setHitMeEndTime, clearDismissedRequests]);

  const handleSlideComplete = () => {
    setShowDurationSelector(true);
  };

  const handlePreviewQueue = () => {
    if (pendingRequests.length > 0) {
      setPreviewMode(true);
      setShowQueueReview(true);
    }
  };

  const handleDurationSelect = (minutes: number) => {
    setHitMeDuration(minutes);
    setShowDurationSelector(false);
    
    // Show queue review before going live
    setPreviewMode(false);
    setShowQueueReview(true);
  };

  const handleGoLive = (notifyIds: string[]) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    toggleHitMeMode();
    setShowQueueReview(false);
    
    // Set end time based on selected duration
    const endTime = Date.now() + (hitMeDuration * 60 * 1000);
    setHitMeEndTime(endTime);
    
    // Set pending notifications
    setPendingNotifications(notifyIds);
    
    // Simulate sending notifications
    if (notifyIds.length > 0) {
      setTimeout(() => {
        Alert.alert(
          "Notifications Sent",
          `${notifyIds.length} contacts have been notified that you're available.`,
          [{ text: "OK" }]
        );
        setPendingNotifications([]);
      }, 1500);
    }
    
    // Update lastOnline timestamp when going live
    if (user) {
      updateContactLastOnline(user.id);
    }
  };

  const handleGoOffline = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    toggleHitMeMode();
    setHitMeEndTime(null);
    clearDismissedRequests();
  };

  const handleConnect = (request: HitRequest) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // In a real app, this would initiate a call
    Alert.alert(
      "Connecting",
      `Connecting with ${getContactById(request.senderId).name}...`,
      [
        {
          text: "End Call",
          onPress: () => {
            updateRequestStatus(request.id, 'completed');
          }
        }
      ]
    );
  };

  const handleDismiss = (requestId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isHitMeModeActive) {
      // When in live mode, add to dismissed list instead of fully dismissing
      addToDismissedRequests(requestId);
    } else {
      // When not in live mode, fully dismiss the request
      dismissRequest(requestId);
    }
  };

  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || {
      id: contactId,
      name: "Unknown Contact",
      avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      phone: "",
    };
  };

  const renderItem = ({ item }: { item: HitRequest }) => (
    <RequestCard
      request={item}
      contact={getContactById(item.senderId)}
      onConnect={() => handleConnect(item)}
      onDismiss={() => handleDismiss(item.id)}
      isInbound={true}
    />
  );

  return (
    <>
      {/* Disable back button by setting headerBackVisible to false */}
      <Stack.Screen options={{ headerBackVisible: false }} />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.appLogo, { color: colors.primary }]}>HitMeApp</Text>
        
        {isHitMeModeActive ? (
          <>
            {timeRemaining !== null && (
              <LiveModeStatus 
                timeRemaining={timeRemaining} 
                onGoOffline={handleGoOffline} 
              />
            )}
            
            <FlatList
              data={pendingRequests}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <EmptyState
                  title="Your queue is empty"
                  message="No one is waiting to talk to you right now."
                  icon={<Users size={48} color={colors.text.light} />}
                />
              }
            />
          </>
        ) : (
          <View style={styles.fixedContainer}>
            <SlideToLiveToggle 
              waitingCount={pendingRequests.length}
              onSlideComplete={handleSlideComplete}
              userName={user?.name.split(' ')[0]}
              onPreviewQueue={handlePreviewQueue}
            />
          </View>
        )}
        
        <DurationSelector
          visible={showDurationSelector}
          onClose={() => setShowDurationSelector(false)}
          onSelect={handleDurationSelect}
        />
        
        <QueueReview
          visible={showQueueReview}
          requests={pendingRequests}
          contacts={contacts}
          onClose={() => {
            setShowQueueReview(false);
            setPreviewMode(false);
          }}
          onGoLive={previewMode ? undefined : handleGoLive}
          previewMode={previewMode}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appLogo: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  fixedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Prevent scrolling
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
});