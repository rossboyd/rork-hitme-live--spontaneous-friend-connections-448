import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  SafeAreaView
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { X, Search } from 'lucide-react-native';

interface CountryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (countryCode: string) => void;
}

// Sample country codes
const COUNTRY_CODES = [
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+61', name: 'Australia' },
  { code: '+33', name: 'France' },
  { code: '+49', name: 'Germany' },
  { code: '+81', name: 'Japan' },
  { code: '+86', name: 'China' },
  { code: '+91', name: 'India' },
  { code: '+55', name: 'Brazil' },
  { code: '+52', name: 'Mexico' },
  { code: '+27', name: 'South Africa' },
  { code: '+82', name: 'South Korea' },
  { code: '+39', name: 'Italy' },
  { code: '+34', name: 'Spain' },
  { code: '+7', name: 'Russia' },
];

export const CountryPicker = ({ 
  visible, 
  onClose, 
  onSelect 
}: CountryPickerProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const renderItem = ({ item }: { item: typeof COUNTRY_CODES[0] }) => (
    <TouchableOpacity
      style={[styles.countryItem, { borderBottomColor: colors.border }]}
      onPress={() => onSelect(item.code)}
    >
      <Text style={[styles.countryCode, { color: colors.text.primary }]}>
        {item.code}
      </Text>
      <Text style={[styles.countryName, { color: colors.text.secondary }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Select Country
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={20} color={colors.text.light} style={styles.searchIcon} />
          <Text style={[styles.searchPlaceholder, { color: colors.text.light }]}>
            Search countries
          </Text>
        </View>
        
        <FlatList
          data={COUNTRY_CODES}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    width: 60,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  countryName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});