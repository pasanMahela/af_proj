import api from './api';

export const signup = (username, password) => api.post('/auth/signup', { username, password });
export const login = (username, password) => api.post('/auth/login', { username, password });
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');
