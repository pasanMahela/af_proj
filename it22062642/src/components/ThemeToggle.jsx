import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className="flex justify-end p-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full transition"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
}
