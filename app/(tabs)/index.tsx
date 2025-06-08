// Update HitList screen to use animations
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { RequestCard } from '@/components/RequestCard';
import { EmptyState } from '@/components/EmptyState';
import { Plus, ListChecks } from 'lucide-react-native';
import { HitRequest } from '@/types';
import * as Haptics from 'expo-haptics';
import { EditRequestModal } from '@/components/EditRequestModal';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { AnimatedView } from '@/components/AnimatedView';
import { AnimatedList } from '@/components/AnimatedList';

export default function HitListScreen() {
  // ... existing code ...

  const renderItem = ({ item, index }: { item: HitRequest; index: number }) => (
    <AnimatedView index={index}>
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
    </AnimatedView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={[...activeRequests, ...expiredRequests]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <AnimatedView>
            <EmptyState
              title="Your HitList is empty"
              message="Add people to your HitList to let them know you want to talk."
              icon={<ListChecks size={48} color={colors.text.light} />}
            />
          </AnimatedView>
        }
        ListHeaderComponent={
          activeRequests.length > 0 || expiredRequests.length > 0 ? (
            <AnimatedView>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                {activeRequests.length} Active Requests
              </Text>
            </AnimatedView>
          ) : null
        }
        ListFooterComponent={
          expiredRequests.length > 0 ? (
            <AnimatedView>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                  Expired
                </Text>
                <AnimatedList>
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
                </AnimatedList>
              </View>
            </AnimatedView>
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