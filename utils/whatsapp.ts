import { Platform, Linking } from 'react-native';

export const formatPhoneForWhatsApp = (phone: string) => {
  // Remove all non-numeric characters
  const numericOnly = phone.replace(/\D/g, '');
  
  // If number doesn't start with country code, assume +1 (US/Canada)
  if (!numericOnly.startsWith('1')) {
    return '1' + numericOnly;
  }
  
  return numericOnly;
};

export const getWhatsAppUrl = (phone: string) => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  
  // Use different URL schemes for mobile and web
  if (Platform.OS === 'web') {
    return `https://wa.me/${formattedPhone}`;
  }
  return `whatsapp://send?phone=${formattedPhone}`;
};

export const openWhatsApp = async (phone: string): Promise<boolean> => {
  try {
    const whatsappUrl = getWhatsAppUrl(phone);
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      return true;
    }
    
    // If WhatsApp isn't installed, try web version
    const webUrl = `https://wa.me/${formatPhoneForWhatsApp(phone)}`;
    await Linking.openURL(webUrl);
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    return false;
  }
};