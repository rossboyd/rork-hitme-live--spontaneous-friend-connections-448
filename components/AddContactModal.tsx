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
import { X, User } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Avatar } from '@/components/common/Avatar';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    avatar: string;
  }) => void;
}

// Default avatars to choose from
const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80',
];

export const AddContactModal = ({ 
  visible, 
  onClose, 
  onSubmit 
}: AddContactModalProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  
  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    
    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      avatar: selectedAvatar,
    });
    
    // Reset form
    setName('');
    setPhone('');
    setSelectedAvatar(DEFAULT_AVATARS[0]);
  };
  
  const isFormValid = name.trim() !== '' && phone.trim() !== '';
  
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
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Add New Contact</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.avatarSection}>
              <Avatar
                name={name || "New Contact"}
                avatar={selectedAvatar}
                size={100}
              />
              
              <Text style={[styles.label, { color: colors.text.primary }]}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                {DEFAULT_AVATARS.map((avatar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.avatarOption,
                      selectedAvatar === avatar && [styles.selectedAvatarOption, { borderColor: colors.primary }]
                    ]}
                    onPress={() => setSelectedAvatar(avatar)}
                  >
                    <Avatar
                      name={name || "New Contact"}
                      avatar={avatar}
                      size={50}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text.primary }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter contact name"
                placeholderTextColor={colors.text.light}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text.primary }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.text.light}
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity
            style={[
              styles.submitButton, 
              { backgroundColor: isFormValid ? colors.primary : colors.border }
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <User size={18} color="#000" style={styles.buttonIcon} />
            <Text style={[styles.submitText, { color: "#000" }]}>Add Contact</Text>
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
  avatarSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  avatarOption: {
    margin: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
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
  buttonIcon: {
    marginRight: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
});