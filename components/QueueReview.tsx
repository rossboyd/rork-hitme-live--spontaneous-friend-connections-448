import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Dimensions
} from 'react-native';
import { HitRequest, Contact, Mode } from '@/types';
import { X, Check, Filter, Briefcase, Home, Heart, Crown, Meh, Clock } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Avatar } from '@/components/common/Avatar';
import { formatDistanceToNow } from '@/utils/dateUtils';

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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6;

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
  };

  const filteredRequests = currentMode 
    ? requests.filter(request => {
        const contact = getContactById(request.senderId);
        return contact.modes?.includes(currentMode);
      })
    : requests;

  const getModeLabel = () => {
    switch (currentMode) {
      case 'WRK':
        return 'Work Mode';
      case 'FAM':
        return 'Family Mode';
      case 'BFF':
        return 'BFF Mode';
      case 'VIP':
        return 'VIP Mode';
      case 'MEH':
        return 'Meh Mode';
      default:
        return 'All Contacts';
    }
  };

  const renderModeIcon = (mode: Mode) => {
    switch (mode) {
      case 'WRK':
        return <Briefcase size={14} color={colors.primary} />;
      case 'FAM':
        return <Home size={14} color={colors.primary} />;
      case 'BFF':
        return <Heart size={14} color={colors.primary} />;
      case 'VIP':
        return <Crown size={14} color={colors.primary} />;
      case 'MEH':
        return <Meh size={14} color={colors.primary} />;
      default:
        return null;
    }
  };

  const getModeDisplayName = (mode: Mode) => {
    switch (mode) {
      case 'FAM':
        return 'Family';
      case 'VIP':
        return 'VIP';
      case 'BFF':
        return 'BFF';
      case 'WRK':
        return 'Work';
      case 'MEH':
        return 'Meh';
      default:
        return mode;
    }
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
            { 
              backgroundColor: colors.background,
              height: MODAL_HEIGHT
            }
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

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              filteredRequests.map(request => {
                const contact = getContactById(request.senderId);
                const isSelected = selectedIds.includes(request.senderId);
                const contactModes = contact.modes || [];

                return (
                  <TouchableOpacity
                    key={request.id}
                    style={[
                      styles.contactItem,
                      { backgroundColor: colors.card },
                      isSelected && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => !previewMode && toggleContact(request.senderId)}
                    disabled={previewMode}
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
                        {request.message}
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
                                {getModeDisplayName(mode)}
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
              })
            )}
          </ScrollView>

          {!previewMode && onGoLive && filteredRequests.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.goLiveButton, { backgroundColor: colors.primary }]}
                onPress={() => onGoLive(selectedIds)}
              >
                <Text style={[styles.goLiveText, { color: "#000" }]}>
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