import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Phone, X, Clock, Trash2, Wifi } from 'lucide-react-native';
import { HitRequest, UrgencyLevel, Contact } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface RequestCardProps {
  request: HitRequest;
  contact: Contact;
  onConnect?: () => void;
  onDismiss?: () => void;
  onExtend?: () => void;
  onDelete?: () => void;
  isInbound?: boolean;
}

export const RequestCard = ({ 
  request, 
  contact, 
  onConnect, 
  onDismiss, 
  onExtend,
  onDelete,
  isInbound = false
}: RequestCardProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const getUrgencyColor = (urgency: UrgencyLevel) => {
    return colors.urgency[urgency];
  };

  const isExpired = request.status === 'expired';

  return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.card },
      isExpired && styles.expiredCard
    ]}>
      <Image
        source={{ uri: contact.avatar }}
        style={styles.avatar}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text.primary }]}>{contact.name}</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(request.urgency) }]}>
            <Text style={styles.urgencyText}>{request.urgency}</Text>
          </View>
        </View>
        
        <Text style={[styles.topic, { color: colors.text.secondary }]} numberOfLines={2}>{request.topic}</Text>
        
        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <View style={styles.timeContainer}>
              <Clock size={14} color={colors.text.light} />
              <Text style={[styles.timeText, { color: colors.text.light }]}>
                {isExpired 
                  ? 'Expired' 
                  : request.expiresAt 
                    ? `Expires ${formatDistanceToNow(request.expiresAt)}` 
                    : 'Never expires'}
              </Text>
            </View>
            
            {!isInbound && contact.lastOnline && (
              <View style={styles.onlineContainer}>
                <Wifi size={14} color={colors.text.light} />
                <Text style={[styles.timeText, { color: colors.text.light }]}>
                  Last online {formatDistanceToNow(contact.lastOnline)}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.actionContainer}>
            {isInbound && !isExpired && onConnect && (
              <TouchableOpacity 
                style={styles.connectButton}
                onPress={onConnect}
              >
                <Phone size={16} color="#000" />
                <Text style={[styles.connectText, { color: "#000" }]}>Connect</Text>
              </TouchableOpacity>
            )}
            
            {!isInbound && isExpired && onExtend && (
              <TouchableOpacity 
                style={[styles.extendButton, { borderColor: colors.primary }]}
                onPress={onExtend}
              >
                <Text style={[styles.extendText, { color: colors.primary }]}>Extend</Text>
              </TouchableOpacity>
            )}
            
            {isInbound && onDismiss && (
              <TouchableOpacity 
                style={styles.dismissButton}
                onPress={onDismiss}
              >
                <X size={16} color={colors.accent} />
              </TouchableOpacity>
            )}
            
            {!isInbound && onDelete && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={onDelete}
              >
                <Trash2 size={16} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  expiredCard: {
    opacity: 0.7,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  topic: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  infoContainer: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  extendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  extendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});