// App color schemes
const greenTheme = {
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

const greenDarkTheme = {
  primary: '#00FF00', // Keep bright green for consistency
  secondary: '#5D7CA6', // Darker blue
  accent: '#E8505B', // Keep the same accent color
  background: '#1A2B1A', // Darker green background
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

const pinkTheme = {
  primary: '#EA078A', // Bright pink for live mode
  secondary: '#9BB1D2', // Light blue
  accent: '#E8505B', // Soft red for urgency indicators
  background: '#FFF5FA', // Light pink-tinted background
  card: '#FFFFFF', // White card background
  text: {
    primary: '#2D1B28', // Dark pink text
    secondary: '#4A3D47', // Medium pink text
    light: '#6E5E6B', // Light pink text
  },
  border: '#E2E8F0', // Light gray border
  success: '#EA078A', // Bright pink for success states
  urgency: {
    low: '#9BB1D2', // Light blue
    medium: '#F6AD55', // Orange
    high: '#E8505B', // Red
  }
};

const pinkDarkTheme = {
  primary: '#EA078A', // Keep bright pink for consistency
  secondary: '#5D7CA6', // Darker blue
  accent: '#E8505B', // Keep the same accent color
  background: '#2B1A25', // Darker pink background
  card: '#392333', // Slightly lighter than background for cards
  text: {
    primary: '#FFE6F5', // Light pink text
    secondary: '#CCB8C8', // Medium light pink text
    light: '#A68A9F', // Darker light pink text
  },
  border: '#4A5568', // Darker border
  success: '#EA078A', // Same bright pink
  urgency: {
    low: '#5D7CA6', // Darker blue
    medium: '#DD6B20', // Darker orange
    high: '#C53030', // Darker red
  }
};

export const themes = {
  green: {
    light: greenTheme,
    dark: greenDarkTheme,
  },
  pink: {
    light: pinkTheme,
    dark: pinkDarkTheme,
  }
};

// For backward compatibility
export const lightTheme = greenTheme;
export const darkTheme = greenDarkTheme;
export const colors = lightTheme;