import { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export default function RegionDropdown({ onRegionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All Regions');
  const dropdownRef = useRef(null);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (region) => {
    setSelected(region);
    onRegionChange(region === 'All Regions' ? '' : region);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center bg-[var(--card)] text-[var(--text)] px-4 py-2 rounded shadow cursor-pointer gap-2"
      >
        <FaGlobe />
        <span>{selected}</span>
        <FaChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-full z-10 bg-[var(--card)] text-[var(--text)] border border-gray-200 dark:border-gray-600 rounded shadow-lg"
          >
            {['All Regions', ...regions].map((region) => (
              <li
                key={region}
                onClick={() => handleSelect(region)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {region}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
