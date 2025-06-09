import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  Platform,
  Text,
  TouchableOpacity,
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
  const [activeTab, setActiveTab] = useState<'active' | 'favorites' | 'expired'>('active');

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
    // Filter and sort requests based on active tab
    let filtered: HitRequest[] = [];
    
    if (activeTab === 'active') {
      filtered = inboundRequests.filter(req => 
        req.status === 'pending' && !dismissedRequests.includes(req.id)
      );
    } else if (activeTab === 'favorites') {
      filtered = inboundRequests.filter(req => {
        const contact = getContactById(req.senderId);
        return req.status === 'pending' && 
               !dismissedRequests.includes(req.id) && 
               contact.isFavorite === true;
      });
    } else if (activeTab === 'expired') {
      filtered = inboundRequests.filter(req => 
        req.status === 'expired' || req.status === 'dismissed'
      );
    }
    
    // Sort by urgency (high > medium > low) and then by creation date (newest first)
    const sortByUrgency = (a: HitRequest, b: HitRequest) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.createdAt - a.createdAt;
    };
    
    const sortedRequests = [...filtered].sort(sortByUrgency);
    setPendingRequests(sortedRequests);
    
    // Set all pending request senders as selected by default
    setSelectedIds(sortedRequests.map(req => req.senderId));
  }, [inboundRequests, dismissedRequests, activeTab]);

  // Initialize orderedRequests when pendingRequests change or when going live
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
    
    // Set current mode based on selected modes
    // If multiple modes are selected, set to null (all contacts)
    // Otherwise, set to the single selected mode
    if (selectedModes.length === 1) {
      setCurrentMode(selectedModes[0]);
    } else {
      setCurrentMode(null);
    }
    
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
    setCurrentMode(null);
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

  const renderItem = ({ item }: { item: HitRequest }) => (
    <RequestCard
      request={item}
      contact={getContactById(item.senderId)}
      onConnect={() => handleConnect(item)}
      onDismiss={() => handleDismiss(item.id)}
      isInbound={true}
    />
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'active' && [styles.activeTab, { borderBottomColor: colors.primary }]
        ]}
        onPress={() => setActiveTab('active')}
      >
        <Text 
          style={[
            styles.tabText, 
            { color: activeTab === 'active' ? colors.primary : colors.text.secondary }
          ]}
        >
          Active
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'favorites' && [styles.activeTab, { borderBottomColor: colors.primary }]
        ]}
        onPress={() => setActiveTab('favorites')}
      >
        <Text 
          style={[
            styles.tabText, 
            { color: activeTab === 'favorites' ? colors.primary : colors.text.secondary }
          ]}
        >
          Favorites
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'expired' && [styles.activeTab, { borderBottomColor: colors.primary }]
        ]}
        onPress={() => setActiveTab('expired')}
      >
        <Text 
          style={[
            styles.tabText, 
            { color: activeTab === 'expired' ? colors.primary : colors.text.secondary }
          ]}
        >
          Expired
        </Text>
      </TouchableOpacity>
    </View>
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
                currentMode={currentMode}
              />
            )}
            
            {/* Use DraggableFlatList when in live mode - ONLY for mobile */}
            {Platform.OS !== 'web' ? (
              <DraggableFlatList
                data={orderedRequests}
                onDragEnd={handleDragEnd}
                keyExtractor={(item) => item.id}
                renderItem={renderDraggableItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <EmptyState
                    title="Your queue is empty"
                    message={currentMode 
                      ? `No one in ${currentMode} mode is waiting to talk to you right now.`
                      : "No one is waiting to talk to you right now."}
                    icon={<Users size={48} color={colors.text.light} />}
                  />
                }
              />
            ) : (
              // Fallback for web - regular FlatList
              <FlatList
                data={orderedRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <EmptyState
                    title="Your queue is empty"
                    message={currentMode 
                      ? `No one in ${currentMode} mode is waiting to talk to you right now.`
                      : "No one is waiting to talk to you right now."}
                    icon={<Users size={48} color={colors.text.light} />}
                  />
                }
              />
            )}
          </>
        ) : (
          <>
            {renderTabBar()}
            
            <FlatList
              data={pendingRequests}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <EmptyState
                  title={
                    activeTab === 'active' ? "No active requests" :
                    activeTab === 'favorites' ? "No favorite requests" :
                    "No expired requests"
                  }
                  message={
                    activeTab === 'active' ? "When someone wants to talk to you, their request will appear here." :
                    activeTab === 'favorites' ? "Favorite contacts with active requests will appear here." :
                    "Expired and dismissed requests will appear here."
                  }
                  icon={<Users size={48} color={colors.text.light} />}
                />
              }
            />
            
            <View style={styles.fixedContainer}>
              <SlideToLiveToggle 
                waitingCount={pendingRequests.length}
                onSlideComplete={handleSlideComplete}
                userName={user?.name.split(' ')[0]}
                onPreviewQueue={handlePreviewQueue}
                currentMode={currentMode}
              />
            </View>
          </>
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
    fontFamily: 'PlusJakartaSans-Bold',
  },
  fixedContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100, // Add padding to avoid overlap with the slide toggle
  },
  draggableItem: {
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});