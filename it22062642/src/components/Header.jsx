import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiGlobe } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition">
          <img className='w-12' src="world.png" alt="logo" />
          <span>RestCountries</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="relative hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Home
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
              layoutId="underline"
            />
          </Link>
          <Link to="/favorites" className="relative hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Favorites
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
              layoutId="underline"
            />
          </Link>
          {user ? (
            <>
              <span className="text-gray-700 dark:text-gray-300">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Login</Link>
              <Link to="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Sign Up</Link>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-2xl text-[var(--text)]"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 dark:bg-gray-900/90 overflow-hidden"
          >
            <ul className="flex flex-col gap-4 px-6 py-4 text-lg">
              <li>
                <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              </li>
              <li>
                <Link to="/favorites" onClick={() => setMobileOpen(false)}>Favorites</Link>
              </li>
              {user ? (
                <>
                  <li className="text-gray-700 dark:text-gray-300">Hi, {user.username}</li>
                  <li>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                  </li>
                  <li>
                    <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                  </li>
                </>
              )}
              <li className="pt-2">
                <ThemeToggle />
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}