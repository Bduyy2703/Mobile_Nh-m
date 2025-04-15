import axios from "axios";

const config = {
    // baseURL: "http://192.168.1.7:8080/api/v1", // nha C7
    // baseURL: "http://192.168.7.177:8080/api/v1", // nha Tien
    // baseURL: "http://10.87.24.104:8080/api/v1", // nha Tien
    baseURL: "http://192.168.41.175:9090/api/v1", // IPhone 13
    header: {
        "Content-Type": "application/json",
    }
};

const API = axios.create(config);
export default API;