import axios from "axios";
import NProgress from "nprogress";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");

      delete apiClient.defaults.headers.common["Authorization"];

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
