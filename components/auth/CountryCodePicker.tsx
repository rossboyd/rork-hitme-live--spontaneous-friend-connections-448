import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { X } from 'lucide-react-native';

interface CountryCodePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedCode: string;
}

const COUNTRY_CODES = [
  { code: '+44', name: 'United Kingdom' },
  { code: '+1', name: 'United States' },
  { code: '+61', name: 'Australia' },
  { code: '+33', name: 'France' },
  { code: '+49', name: 'Germany' },
  { code: '+81', name: 'Japan' },
  { code: '+86', name: 'China' },
  { code: '+91', name: 'India' },
];

export const CountryCodePicker = ({
  visible,
  onClose,
  onSelect,
  selectedCode
}: CountryCodePickerProps) => {
  const { colors = darkTheme } = useThemeStore();

  const renderItem = ({ item }: { item: typeof COUNTRY_CODES[0] }) => (
    <TouchableOpacity
      style={[
        styles.item,
        { borderBottomColor: colors.border },
        selectedCode === item.code && { backgroundColor: colors.primary + '20' }
      ]}
      onPress={() => onSelect(item.code)}
    >
      <Text style={[styles.code, { color: colors.text.primary }]}>
        {item.code}
      </Text>
      <Text style={[styles.country, { color: colors.text.primary }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Select Country
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={COUNTRY_CODES}
            renderItem={renderItem}
            keyExtractor={item => item.code}
          />
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
    maxHeight: '70%',
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
  item: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  code: {
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  country: {
    fontSize: 16,
  },
});