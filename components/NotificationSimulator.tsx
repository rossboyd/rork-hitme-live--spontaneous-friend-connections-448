// Update WhatsApp deep linking
const handleConnectFromNotification = async (request: HitRequest) => {
  const contactForRequest = contacts.find(c => c.id === request.receiverId);
  if (!contactForRequest) return;
  
  // Format phone number for WhatsApp - remove all non-numeric characters
  // Keep the plus sign for international format
  const formattedPhone = contactForRequest.phone.startsWith('+') 
    ? contactForRequest.phone.substring(1).replace(/\D/g, '')
    : contactForRequest.phone.replace(/\D/g, '');
  
  // Try to open WhatsApp with the contact's phone number
  try {
    // WhatsApp deep link format: whatsapp://send?phone=XXXXXXXXXXX
    // Note: WhatsApp requires the phone number without the + sign but with country code
    const whatsappUrl = `whatsapp://send?phone=${formattedPhone}`;
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      // Fallback to web WhatsApp if app isn't installed
      const webWhatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}`;
      await Linking.openURL(webWhatsappUrl);
    }
    
    // Mark the request as completed
    onSimulateConnection(request.id);
  } catch (error) {
    console.error("Error opening WhatsApp:", error);
    Alert.alert(
      "Connection Error",
      "There was an error connecting to WhatsApp."
    );
    
    // Still mark as completed even if there was an error
    onSimulateConnection(request.id);
  }
};