// src/pages/Favorites.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getFavorites,
  getCachedFavorites,
} from '../services/favoriteService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import CountryCard from '../components/CountryCard';
import { AnimatePresence, motion } from 'framer-motion';

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [updating, setUpdating] = useState(false);

  // 1) On first mount, show whatever codes we have in localStorage
  useEffect(() => {
    const cached = getCachedFavorites();
    if (cached.length) {
      axios
        .get(
          `https://restcountries.com/v3.1/alpha?codes=${cached.join(
            ','
          )}&fields=cca3,name,flags,region,population,capital`,
          { timeout: 5000 }
        )
        .then((res) => setCountries(res.data))
        .catch(() => {
          /* ignore — will refresh below */
        });
    }
  }, []);

  // 2) Real fetch from your backend + API, in background
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    (async () => {
      setUpdating(true);
      try {
        const favRes = await getFavorites(); // also updates localStorage
        const codes = Array.from(new Set(favRes.data || []));
        if (codes.length) {
          const resp = await axios.get(
            `https://restcountries.com/v3.1/alpha?codes=${codes.join(
              ','
            )}&fields=cca3,name,flags,region,population,capital`,
            { timeout: 5000 }
          );
          setCountries(resp.data);
        } else {
          setCountries([]);
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setUpdating(false);
      }
    })();
  }, [authLoading, user, navigate]);

  if (authLoading) return <Loader />;

  return (
    <div className="p-6">
      {updating && (
        <div className="mb-4 text-center text-gray-500 dark:text-gray-400">
          Updating favorites…
        </div>
      )}

      {countries.length === 0 && !updating ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          You haven’t added any favorite countries yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {countries.map((country) => (
              <motion.div
                key={country.cca3}
                layout
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CountryCard
                  country={country}
                  onToggle={() =>
                    setCountries((prev) =>
                      prev.filter((c) => c.cca3 !== country.cca3)
                    )
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
