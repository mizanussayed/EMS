import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCallback, useMemo } from 'react';
interface ApiOptions extends RequestInit {
  body?: any;
}

export function useApi() {
  const { auth, logout } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const request = useCallback(
    async (endpoint: string, options: ApiOptions = {}) => {
      const url = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

      const headers = new Headers(options.headers || {});
      if (auth?.accessToken) {
        headers.set('Authorization', `Bearer ${auth.accessToken}`);
      }

      if (options.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
        options.body = JSON.stringify(options.body);
      }

      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (response.status === 401) {
          logout();
          throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        if (response.status === 204) return null;
        return await response.json();
      } catch (error: any) {
        console.error('API Error:', error.message);
        throw error;
      }
    },
    [apiUrl, auth, logout]
  );

  return useMemo(() => ({
    get: (endpoint: string, options?: ApiOptions) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body: any, options?: ApiOptions) => request(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint: string, body: any, options?: ApiOptions) => request(endpoint, { ...options, method: 'PUT', body }),
    delete: (endpoint: string, options?: ApiOptions) => request(endpoint, { ...options, method: 'DELETE' }),
  }), [request]);
}
