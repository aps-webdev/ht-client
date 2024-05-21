'use client';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getToken = () => {
  try {
    if (typeof window !== undefined) {
      const value = window.localStorage.getItem('token');
      return `Bearer ${value}`;
    }
    return undefined;
  } catch (error) {
    console.log(error);
  }
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: getToken(),
  },
});

const _get = (url: string) => {
  return apiClient.get(url);
};

const _post = (url: string, data = {}) => {
  return apiClient.post(url, data);
};

const _delete = (url: string) => {
  return apiClient.delete(url);
};

const _put = (url: string, data = {}) => {
  return apiClient.put(url, data);
};

export { _get, _post, _delete, _put };
