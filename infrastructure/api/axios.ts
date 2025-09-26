import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if ((session as unknown as { error?: string })?.error === 'RefreshAccessTokenError') {
      signOut();
    }

    config.headers = config.headers || {};

    type CustomUser = {
      accessToken?: string;
      tokens?: { access?: { token?: string } };
    };
    const user = session?.user as CustomUser | undefined;
    const accessToken = user?.accessToken || user?.tokens?.access?.token;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('Error in request interceptor', error);
    return Promise.reject(error);
  }
);
// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired → log user out
      await signOut({ callbackUrl: "/" }); 
      // callbackUrl ensures redirect to login page
    }
    return Promise.reject(error);
  }
);
export default api;
