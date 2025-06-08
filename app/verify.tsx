// Update verify screen to route to onboarding
const handleVerify = () => {
  if (otp === MOCK_OTP) {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Create mock user
    setUser({
      id: 'user-1',
      name: 'You',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    });

    // Route to onboarding instead of home
    router.replace('/onboarding/welcome');
  } else {
    setError('Invalid code. Please try again.');
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }
};