// Update height calculation
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6; // 60% of screen height

// Update modal styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: MODAL_HEIGHT, // Fixed height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  // ... rest of styles remain same
});