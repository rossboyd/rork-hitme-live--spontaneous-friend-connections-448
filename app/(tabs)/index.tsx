import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';
import { Plus, ListChecks } from 'lucide-react-native';
import { HitRequest } from '@/types';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { EditRequestModal } from '@/components/EditRequestModal';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function HitListScreen() {
  const router = useRouter();
  const { outboundRequests, contacts, expireRequests, updateRequestStatus, deleteOutboundRequest, updateOutboundRequest } = useAppStore();
  const { colors = darkTheme } = useThemeStore();
  const [activeRequests, setActiveRequests] = useState<HitRequest[]>([]);
  const [expiredRequests, setExpiredRequests] = useState<HitRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HitRequest | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    // Check for expired requests on mount and every minute
    if (expireRequests) {
      expireRequests();
      const interval = setInterval(expireRequests, 60000);
      return () => clearInterval(interval);
    }
  }, [expireRequests]);

  useEffect(() => {
    // Filter and sort requests
    const active = outboundRequests.filter(req => req.status === 'pending');
    const expired = outboundRequests.filter(req => req.status === 'expired');
    
    // Sort by creation date (newest first)
    setActiveRequests([...active].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    setExpiredRequests([...expired].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
  }, [outboundRequests]);

  const handleAddRequest = () => {
    router.push('/contacts');
  };

  const handleExtendRequest = (requestId: string) => {
    // For now, just change status back to pending
    // In a real app, you'd update the expiry date too
    updateRequestStatus(requestId, 'pending');
  };

  const handleDeleteRequest = (requestId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    deleteOutboundRequest(requestId);
  };

  const handleEditRequest = (request: HitRequest) => {
    setSelectedRequest(request);
    setEditModalVisible(true);
  };

  const handleUpdateRequest = (requestId: string, updates: Partial<HitRequest>) => {
    updateOutboundRequest(requestId, updates);
    setEditModalVisible(false);
    setSelectedRequest(null);
  };

  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || {
      id: contactId,
      name: 'Unknown Contact',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      phone: '',
    };
  };

  const renderItem = ({ item }: { item: HitRequest }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => handleEditRequest(item)}
    >
      <RequestCard
        request={item}
        contact={getContactById(item.receiverId)}
        onExtend={() => handleExtendRequest(item.id)}
        onDelete={() => handleDeleteRequest(item.id)}
        isInbound={false}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <EmptyState
      title="Your HitList is empty"
      message="Add people to your HitList to let them know you want to talk."
      icon={<ListChecks size={48} color={colors.text.light} />}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={[...activeRequests, ...expiredRequests]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          activeRequests.length > 0 || expiredRequests.length > 0 ? (
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              {activeRequests.length} Active Requests
            </Text>
          ) : null
        }
        ListFooterComponent={
          expiredRequests.length > 0 ? (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>Expired</Text>
              {expiredRequests.map(request => (
                <TouchableOpacity 
                  key={request.id}
                  activeOpacity={0.7}
                  onPress={() => handleEditRequest(request)}
                >
                  <RequestCard
                    request={request}
                    contact={getContactById(request.receiverId)}
                    onExtend={() => handleExtendRequest(request.id)}
                    onDelete={() => handleDeleteRequest(request.id)}
                    isInbound={false}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
      />
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={handleAddRequest}
      >
        <Plus size={24} color="#000" />
      </TouchableOpacity>

      <EditRequestModal
        visible={editModalVisible}
        request={selectedRequest}
        contact={selectedRequest ? getContactById(selectedRequest.receiverId) : null}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedRequest(null);
        }}
        onUpdate={handleUpdateRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});