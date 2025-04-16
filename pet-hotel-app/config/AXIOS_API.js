// import axios from "axios";

// const config = {
//     // baseURL: "http://192.168.1.7:8080/api/v1", // nha C7
//     // baseURL: "http://192.168.7.177:8080/api/v1", // nha Tien
//     // baseURL: "http://10.87.24.104:8080/api/v1", // nha Tien
//     baseURL: "http://192.168.50.89:9090/api/v1", // IPhone 13
//     header: {
//         "Content-Type": "application/json",
//     }
// };

// const API = axios.create(config);
// export default API;
// 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  baseURL: 'http://192.168.50.89:9090/api/v1',
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