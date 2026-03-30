import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Attach Bearer token from store on every request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: attempt token refresh once, queue concurrent requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ accessToken: string }>(
        "/api/v1/auth/refresh",
        {},
        { withCredentials: true },
      );
      const newToken = data.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Token accessors — late-bound to avoid circular dependency with authStore
let _getToken: (() => string | null) | null = null;
let _setToken: ((t: string) => void) | null = null;
let _clearToken: (() => void) | null = null;

export function registerTokenAccessors(
  get: () => string | null,
  set: (t: string) => void,
  clear: () => void,
) {
  _getToken = get;
  _setToken = set;
  _clearToken = clear;
}

function getAccessToken() {
  return _getToken?.() ?? null;
}

function setAccessToken(token: string) {
  _setToken?.(token);
}

function clearAccessToken() {
  _clearToken?.();
}
