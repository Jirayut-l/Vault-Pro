import { getSession, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/options';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiClient<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    let accessToken: string | undefined;

    if (typeof window === 'undefined') {
      const session = await getServerSession(authOptions);
      accessToken = (session as any)?.accessToken;
    } else {
      const session = await getSession();
      accessToken = (session as any)?.accessToken;
    }

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  let response = await fetch(url, { ...fetchOptions, headers });

  if (response.status === 401 && !skipAuth) {
    if (typeof window !== 'undefined') {
      try {
        const refreshRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newAccessToken = refreshData.data?.access_token;
          if (newAccessToken) {
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            response = await fetch(url, { ...fetchOptions, headers });
          }
        } else {
          signOut({ callbackUrl: '/login' });
        }
      } catch (err) {
        console.error('Token refresh execution failed:', err);
      }
    }
  }

  const json = await response.json();

  if (!response.ok) {
    const errorMessage = json?.error || json?.message || 'An error occurred';
    throw new Error(errorMessage);
  }

  if (json && typeof json === 'object') {
    if (json.success === false) {
      throw new Error(json.error || json.message || 'API request failed');
    }
    if ('success' in json && 'data' in json) {
      return json.data;
    }
  }

  return json;
}
