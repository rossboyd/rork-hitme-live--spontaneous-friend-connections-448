import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';
import { Plus, ListChecks, Star, Clock } from 'lucide-react-native';
import { HitRequest } from '@/types';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { EditRequestModal } from '@/components/EditRequestModal';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { useRequestFilters } from '@/hooks/useRequestFilters';

type TabType = 'active' | 'favorites' | 'expired';

export default function HitListScreen() {
  const router = useRouter();
  const { 
    outboundRequests, 
    contacts, 
    expireRequests, 
    updateRequestStatus, 
    deleteOutboundRequest, 
    updateOutboundRequest, 
    user 
  } = useAppStore();
  const { colors = darkTheme } = useThemeStore();
  const [selectedRequest, setSelectedRequest] = useState<HitRequest | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const { favoriteRequests, pendingRequests, expiredRequests } = useRequestFilters(outboundRequests);

  useEffect(() => {
    expireRequests();
    const interval = setInterval(expireRequests, 60000);
    return () => clearInterval(interval);
  }, [expireRequests]);

  const handleAddRequest = () => {
    router.push('/contacts');
  };

  const handleExtendRequest = (requestId: string) => {
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
        isFavorite={item.expiresAt === null}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    const emptyStates = {
      active: {
        title: "No active requests",
        message: "Add people to your HitList to let them know you want to talk.",
        icon: <ListChecks size={48} color={colors.text.light} />
      },
      favorites: {
        title: "No favorites yet",
        message: "Mark requests as favorites to keep them permanently.",
        icon: <Star size={48} color={colors.text.light} />
      },
      expired: {
        title: "No expired requests",
        message: "Expired requests will appear here.",
        icon: <Clock size={48} color={colors.text.light} />
      }
    };

    const state = emptyStates[activeTab];
    return <EmptyState title={state.title} message={state.message} icon={state.icon} />;
  };

  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'favorites':
        return favoriteRequests;
      case 'active':
        return pendingRequests;
      case 'expired':
        return expiredRequests;
      default:
        return pendingRequests;
    }
  };

  const tabData = getCurrentTabData();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.appName, { color: colors.text.primary }]}>HitMeApp</Text>
        <Text style={[styles.welcomeText, { color: colors.text.secondary }]}>
          Hey {user?.name || "there"}. {"You're Offline"}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TabButton 
          title="Active" 
          count={pendingRequests.length}
          isActive={activeTab === 'active'} 
          onPress={() => setActiveTab('active')}
          colors={colors}
        />
        <TabButton 
          title="Favorites" 
          count={favoriteRequests.length}
          isActive={activeTab === 'favorites'} 
          onPress={() => setActiveTab('favorites')}
          colors={colors}
        />
        <TabButton 
          title="Expired" 
          count={expiredRequests.length}
          isActive={activeTab === 'expired'} 
          onPress={() => setActiveTab('expired')}
          colors={colors}
        />
      </View>

      <FlatList
        data={tabData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
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

interface TabButtonProps {
  title: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
  colors: typeof darkTheme;
}

const TabButton = ({ title, count, isActive, onPress, colors }: TabButtonProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.tabButton,
        isActive && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.tabText, 
        { color: isActive ? colors.text.primary : colors.text.light }
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.countBadge, { backgroundColor: isActive ? colors.primary : colors.text.light }]}>
          <Text style={[styles.countText, { color: isActive ? '#000' : colors.background }]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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