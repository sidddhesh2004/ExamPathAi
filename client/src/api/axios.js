import axios from 'axios';

// Get the backend URL from an environment variable.
// In local development, this will be undefined, so we default to localhost.
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const apiClient = axios.create({
  baseURL: API_URL,
});

export default apiClient;