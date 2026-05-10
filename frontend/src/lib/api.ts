import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Required for HttpOnly cookies (refresh token)
});

// Request interceptor to attach Access Token
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Response interceptor for token rotation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.data.success) {
          const { access_token } = res.data.data;

          // Note: NextAuth session won't update automatically here
          // But we can update the original request header and retry
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Trigger a session update if possible, or force re-auth if needed
          // For simplicity in this demo, we just retry the request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, sign out
        // signOut(); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
