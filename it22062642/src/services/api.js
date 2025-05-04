import axios from 'axios';

const api = axios.create({
  baseURL: 'https://af-backend-4iln.onrender.com', // Your backend base URL
  withCredentials: true, // Send cookies for JWT auth
});

export default api;
