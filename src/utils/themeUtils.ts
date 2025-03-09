import { ColorTheme } from '../components/ResumePreviewer';

// New color themes with expanded palette
export const colorThemes: ColorTheme[] = [
  // Primary colors
  { 
    id: 'blue', 
    name: 'Blue', 
    primary: '#2563eb', // Deeper blue
    secondary: '#93c5fd' 
  },
  { 
    id: 'green', 
    name: 'Green', 
    primary: '#059669', // Forest green
    secondary: '#a7f3d0' 
  },
  { 
    id: 'purple', 
    name: 'Purple', 
    primary: '#7c3aed', // Rich purple
    secondary: '#c4b5fd' 
  },
  { 
    id: 'red', 
    name: 'Red', 
    primary: '#dc2626', // Vibrant red
    secondary: '#fca5a5' 
  },
  { 
    id: 'amber', 
    name: 'Amber', 
    primary: '#d97706', // Deep amber
    secondary: '#fcd34d' 
  },
  { 
    id: 'gray', 
    name: 'Gray', 
    primary: '#4b5563', 
    secondary: '#d1d5db' 
  },
  
  // New colors
  { 
    id: 'teal', 
    name: 'Teal', 
    primary: '#0d9488', 
    secondary: '#99f6e4' 
  },
  { 
    id: 'indigo', 
    name: 'Indigo', 
    primary: '#4338ca', 
    secondary: '#a5b4fc' 
  },
  { 
    id: 'rose', 
    name: 'Rose', 
    primary: '#e11d48', 
    secondary: '#fda4af' 
  },
  { 
    id: 'cyan', 
    name: 'Cyan', 
    primary: '#0891b2', 
    secondary: '#a5f3fc' 
  },
  { 
    id: 'emerald', 
    name: 'Emerald', 
    primary: '#059669', 
    secondary: '#6ee7b7' 
  },
  { 
    id: 'slate', 
    name: 'Slate', 
    primary: '#334155', 
    secondary: '#cbd5e1' 
  }
];

// Get a color theme by ID
export const getColorThemeById = (id: string): ColorTheme => {
  const theme = colorThemes.find(theme => theme.id === id);
  return theme || colorThemes[0]; // Default to first theme if not found
};

// Get a darker shade of a color (for hover states, etc.)
export const getDarkerShade = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Darken by 15%
  const darkerR = Math.max(0, Math.floor(r * 0.85));
  const darkerG = Math.max(0, Math.floor(g * 0.85));
  const darkerB = Math.max(0, Math.floor(b * 0.85));
  
  // Convert back to hex
  return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
};

// Get a lighter shade of a color (for backgrounds, etc.)
export const getLighterShade = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Lighten by 15%
  const lighterR = Math.min(255, Math.floor(r + (255 - r) * 0.15));
  const lighterG = Math.min(255, Math.floor(g + (255 - g) * 0.15));
  const lighterB = Math.min(255, Math.floor(b + (255 - b) * 0.15));
  
  // Convert back to hex
  return `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
};

// Default color theme
export const defaultColorTheme = colorThemes[0]; 