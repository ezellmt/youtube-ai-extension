export const themes = {
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    textColor: 'white',
    accentColor: '#1a5f7a',
    headerColor: '#333',
  },
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textColor: 'black',
    accentColor: '#4a90e2',
    headerColor: '#f0f0f0',
  },
  colorful: {
    backgroundColor: 'rgba(255, 220, 200, 0.9)',
    textColor: '#333',
    accentColor: '#ff6b6b',
    headerColor: '#4ecdc4',
  },
};

export type ThemeName = keyof typeof themes;
