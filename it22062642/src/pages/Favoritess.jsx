import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/favoriteService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import CountryCard from '../components/CountryCard';

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all favorite countries
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favRes = await getFavorites();
      const codes = Array.isArray(favRes.data) ? favRes.data : favRes.data.codes || [];
      if (codes.length === 0) {
        setCountries([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}`
      );
      setCountries(res.data);
    } catch (err) {
      console.error('Favorites load error:', err);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount after auth is ready
  useEffect(() => {
    if (!authLoading && user) {
      loadFavorites();
    } else if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  // Handle favorite toggle
  const handleToggle = (code, nowFav) => {
    if (!nowFav) {
      setCountries((prev) => prev.filter((c) => c.cca3 !== code));
    } else {
      // Re-fetch entire list
      loadFavorites();
    }
  };

  // Show loader while loading
  if (authLoading || loading) return <Loader />;

  if (countries.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        You haven’t added any favorite countries yet.
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {countries.map((country) => (
        <CountryCard
          key={country.cca3}
          country={country}
          onToggle={handleToggle}
          isInitiallyFav={true}
        />
      ))}
    </div>
  );
}
