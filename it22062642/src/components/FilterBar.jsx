import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import RegionDropdown from './RegionDropdown';

export default function FilterBar({ onSearch, onRegionChange }) {
  const [searchText, setSearchText] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
      {/* Animated Search Field */}
      <motion.div
        className="flex items-center bg-[var(--card)] text-[var(--text)] rounded shadow px-4 py-2 overflow-hidden"
        initial={{ width: '100%' }}
        animate={{ width: focused ? '30%' : '15%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <FaSearch className="mr-2 text-gray-400" />
        <motion.input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            onSearch(e.target.value);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search for a country..."
          className="bg-transparent outline-none w-full placeholder-gray-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Region Dropdown stays static */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <RegionDropdown onRegionChange={onRegionChange} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
