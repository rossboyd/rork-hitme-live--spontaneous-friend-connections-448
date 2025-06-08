// App color scheme
export const lightTheme = {
  primary: '#00FF00', // Bright green for live mode
  secondary: '#9BB1D2', // Light blue
  accent: '#E8505B', // Soft red for urgency indicators
  background: '#FAFFFA', // Light green-tinted background
  card: '#FFFFFF', // White card background
  text: {
    primary: '#1B281B', // Dark green text
    secondary: '#3D4A3D', // Medium green text
    light: '#5E6B5E', // Light green text
  },
  border: '#E2E8F0', // Light gray border
  success: '#00FF00', // Bright green for success states
  urgency: {
    low: '#9BB1D2', // Light blue
    medium: '#F6AD55', // Orange
    high: '#E8505B', // Red
  }
};

export const darkTheme = {
  primary: '#00FF00', // Keep bright green for consistency
  secondary: '#5D7CA6', // Darker blue
  accent: '#E8505B', // Keep the same accent color
  background: '#1A2B1A', // Darker green background (updated)
  card: '#233923', // Slightly lighter than background for cards
  text: {
    primary: '#E6FFE6', // Light green text
    secondary: '#B8CCB8', // Medium light green text
    light: '#8AA68A', // Darker light green text
  },
  border: '#4A5568', // Darker border
  success: '#00FF00', // Same bright green
  urgency: {
    low: '#5D7CA6', // Darker blue
    medium: '#DD6B20', // Darker orange
    high: '#C53030', // Darker red
  }
};

// For backward compatibility
export const colors = lightTheme;