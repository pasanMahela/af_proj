// src/pages/CountryDetails.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUsers,
  FaGlobe,
  FaLandmark,
  FaMap,
} from 'react-icons/fa';

export default function CountryDetails() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localTimes, setLocalTimes] = useState([]);
  const [wikiSummary, setWikiSummary] = useState('');

  // 1) Fetch country data
  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => setCountry(res.data[0]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [code]);

  // 2) Live clocks for each timezone
  useEffect(() => {
    if (!country?.timezones) return;
    const parseOffset = (tz) => {
      const m = tz.match(/^UTC([+-]\d{2}):?(\d{2})?$/);
      if (!m) return 0;
      const [_, hh, mm = '0'] = m;
      const sign = hh.startsWith('-') ? -1 : 1;
      return sign * (Math.abs(parseInt(hh, 10)) * 60 + parseInt(mm, 10));
    };
    const zones = country.timezones.map((tz) => ({ tz, offsetMin: parseOffset(tz) }));
    const update = () => {
      const now = Date.now();
      const utc = now + new Date().getTimezoneOffset() * 60000;
      setLocalTimes(
        zones.map(({ tz, offsetMin }) => {
          const local = new Date(utc + offsetMin * 60000);
          return {
            tz,
            time: local.toLocaleTimeString('en-GB', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          };
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [country]);

  // 3) Wikipedia summary
  useEffect(() => {
    if (!country?.name?.common) return;
    const title = encodeURIComponent(country.name.common.replace(/\s*\(.*?\)$/, ''));
    axios
      .get(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`)
      .then((res) => {
        if (res.data.extract) setWikiSummary(res.data.extract);
      })
      .catch(() => {});
  }, [country]);

  if (loading) return <Loader />;
  if (!country) return null;

  const {
    name,
    flags,
    population,
    region,
    subregion,
    capital,
    languages,
    currencies,
  } = country;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-[var(--bg)] min-h-screen"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[var(--card)] px-4 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Live Local Times */}
        {localTimes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {localTimes.map(({ tz, time }) => (
              <motion.div
                key={tz}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 p-4 bg-[var(--card)] rounded-lg shadow"
              >
                <FaGlobe className="text-xl text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tz}</p>
                  <p className="text-2xl font-mono">{time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Details Card */}
        <div className="bg-[var(--card)] rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Flag */}
            <div className="flex-shrink-0 p-4">
              <div className="w-40 h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                <img
                  src={flags.svg}
                  alt={`${name.common} flag`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="p-6 flex-1"
            >
              <motion.h1
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="text-3xl font-extrabold mb-4 text-[var(--text)]"
              >
                {name.common}
              </motion.h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                {/* Left Column */}
                <div className="space-y-3">
                  <motion.p
                    variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    className="flex items-center gap-2"
                  >
                    <FaGlobe className="text-blue-500" /> Official:{' '}
                    <span className="font-medium">{name.official}</span>
                  </motion.p>
                  <motion.p
                    variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    className="flex items-center gap-2"
                  >
                    <FaLandmark className="text-green-500" /> Capital:{' '}
                    <span className="font-medium">{capital?.[0] || '-'}</span>
                  </motion.p>
                  <motion.p
                    variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    className="flex items-center gap-2"
                  >
                    <FaMapMarkerAlt className="text-purple-500" /> Region:{' '}
                    <span className="font-medium">{region}</span>
                  </motion.p>
                  <motion.p
                    variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    className="flex items-center gap-2"
                  >
                    <FaMapMarkerAlt className="text-purple-500" /> Subregion:{' '}
                    <span className="font-medium">{subregion}</span>
                  </motion.p>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <motion.p
                    variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    className="flex items-center gap-2"
                  >
                    <FaUsers className="text-red-500" /> Population:{' '}
                    <span className="font-medium">{population.toLocaleString()}</span>
                  </motion.p>
                  <motion.p
                    variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    className="flex items-center gap-2"
                  >
                    <FaGlobe className="text-blue-500" /> Languages:{' '}
                    <span className="font-medium">
                      {languages ? Object.values(languages).join(', ') : '-'}
                    </span>
                  </motion.p>
                  <motion.p
                    variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    className="flex items-center gap-2"
                  >
                    <FaGlobe className="text-blue-500" /> Currencies:{' '}
                    <span className="font-medium">
                      {currencies
                        ? Object.values(currencies).map((c) => c.name).join(', ')
                        : '-'}
                    </span>
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map Link */}
        { name.common && (
          <div className="text-center">
            <a
              href={
                `https://www.google.com/maps/search/?api=1&query=` +
                encodeURIComponent(name.common)
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FaMap /> Open "{name.common}" on Google Maps
            </a>
          </div>
        )}


        {/* Wikipedia Snippet */}
        {wikiSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="prose prose-lg dark:prose-dark mt-6"
          >
            <p><em>{wikiSummary}</em></p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
