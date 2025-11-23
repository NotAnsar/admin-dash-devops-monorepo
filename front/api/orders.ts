import { Order, ORDER_API } from '@/types/order';
import axiosInstance from '@/lib/axios';

/**
 * Fetch all orders
 */
export async function fetchOrders() {
	try {
		const response = await axiosInstance.get(ORDER_API);
		return response.data.data as Order[];
	} catch (error) {
		console.error('Error fetching orders:', error);
		throw new Error('Failed to fetch orders.');
	}
}

/**
 * Fetch a order by ID
 */
export async function fetchOrderById(id: string) {
	try {
		const response = await axiosInstance.get(`${ORDER_API}/${id}`);
		return response.data.data as Order;
	} catch (error) {
		console.error(`Error fetching order ${id}:`, error);
		return null;
	}
}
