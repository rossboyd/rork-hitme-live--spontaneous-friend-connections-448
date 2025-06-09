import React, { useState } from 'react';
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
import { Contact, UrgencyLevel } from '@/types';
import { Image } from 'expo-image';
import { X, ChevronDown, ChevronUp, Star } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface AddRequestModalProps {
  visible: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSubmit: (data: {
    topic: string;
    urgency: UrgencyLevel;
    expiresIn: number | null;
  }) => void;
}

const EXPIRY_OPTIONS = [
  { label: 'Never', value: null },
  { label: '24 hours', value: 24 * 60 * 60 * 1000 },
  { label: '3 days', value: 3 * 24 * 60 * 60 * 1000 },
  { label: '1 week', value: 7 * 24 * 60 * 60 * 1000 },
];

export const AddRequestModal = ({ 
  visible, 
  contact, 
  onClose, 
  onSubmit 
}: AddRequestModalProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [topic, setTopic] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [expiresIn, setExpiresIn] = useState<number | null>(EXPIRY_OPTIONS[2].value);
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleSubmit = () => {
    // If marked as favorite, set expiresIn to null (never expires)
    const finalExpiresIn = isFavorite ? null : expiresIn;
    
    onSubmit({
      topic: topic.trim() || `Chat with ${contact?.name || "contact"}`,
      urgency,
      expiresIn: finalExpiresIn,
    });
    
    // Reset form
    setTopic('');
    setUrgency('medium');
    setExpiresIn(EXPIRY_OPTIONS[2].value);
    setShowDetails(false);
    setIsFavorite(false);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // If marking as favorite, automatically set expiry to "Never"
    if (!isFavorite) {
      setExpiresIn(null);
    }
  };
  
  if (!contact) return null;
  
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
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Add to HitList</Text>
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
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.detailsToggle, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Text style={[styles.detailsToggleText, { color: colors.text.secondary }]}>
                {showDetails ? "Hide details" : "Add details (optional)"}
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
            onPress={handleSubmit}
          >
            <Text style={[styles.submitText, { color: "#000" }]}>Add to HitList</Text>
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
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
});