// Update text color for primary buttons
const getTextColor = () => {
  if (variant === 'outline') return colors.text.primary;
  if (variant === 'primary') return '#000'; // Black text on primary (green) buttons
  return '#fff'; // White text on other button types
};