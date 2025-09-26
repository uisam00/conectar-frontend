import { useCallback } from 'react';
import { getTokensInfo } from '../auth/auth-tokens-info';
import { API_URL } from './config';

export default function useFetch() {
  return useCallback(async (url: string, options: RequestInit = {}) => {
    const tokens = getTokensInfo();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (tokens?.token) {
      headers.Authorization = `Bearer ${tokens.token}`;
    }

    // Add language header if available
    const language = localStorage.getItem('i18nextLng') || 'en';
    headers['x-custom-lang'] = language;

    const response = await fetch(url.startsWith('http') ? url : `${API_URL}${url}`, {
      ...options,
      headers,
    });

    return response;
  }, []);
}
