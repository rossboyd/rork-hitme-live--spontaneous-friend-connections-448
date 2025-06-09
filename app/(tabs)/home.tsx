import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  Platform,
  Text,
  FlatList
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';
import { Users } from 'lucide-react-native';
import { HitRequest, Mode } from '@/types';
import * as Haptics from 'expo-haptics';
import { QueueReview } from '@/components/QueueReview';
import { SlideToLiveToggle } from '@/components/SlideToLiveToggle';
import { LiveModeStatus } from '@/components/LiveModeStatus';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Stack } from 'expo-router';
import { CombinedGoLiveModal } from '@/components/CombinedGoLiveModal';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { TouchableOpacity } from 'react-native';

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
    user,
    currentMode,
    setCurrentMode
  } = useAppStore();
  
  const { setTheme, colors = darkTheme } = useThemeStore();
  const [pendingRequests, setPendingRequests] = useState<HitRequest[]>([]);
  const [orderedRequests, setOrderedRequests] = useState<HitRequest[]>([]);
  const [showCombinedModal, setShowCombinedModal] = useState(false);
  const [showQueueReview, setShowQueueReview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<Mode[]>([]);

  useEffect(() => {
    setTheme(isHitMeModeActive ? 'light' : 'dark');
  }, [isHitMeModeActive, setTheme]);

  useEffect(() => {
    expireRequests();
    const interval = setInterval(expireRequests, 60000);
    return () => clearInterval(interval);
  }, [expireRequests]);

  useEffect(() => {
    const pending = inboundRequests.filter(req => 
      req.status === 'pending' && !dismissedRequests.includes(req.id)
    );
    
    const sortByUrgency = (a: HitRequest, b: HitRequest) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.createdAt - a.createdAt;
    };
    
    const sortedRequests = [...pending].sort(sortByUrgency);
    setPendingRequests(sortedRequests);
    setSelectedIds(sortedRequests.map(req => req.senderId));
  }, [inboundRequests, dismissedRequests]);

  useEffect(() => {
    if (isHitMeModeActive) {
      const filtered = currentMode 
        ? pendingRequests.filter(request => {
            const contact = getContactById(request.senderId);
            return contact.modes?.includes(currentMode);
          })
        : pendingRequests;
      setOrderedRequests(filtered);
    }
  }, [isHitMeModeActive, pendingRequests, currentMode]);

  useEffect(() => {
    if (isHitMeModeActive && hitMeEndTime) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = hitMeEndTime - now;
        
        if (remaining <= 0) {
          setTimeRemaining(0);
          toggleHitMeMode();
          setHitMeEndTime(null);
          clearDismissedRequests();
          setCurrentMode(null);
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
  }, [isHitMeModeActive, hitMeEndTime, toggleHitMeMode, setHitMeEndTime, clearDismissedRequests, setCurrentMode]);

  const handleSlideComplete = () => {
    setShowCombinedModal(true);
  };

  const handlePreviewQueue = () => {
    if (pendingRequests.length > 0) {
      setPreviewMode(true);
      setShowQueueReview(true);
    }
  };

  const handleGoLiveSettings = (minutes: number, modes: Mode[]) => {
    setHitMeDuration(minutes);
    setSelectedModes(modes);
    setShowCombinedModal(false);
    setPreviewMode(false);
    setShowQueueReview(true);
  };

  const handleGoLive = (notifyIds: string[]) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    toggleHitMeMode();
    setShowQueueReview(false);
    
    const endTime = Date.now() + (hitMeDuration * 60 * 1000);
    setHitMeEndTime(endTime);
    
    if (selectedModes.length === 1) {
      setCurrentMode(selectedModes[0]);
    } else {
      setCurrentMode(null);
    }
    
    setPendingNotifications(notifyIds);
    
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
    setCurrentMode(null);
  };

  const handleConnect = (request: HitRequest) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
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
      addToDismissedRequests(requestId);
    } else {
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

  const handleDragEnd = ({ data }: { data: HitRequest[] }) => {
    setOrderedRequests(data);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const renderDraggableItem = ({ item, drag, isActive }: RenderItemParams<HitRequest>) => (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={0.7}
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.draggableItem,
          isActive && { opacity: 0.7 }
        ]}
      >
        <RequestCard
          request={item}
          contact={getContactById(item.senderId)}
          onConnect={() => handleConnect(item)}
          onDismiss={() => handleDismiss(item.id)}
          isInbound={true}
          isDraggable={true}
        />
      </TouchableOpacity>
    </ScaleDecorator>
  );

  const renderStaticItem = ({ item }: { item: HitRequest }) => (
    <RequestCard
      request={item}
      contact={getContactById(item.senderId)}
      onConnect={() => handleConnect(item)}
      onDismiss={() => handleDismiss(item.id)}
      isInbound={true}
    />
  );

  const EmptyQueueComponent = () => (
    <EmptyState
      title="Your queue is empty"
      message={currentMode 
        ? `No one in ${currentMode} mode is waiting to talk to you right now.`
        : "No one is waiting to talk to you right now."}
      icon={<Users size={48} color={colors.text.light} />}
    />
  );

  return (
    <>
      <Stack.Screen options={{ headerBackVisible: false }} />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.appLogo, { color: colors.primary }]}>HitMeApp</Text>
        
        {isHitMeModeActive ? (
          <>
            {timeRemaining !== null && (
              <LiveModeStatus 
                timeRemaining={timeRemaining} 
                onGoOffline={handleGoOffline}
                currentMode={currentMode}
              />
            )}
            
            {Platform.OS !== 'web' ? (
              <DraggableFlatList
                data={orderedRequests}
                onDragEnd={handleDragEnd}
                keyExtractor={(item) => item.id}
                renderItem={renderDraggableItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={EmptyQueueComponent}
              />
            ) : (
              <FlatList
                data={orderedRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderStaticItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={EmptyQueueComponent}
              />
            )}
          </>
        ) : (
          <View style={styles.fixedContainer}>
            <SlideToLiveToggle 
              waitingCount={pendingRequests.length}
              onSlideComplete={handleSlideComplete}
              userName={user?.name.split(' ')[0]}
              onPreviewQueue={handlePreviewQueue}
              currentMode={currentMode}
            />
          </View>
        )}
        
        <CombinedGoLiveModal
          visible={showCombinedModal}
          onClose={() => setShowCombinedModal(false)}
          onGoLive={handleGoLiveSettings}
          initialDuration={hitMeDuration}
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
          currentMode={currentMode}
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
  },
  fixedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  draggableItem: {
    marginBottom: 12,
  },
});