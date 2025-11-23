import axios from 'axios';
import { deleteSession, getUserSession } from './session';

// Create axios instance
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
	if (typeof window === 'undefined') {
		const session = await getUserSession();
		if (session && session.token) {
			config.headers['Authorization'] = `Bearer ${session.token}`;
		}
	}

	return config;
});

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (process.env.NODE_ENV === 'development') {
			console.error('API Error:', {
				url: error.config?.url,
				method: error.config?.method,
				status: error.response?.status,
				data: error.response?.data,
			});
		}

		const originalRequest = error.config;

		// Handle token expiration
		if (error.response?.status === 401 && !originalRequest._retry) {
			// If we're on the server side, handle session expiration
			if (typeof window === 'undefined') {
				// Don't delete session on API routes to avoid redirect loops
				if (!originalRequest.url?.includes('/api/')) {
					deleteSession();
				}
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
