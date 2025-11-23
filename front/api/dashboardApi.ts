import axiosInstance from '@/lib/axios';

// Products API
export const productsApi = {
	search: async (params: Record<string, any>) => {
		const response = await axiosInstance.get('/api/chat/products/search', {
			params,
		});
		return response.data;
	},
};

// Orders API
export const ordersApi = {
	search: async (params: Record<string, any>) => {
		const response = await axiosInstance.get('/api/chat/orders/search', {
			params,
		});
		return response.data;
	},
};

// Users API
export const usersApi = {
	search: async (params: Record<string, any>) => {
		const response = await axiosInstance.get('/api/chat/users/search', {
			params,
		});
		return response.data;
	},
};

// Multi-query API
export const queryApi = {
	multiQuery: async (body: Record<string, any>) => {
		const response = await axiosInstance.post('/api/chat/query', body);
		return response.data;
	},
};

// SQL Query API
export const sqlApi = {
	execute: async (query: string) => {
		console.log('query :', query);

		const response = await axiosInstance.post('/api/query/execute', { query });
		return response.data;
	},
};
