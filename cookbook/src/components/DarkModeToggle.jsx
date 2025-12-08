import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Button clicked! Current mode:', darkMode);
        toggleDarkMode();
      }}
      type="button"
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className="text-xl text-yellow-500" />
      ) : (
        <FaMoon className="text-xl" />
      )}
    </button>
  );
};

export default DarkModeToggle;
