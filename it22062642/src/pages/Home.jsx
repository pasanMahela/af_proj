import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import CountryCard from '../components/CountryCard';
import FilterBar from '../components/FilterBar';

export default function Home() {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all countries
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((res) => {
        setAllCountries(res.data);
        setFilteredCountries(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Handle search input
  const handleSearch = (query) => {
    const text = query.toLowerCase();
    setFilteredCountries(
      allCountries.filter((c) => c.name.common.toLowerCase().includes(text))
    );
  };

  // Handle region filter
  const handleRegionChange = (region) => {
    if (!region) {
      setFilteredCountries(allCountries);
    } else {
      setFilteredCountries(
        allCountries.filter((c) => c.region === region)
      );
    }
  };


  return (
    <motion.div
      className="min-h-screen px-6 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {/* Animated Search & Filter Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <FilterBar onSearch={handleSearch} onRegionChange={handleRegionChange} />
      </motion.div>

      {/* Country Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {filteredCountries.map((country) => (
          <motion.div
            key={country.cca3}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4 }}
          >
            <CountryCard country={country} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
