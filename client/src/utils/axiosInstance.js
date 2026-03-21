import axios from "axios";
let progressHandler = null;

export const setProgressHandler = (handler) => {
  progressHandler = handler;
};


const axiosInstance = axios.create({
  baseURL:  process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
     if (progressHandler) progressHandler(30);
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    if (progressHandler) progressHandler(100);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (progressHandler) progressHandler(100);
    return response
  },
  (error) => {
    if (progressHandler) progressHandler(100);
    const token = localStorage.getItem("token");

    if (error.response?.status === 401 && token) {
      localStorage.clear();

      if (!window.location.pathname.includes("/signIn")) {
        window.location.replace("/signIn");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
