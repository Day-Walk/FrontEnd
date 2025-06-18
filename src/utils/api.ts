import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "/api"
      : import.meta.env.VITE_SERVER_URL + "/api",
  withCredentials: true,
});
