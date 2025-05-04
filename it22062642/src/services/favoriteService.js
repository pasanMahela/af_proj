import api from './api';

export const getFavorites = () => api.get('/favorites');
export const addFavorite = (code) => api.post('/favorites', { code });
export const removeFavorite = (code) => api.delete(`/favorites/${code}`);
