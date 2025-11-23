export interface Message {
	role: 'user' | 'assistant';
	content: string;
}

export interface Product {
	id: string;
	name: string;
	price: number;
	stock: number;
	category: {
		id: string;
		name: string;
	};
	archived: boolean;
	featured: boolean;
	color?: {
		id: string;
		name: string;
		hexCode: string;
	};
	size?: {
		id: string;
		name: string;
		value: string;
	};
}

export interface Order {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	total: number;
	status: string;
	createdAt: string;
	updatedAt?: string;
	items: {
		productId: string;
		productName: string;
		quantity: number;
		price: number;
	}[];
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	createdAt: string;
	lastLoginAt?: string;
}

export interface ApiResponse<T> {
	message: string;
	success: boolean;
	data: T;
}

export interface ApiCall {
	endpoint: string;
	queryParams?: Record<string, any>;
	body?: Record<string, any>;
}
