import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, getCurrentUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      const res = await getCurrentUser();
      setUser(res.data);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left image panel */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="world.png"
          alt="globe"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <motion.div
          className="w-full max-w-md bg-[var(--card)] p-8 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 backdrop-blur-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded bg-transparent border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded bg-transparent border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Login
            </button>

            <p className="text-sm mt-4 text-center">
              Don’t have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
