'use client';

import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'dark' 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FaSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FaMoon className="w-5 h-5 text-gray-700" />
      )}
    </motion.button>
  );
}
