// import axios from "axios";

// const config = {
//     // baseURL: "http://192.168.1.7:8080/no-auth", // nha C7
//     // baseURL: "http://192.168.7.177:8080/no-auth", // nha Tien
//     // baseURL: "http://10.87.24.104:8080/no-auth", // nha Tien
//     baseURL: "http://192.168.50.89:9090/no-auth", // IPhone 13
//     header: {
//         "Content-Type": "application/json",
//     }
// };

// const BASE = axios.create(config);
// export default BASE;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  baseURL: 'http://192.168.41.175:9090/no-auth',
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