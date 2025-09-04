import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message:
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : "Request failed"),
      details: data,
    };
  }
  if (error.request) {
    return { status: 0, message: "Network error or no response from server" };
  }
  return { status: -1, message: error.message || "Unknown client error" };
}

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(normalizeError(err))
);
