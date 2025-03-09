import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ColorTheme } from '../components/ResumePreviewer';
import { colorThemes, defaultColorTheme } from '../utils/themeUtils';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  systemTheme: ThemeType;
  useSystemTheme: () => void;
  currentColorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  systemTheme: 'light',
  useSystemTheme: () => {},
  currentColorTheme: defaultColorTheme,
  setColorTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get system theme preference
  const getSystemTheme = (): ThemeType => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [systemTheme, setSystemTheme] = useState<ThemeType>(getSystemTheme());
  const [useSystem, setUseSystem] = useState<boolean>(() => {
    return localStorage.getItem('useSystemTheme') === 'true';
  });
  
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // If using system theme, return system theme
    if (useSystem) {
      return getSystemTheme();
    }
    
    // Otherwise use saved theme or default to light
    return (savedTheme as ThemeType) || 'light';
  });

  const [currentColorTheme, setCurrentColorTheme] = useState<ColorTheme>(() => {
    const savedColorThemeId = localStorage.getItem('colorTheme');
    if (savedColorThemeId) {
      const savedTheme = colorThemes.find(theme => theme.id === savedColorThemeId);
      if (savedTheme) return savedTheme;
    }
    return defaultColorTheme;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // If using system theme, update current theme
      if (useSystem) {
        setTheme(newSystemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [useSystem]);

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    localStorage.setItem('useSystemTheme', useSystem.toString());
    
    // Update document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, useSystem]);

  // Save color theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('colorTheme', currentColorTheme.id);
  }, [currentColorTheme]);

  const toggleTheme = () => {
    setUseSystem(false);
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const useSystemTheme = () => {
    setUseSystem(true);
    setTheme(systemTheme);
  };

  const setColorTheme = (theme: ColorTheme) => {
    setCurrentColorTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      systemTheme, 
      useSystemTheme,
      currentColorTheme,
      setColorTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 