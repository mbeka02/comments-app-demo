import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export function request(url, options) {
  return api(url, options)
    .then((result) => result.data)
    .catch((error) =>
      Promise.reject(error?.response?.data?.message ?? "ERROR")
    );
}
