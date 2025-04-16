import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  baseURL: 'http://192.168.50.89:9090/no-auth',
  headers: {
    'Content-Type': 'application/json',
  },
};

const API = axios.create(config);

// Thêm interceptor để tự động thêm token vào header
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;