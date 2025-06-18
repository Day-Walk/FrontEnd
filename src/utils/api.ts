import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "/api"
      : import.meta.env.VITE_SERVER_URL + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const noTokenUrls = ["/user/login"];
  const requestPath = new URL(config.url ?? "", config.baseURL).pathname;

  if (noTokenUrls.includes(requestPath)) {
    return config;
  }

  if (token && config.headers) {
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
