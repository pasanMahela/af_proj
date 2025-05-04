import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaUsers,
  FaLandmark,
} from 'react-icons/fa';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from '../services/favoriteService';

export default function CountryCard({
  country,
  onToggle,
  isInitiallyFav = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(isInitiallyFav);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  useEffect(() => {
    if (user && !isInitiallyFav) {
      getFavorites().then((res) => {
        const codes = Array.isArray(res.data) ? res.data : res.data.codes || [];
        setIsFav(codes.includes(country.cca3));
      });
    }
  }, [user, country.cca3, isInitiallyFav]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      if (isFav) {
        await removeFavorite(country.cca3);
        setIsFav(false);
        onToggle?.(country.cca3, false);
      } else {
        await addFavorite(country.cca3);
        setIsFav(true);
        setShowHeartAnim(true);
        setTimeout(() => setShowHeartAnim(false), 1000);
        onToggle?.(country.cca3, true);
      }
    } catch (err) {
      console.error('Favorite toggle error:', err);
    }
  };

  const goToDetails = () => {
    navigate(`/country/${country.cca3}`);
  };

  return (
    <motion.div
      onClick={goToDetails}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-[var(--card)] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative cursor-pointer"
    >
      {/* Animated Heart Drop */}
      {showHeartAnim && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20"
        >
          <FaHeart className="text-red-500 text-3xl drop-shadow-lg" />
        </motion.div>
      )}

      {/* Favorite Button */}
      {user && (
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white/100 transition"
        >
          {isFav ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-400 text-xl" />
          )}
        </button>
      )}

      {/* Flag */}
      <img
        src={country.flags.svg}
        alt={`${country.name.common} flag`}
        className="w-full h-40 object-cover"
      />

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-[var(--text)] truncate">
          {country.name.common}
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <FaMapMarkerAlt /> {country.region}
          </li>
          <li className="flex items-center gap-2">
            <FaUsers /> {country.population.toLocaleString()}
          </li>
          <li className="flex items-center gap-2">
            <FaLandmark /> {country.capital?.[0] || '—'}
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
