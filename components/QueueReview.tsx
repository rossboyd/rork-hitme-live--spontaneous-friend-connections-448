import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Platform
} from 'react-native';
import { HitRequest, Contact, Mode } from '@/types';
import { X, Check, Filter, Briefcase, Home, Users, Clock } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Avatar } from '@/components/common/Avatar';
import { formatDistanceToNow } from '@/utils/dateUtils';
import * as Haptics from 'expo-haptics';

interface QueueReviewProps {
  visible: boolean;
  requests: HitRequest[];
  contacts: Contact[];
  onClose: () => void;
  onGoLive?: (selectedIds: string[]) => void;
  previewMode?: boolean;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  currentMode: Mode | null;
}

export const QueueReview = ({
  visible,
  requests,
  contacts,
  onClose,
  onGoLive,
  previewMode = false,
  selectedIds,
  setSelectedIds,
  currentMode
}: QueueReviewProps) => {
  const { colors = darkTheme } = useThemeStore();

  const filteredRequests = currentMode 
    ? requests.filter(request => {
        const contact = getContactById(request.senderId);
        return contact.modes?.includes(currentMode);
      })
    : requests;

  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || {
      id: contactId,
      name: "Unknown Contact",
      avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      phone: "",
    };
  };

  const toggleContact = (contactId: string) => {
    if (selectedIds.includes(contactId)) {
      setSelectedIds(selectedIds.filter(id => id !== contactId));
    } else {
      setSelectedIds([...selectedIds, contactId]);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const getModeLabel = () => {
    switch (currentMode) {
      case 'work':
        return 'Work Mode';
      case 'family':
        return 'Family Mode';
      case 'social':
        return 'Social Mode';
      default:
        return 'All Contacts';
    }
  };

  const renderModeIcon = (mode: Mode) => {
    const iconProps = { size: 14, color: colors.primary };
    switch (mode) {
      case 'work':
        return <Briefcase {...iconProps} />;
      case 'family':
        return <Home {...iconProps} />;
      case 'social':
        return <Users {...iconProps} />;
      default:
        return null;
    }
  };

  const renderItem = ({ item }: { item: HitRequest }) => {
    const contact = getContactById(item.senderId);
    const isSelected = selectedIds.includes(item.senderId);
    const contactModes = contact.modes || [];

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !previewMode && toggleContact(item.senderId)}
        style={[
          styles.contactItem,
          { backgroundColor: colors.card },
          isSelected && { borderColor: colors.primary, borderWidth: 2 }
        ]}
      >
        <Avatar
          name={contact.name}
          avatar={contact.avatar}
          size={48}
        />
        
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: colors.text.primary }]}>
            {contact.name}
          </Text>
          <Text style={[styles.topic, { color: colors.text.secondary }]}>
            {item.topic}
          </Text>
          
          <View style={styles.statusContainer}>
            <Clock size={12} color={colors.text.light} />
            <Text style={[styles.lastSeen, { color: colors.text.light }]}>
              {contact.lastOnline 
                ? `Last seen ${formatDistanceToNow(contact.lastOnline)}`
                : "Never online"}
            </Text>
          </View>
          
          {contactModes.length > 0 && (
            <View style={styles.modesContainer}>
              {contactModes.map((mode) => (
                <View 
                  key={mode} 
                  style={[styles.modeTag, { backgroundColor: colors.background }]}
                >
                  {renderModeIcon(mode)}
                  <Text style={[styles.modeTagText, { color: colors.text.secondary }]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {!previewMode && (
          <View style={[
            styles.checkbox,
            { borderColor: colors.border },
            isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
          ]}>
            {isSelected && <Check size={16} color="#000" />}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View 
          style={[
            styles.container, 
            { backgroundColor: colors.background }
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {previewMode ? "Queue Preview" : "Manage Your Queue"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {currentMode && (
              <View style={[styles.modeIndicator, { backgroundColor: colors.card }]}>
                <Filter size={16} color={colors.primary} />
                <Text style={[styles.modeText, { color: colors.text.primary }]}>
                  {getModeLabel()}
                </Text>
              </View>
            )}
            
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {previewMode
                ? `${filteredRequests.length} people waiting to talk`
                : filteredRequests.length > 0 
                  ? "Select who to notify when you go live."
                  : "Select who to notify when you go live"}
            </Text>

            {filteredRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                  {currentMode 
                    ? `No contacts in ${getModeLabel()} are waiting to talk`
                    : "No one is waiting to talk with you"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>

          {!previewMode && onGoLive && filteredRequests.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.goLiveButton, 
                  { 
                    backgroundColor: colors.primary,
                    opacity: selectedIds.length > 0 ? 1 : 0.5
                  }
                ]}
                onPress={() => onGoLive(selectedIds)}
                disabled={selectedIds.length === 0}
                activeOpacity={selectedIds.length > 0 ? 0.7 : 1}
              >
                <Text style={[
                  styles.goLiveText, 
                  { color: "#000" }
                ]}>
                  Go Live ({selectedIds.length})
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  topic: {
    fontSize: 14,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  lastSeen: {
    fontSize: 12,
    marginLeft: 4,
  },
  modesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  modeTagText: {
    fontSize: 12,
    marginLeft: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
  goLiveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  goLiveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});