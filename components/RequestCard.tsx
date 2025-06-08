// Update the styles in RequestCard.tsx
const styles = StyleSheet.create({
  // ... existing styles ...
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E676', // Match primary color
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#000', // Black text for better contrast
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  // ... rest of the styles ...
});