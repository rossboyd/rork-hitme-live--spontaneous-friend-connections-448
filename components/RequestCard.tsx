import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useThemeStore } from '@/store/useThemeStore';
import { HitRequest, Contact } from '@/types';
import { formatTimeToNow } from '@/utils/dateUtils';
import { MessageSquare, Clock, Trash2, RefreshCw } from 'lucide-react-native';

interface RequestCardProps {
  request: HitRequest;
  contact: Contact;
  onExtend?: () => void;
  onDelete?: () => void;
  isInbound?: boolean;
}

export const RequestCard = ({
  request,
  contact,
  onExtend,
  onDelete,
  isInbound = false
}: RequestCardProps) => {
  const { colors } = useThemeStore();

  const renderUrgencyBadge = () => (
    <View style={[
      styles.urgencyBadge,
      { backgroundColor: colors.urgency[request.urgency] }
    ]}>
      <Text style={styles.urgencyText}>
        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
      </Text>
    </View>
  );

  const renderExpiryInfo = () => {
    if (!request.expiresAt) return null;
    
    const timeLeft = formatTimeToNow(request.expiresAt);
    const isExpired = request.status === 'expired';
    
    return (
      <View style={[
        styles.expiryInfo,
        { opacity: isExpired ? 0.6 : 1 }
      ]}>
        <Clock size={14} color={colors.text.light} />
        <Text style={[styles.expiryText, { color: colors.text.light }]}>
          {isExpired ? 'Expired' : timeLeft}
        </Text>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.card }
    ]}>
      <View style={styles.header}>
        <Image
          source={{ uri: contact.avatar }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.text.primary }]}>
            {contact.name}
          </Text>
          {renderExpiryInfo()}
        </View>
        {renderUrgencyBadge()}
      </View>

      <Text style={[styles.topic, { color: colors.text.secondary }]}>
        {request.topic}
      </Text>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.connectButton}>
          <MessageSquare size={16} color="#000" />
          <Text style={styles.connectText}>Connect</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          {request.status === 'expired' && onExtend && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onExtend}
            >
              <RefreshCw size={20} color={colors.text.light} />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onDelete}
            >
              <Trash2 size={20} color={colors.text.light} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  topic: {
    fontSize: 14,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00FF00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  expiryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 12,
    marginLeft: 4,
  },
});