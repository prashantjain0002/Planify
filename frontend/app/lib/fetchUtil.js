import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("force-logout"));
    }

    return Promise.reject(error);
  }
);

const postData = async (path, data) => {
  const response = await api.post(path, data);
  return response.data;
};

const getData = async (path) => {
  const response = await api.get(path);
  return response.data;
};

const updateData = async (path, data) => {
  const response = await api.put(path, data);
  return response.data;
};

const deleteData = async (path) => {
  const response = await api.delete(path);
  return response.data;
};

export { postData, getData, updateData, deleteData };
