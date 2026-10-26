import axios from 'axios';

// Cliente para la NASA
export const nasaApi = axios.create({
  baseURL: 'https://api.nasa.gov',
  timeout: 15000,
});

nasaApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: process.env.EXPO_PUBLIC_NASA_API_KEY,
  };
  return config;
});

// Cliente para la Bitácora
export const mockApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MOCKAPI_URL,
});