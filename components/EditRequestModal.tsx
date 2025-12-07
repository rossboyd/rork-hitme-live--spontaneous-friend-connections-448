import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Contact, UrgencyLevel, HitRequest } from '@/types';
import { Image } from 'expo-image';
import { X, Edit2, ChevronDown, ChevronUp, Star } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { darkTheme } from '@/constants/colors';

interface EditRequestModalProps {
  visible: boolean;
  request: HitRequest | null;
  contact: Contact | null;
  onClose: () => void;
  onUpdate: (requestId: string, updates: Partial<HitRequest>) => void;
}

const EXPIRY_OPTIONS = [
  { label: 'Never', value: null },
  { label: '24 hours', value: 24 * 60 * 60 * 1000 },
  { label: '3 days', value: 3 * 24 * 60 * 60 * 1000 },
  { label: '1 week', value: 7 * 24 * 60 * 60 * 1000 },
];

export const EditRequestModal = ({ 
  visible, 
  request,
  contact, 
  onClose, 
  onUpdate
}: EditRequestModalProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [topic, setTopic] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [expiresIn, setExpiresIn] = useState<number | null>(EXPIRY_OPTIONS[2].value);
  const [showDetails, setShowDetails] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (request) {
      setTopic(request.topic || '');
      setUrgency(request.urgency);
      setIsFavorite(request.expiresAt === null);
      
      // Calculate remaining time or set to null if no expiry
      if (request.expiresAt) {
        const now = Date.now();
        const remaining = request.expiresAt - now;
        
        // Find the closest expiry option
        const closestOption = EXPIRY_OPTIONS.reduce((prev, curr) => {
          if (!curr.value) return prev;
          if (!prev.value) return curr;
          
          const prevDiff = Math.abs((prev.value || 0) - remaining);
          const currDiff = Math.abs((curr.value || 0) - remaining);
          
          return prevDiff < currDiff ? prev : curr;
        });
        
        setExpiresIn(closestOption.value);
      } else {
        setExpiresIn(null);
      }
      
      // If topic is just the default, collapse the details section
      if (request.topic === `Chat with ${contact?.name || "contact"}`) {
        setShowDetails(false);
      } else {
        setShowDetails(true);
      }
    }
  }, [request, contact]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // If marking as favorite, automatically set expiry to "Never"
    if (!isFavorite) {
      setExpiresIn(null);
    }
  };
  
  const handleUpdate = () => {
    if (!request) return;
    
    const updates: Partial<HitRequest> = {
      topic: topic.trim() || `Chat with ${contact?.name || "contact"}`,
      urgency,
    };
    
    // Calculate new expiry date if needed
    if (isFavorite) {
      updates.expiresAt = null;
    } else if (expiresIn !== null) {
      updates.expiresAt = Date.now() + expiresIn;
    } else {
      updates.expiresAt = null;
    }
    
    // If request was expired, set it back to pending
    if (request.status === 'expired') {
      updates.status = 'pending';
    }
    
    onUpdate(request.id, updates);
  };
  
  if (!request || !contact) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Edit Request</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.contactInfo}>
              <Image
                source={{ uri: contact.avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
              <Text style={[styles.contactName, { color: colors.text.primary }]}>{contact.name}</Text>
              {contact.lastOnline && (
                <Text style={[styles.lastOnline, { color: colors.text.light }]}>
                  Last online {formatDistanceToNow(contact.lastOnline)}
                </Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={[styles.favoriteToggle, { 
                backgroundColor: isFavorite ? colors.primary + '20' : colors.card,
                borderColor: isFavorite ? colors.primary : colors.border 
              }]}
              onPress={toggleFavorite}
            >
              <Star 
                size={20} 
                color={isFavorite ? colors.primary : colors.text.secondary} 
                fill={isFavorite ? colors.primary : 'none'}
              />
              <Text style={[
                styles.favoriteToggleText, 
                { color: isFavorite ? colors.primary : colors.text.secondary }
              ]}>
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.detailsToggle, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Text style={[styles.detailsToggleText, { color: colors.text.secondary }]}>
                {showDetails ? "Hide details" : "Show details"}
              </Text>
              {showDetails ? (
                <ChevronUp size={20} color={colors.text.secondary} />
              ) : (
                <ChevronDown size={20} color={colors.text.secondary} />
              )}
            </TouchableOpacity>
            
            {showDetails && (
              <>
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text.primary }]}>Topic</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text.primary }]}
                    value={topic}
                    onChangeText={setTopic}
                    placeholder="What do you want to talk about?"
                    placeholderTextColor={colors.text.light}
                    multiline
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text.primary }]}>Urgency</Text>
                  <View style={styles.urgencyOptions}>
                    {(['low', 'medium', 'high'] as UrgencyLevel[]).map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.urgencyOption,
                          { borderColor: colors.border },
                          urgency === level && { 
                            backgroundColor: colors.urgency[level],
                            borderColor: colors.urgency[level],
                          }
                        ]}
                        onPress={() => setUrgency(level)}
                      >
                        <Text 
                          style={[
                            styles.urgencyText,
                            { color: colors.text.primary },
                            urgency === level && styles.selectedUrgencyText
                          ]}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
            
            {!isFavorite && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>Expires in</Text>
                <View style={styles.expiryOptions}>
                  {EXPIRY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      style={[
                        styles.expiryOption,
                        { borderColor: colors.border },
                        expiresIn === option.value && [styles.selectedExpiryOption, { backgroundColor: colors.primary, borderColor: colors.primary }]
                      ]}
                      onPress={() => setExpiresIn(option.value)}
                    >
                      <Text 
                        style={[
                          styles.expiryText,
                          { color: colors.text.primary },
                          expiresIn === option.value && { color: "#000" }
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            {isFavorite && (
              <View style={styles.favoriteNote}>
                <Text style={[styles.favoriteNoteText, { color: colors.text.secondary }]}>
                  Favorites never expire and will always appear at the top of your HitList.
                </Text>
              </View>
            )}
          </ScrollView>
          
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleUpdate}
          >
            <Edit2 size={18} color="#000" style={styles.editIcon} />
            <Text style={[styles.submitText, { color: "#000" }]}>Update Request</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  scrollView: {
    maxHeight: '70%',
  },
  contactInfo: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastOnline: {
    fontSize: 14,
  },
  favoriteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  favoriteToggleText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  detailsToggleText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  formGroup: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  urgencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  urgencyOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedUrgencyText: {
    color: '#fff',
  },
  expiryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  expiryOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
  },
  selectedExpiryOption: {
  },
  expiryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedExpiryText: {
    color: '#fff',
  },
  favoriteNote: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  favoriteNoteText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editIcon: {
    marginRight: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
});