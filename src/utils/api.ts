import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "/api"
      : import.meta.env.VITE_SERVER_URL + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const requestPath = config.url?.split("?")[0] ?? "";

  console.log(
    `[API Request] url: ${config.url}, baseURL: ${config.baseURL}, requestPath: ${requestPath}`,
  );

  if (requestPath.endsWith("/user/login")) {
    return config;
  }

  if (token && config.headers && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`[API Request] final headers:`, config.headers);

  return config;
});
