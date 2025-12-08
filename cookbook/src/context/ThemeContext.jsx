import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved === null) return false;
      return saved === 'true';
    } catch {
      return false;
    }
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Update DOM whenever darkMode changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      console.log('Dark mode enabled');
    } else {
      root.classList.remove('dark');
      console.log('Light mode enabled');
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('darkMode', darkMode.toString());
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log('Toggle called, current:', darkMode);
    setDarkMode(prev => {
      const newValue = !prev;
      console.log('Setting to:', newValue);
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
