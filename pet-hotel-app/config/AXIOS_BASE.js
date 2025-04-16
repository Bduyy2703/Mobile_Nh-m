import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  baseURL: 'http://192.168.50.89:9090/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
};

const BASE = axios.create(config);

// Thêm interceptor để tự động thêm token vào header
BASE.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default BASE;