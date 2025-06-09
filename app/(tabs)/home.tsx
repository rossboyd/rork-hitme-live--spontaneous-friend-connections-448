import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';
import { darkTheme } from '@/constants/colors';
import { SlideToLiveToggle } from '@/components/SlideToLiveToggle';
import { LiveModeStatus } from '@/components/LiveModeStatus';
import { QueueReview } from '@/components/QueueReview';
import { DurationSelector } from '@/components/DurationSelector';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';
import { Inbox, Users } from 'lucide-react-native';

export default function HomeScreen() {
  const { colors = darkTheme } = useThemeStore();
  const { 
    user,
    inboundRequests, 
    contacts, 
    isHitMeModeActive,
    hitMeEndTime,
    toggleHitMeMode,
    setHitMeEndTime,
    dismissRequest,
    updateRequestStatus
  } = useAppStore();

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [showQueuePreview, setShowQueuePreview] = useState(false);
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<string[]>([]);

  // Update time remaining
  useEffect(() => {
    if (!isHitMeModeActive || !hitMeEndTime) return;

    const interval = setInterval(() => {
      const remaining = hitMeEndTime - Date.now();
      if (remaining <= 0) {
        setTimeRemaining(0);
        toggleHitMeMode();
        setHitMeEndTime(null);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isHitMeModeActive, hitMeEndTime, toggleHitMeMode, setHitMeEndTime]);

  const pendingInboundRequests = inboundRequests.filter(req => req.status === 'pending');

  const handleGoLive = (duration: number) => {
    const endTime = Date.now() + (duration * 60 * 1000);
    setHitMeEndTime(endTime);
    setTimeRemaining(duration * 60 * 1000);
    toggleHitMeMode();
    setShowDurationSelector(false);
  };

  const handleGoOffline = () => {
    toggleHitMeMode();
    setHitMeEndTime(null);
    setTimeRemaining(0);
  };

  const handleSlideComplete = () => {
    setShowDurationSelector(true);
  };

  const handlePreviewQueue = () => {
    setShowQueuePreview(true);
  };

  const handleConnect = (requestId: string) => {
    updateRequestStatus(requestId, 'completed');
  };

  const handleDismiss = (requestId: string) => {
    dismissRequest(requestId);
  };

  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || {
      id: contactId,
      name: 'Unknown Contact',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      phone: '',
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isHitMeModeActive ? (
          <LiveModeStatus
            timeRemaining={timeRemaining}
            onGoOffline={handleGoOffline}
          />
        ) : (
          <SlideToLiveToggle
            waitingCount={pendingInboundRequests.length}
            onSlideComplete={handleSlideComplete}
            userName={user?.name || 'there'}
            onPreviewQueue={pendingInboundRequests.length > 0 ? handlePreviewQueue : undefined}
          />
        )}

        {/* Incoming Requests Section */}
        {pendingInboundRequests.length > 0 && (
          <View style={styles.incomingSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Incoming Requests
            </Text>
            {pendingInboundRequests.slice(0, 3).map(request => (
              <RequestCard
                key={request.id}
                request={request}
                contact={getContactById(request.senderId)}
                onConnect={() => handleConnect(request.id)}
                onDismiss={() => handleDismiss(request.id)}
                isInbound={true}
              />
            ))}
            {pendingInboundRequests.length > 3 && (
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  View all {pendingInboundRequests.length} requests
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Empty state when no incoming requests */}
        {pendingInboundRequests.length === 0 && !isHitMeModeActive && (
          <View style={styles.emptySection}>
            <EmptyState
              title="No incoming requests"
              message="When people want to talk to you, their requests will appear here."
              icon={<Inbox size={48} color={colors.text.light} />}
            />
          </View>
        )}
      </ScrollView>

      {/* Duration Selector Modal */}
      <DurationSelector
        visible={showDurationSelector}
        onClose={() => setShowDurationSelector(false)}
        onSelect={handleGoLive}
      />

      {/* Queue Preview Modal */}
      <QueueReview
        visible={showQueuePreview}
        requests={pendingInboundRequests}
        contacts={contacts}
        onClose={() => setShowQueuePreview(false)}
        previewMode={true}
        selectedIds={selectedNotificationIds}
        setSelectedIds={setSelectedNotificationIds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  incomingSection: {
    marginTop: 40,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptySection: {
    flex: 1,
    marginTop: 40,
  },
});