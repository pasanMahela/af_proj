import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api', // Your backend base URL
  withCredentials: true, // Send cookies for JWT auth
});

export default api;
