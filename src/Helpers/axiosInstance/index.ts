import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { getToken_Localstorage } from "../LocalStorageHandler/LocalStorageHelper";
import { baseUrl } from "./constants";

// Function to get JWT header
export function getJWTHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = getToken_Localstorage();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

// Axios configuration with base URL
const axiosConfig: AxiosRequestConfig = { baseURL: baseUrl };

// Create an instance of Axios with the configuration
const axiosInstance = axios.create(axiosConfig);

// Add an interceptor to conditionally include the JWT token in the request headers
axiosInstance.interceptors.request.use(
  (config) => {
    const jwtHeader = getJWTHeader();
    config.headers = { ...config.headers, ...jwtHeader } as AxiosRequestHeaders;
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      import('@/Hooks/useAuthCheck').then(({ useAuthCheck }) => {
        const { checkAuth } = useAuthCheck();
        checkAuth("از سرور خطای عدم ورود دریافت کردیم.", false);
      }).catch(console.error);
    }
    return Promise.reject(error);
  }
);

// Helper for server-side requests that need explicit token
export async function getServerAxiosConfig() {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const token = cookies().get('Token')?.value;
      return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
    } catch (error) {
      return { headers: {} };
    }
  }
  return { headers: {} };
}

export { axiosInstance };
