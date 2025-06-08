// Update modal height to be 60% of screen height
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6; // 60% of screen height

// Update container style
const styles = StyleSheet.create({
  container: {
    height: MODAL_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  // Rest of styles remain the same...
});