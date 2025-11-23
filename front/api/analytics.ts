import axiosInstance from '@/lib/axios';
import {
	RevenueTrend,
	CategoryPerformance,
	OrderStatus,
	TopProduct,
	CustomerSegment,
	InventoryStatus,
	SalesByDay,
	ANALYTICS_API,
} from '@/types/analytics';

/**
 * Get revenue and order trends over time
 */
export async function fetchRevenueTrends(timeRange: string) {
	try {
		const response = await axiosInstance.get(
			`${ANALYTICS_API}/revenue-trends?timeRange=${timeRange}`
		);

		return response.data.data as RevenueTrend[];
	} catch (error) {
		console.error('Error fetching revenue trends:', error);
		return null;
	}
}

/**
 * Get sales performance by category
 */
export async function fetchCategoryPerformance(timeRange: string) {
	try {
		const response = await axiosInstance.get(
			`${ANALYTICS_API}/category-performance?timeRange=${timeRange}`
		);

		return response.data.data as CategoryPerformance[];
	} catch (error) {
		console.error('Error fetching category performance:', error);
		return null;
	}
}

/**
 * Get order status distribution
 */
export async function fetchOrderStatusDistribution(timeRange: string) {
	try {
		const response = await axiosInstance.get(
			`${ANALYTICS_API}/order-status?timeRange=${timeRange}`
		);

		return response.data.data as OrderStatus[];
	} catch (error) {
		console.error('Error fetching order status distribution:', error);
		return null;
	}
}

/**
 * Get top selling products
 */
export async function fetchTopSellingProducts(timeRange: string) {
	try {
		const response = await axiosInstance.get(
			`${ANALYTICS_API}/top-products?timeRange=${timeRange}`
		);

		return response.data.data as TopProduct[];
	} catch (error) {
		console.error('Error fetching top selling products:', error);
		return null;
	}
}

/**
 * Get customer segmentation data
 */
export async function fetchCustomerSegmentation(timeRange: string) {
	try {
		const response = await axiosInstance.get(
			`${ANALYTICS_API}/customer-segmentation?timeRange=${timeRange}`
		);

		return response.data.data as CustomerSegment[];
	} catch (error) {
		console.error('Error fetching customer segmentation:', error);
		return null;
	}
}

/**
 * Get inventory status
 */
export async function fetchInventoryStatus() {
	try {
		const response = await axiosInstance.get(
			`${ANALYTICS_API}/inventory-status`
		);

		return response.data.data as InventoryStatus[];
	} catch (error) {
		console.error('Error fetching inventory status:', error);
		return null;
	}
}

/**
 * Get sales by day of week
 */
export async function fetchSalesByDayOfWeek(timeRange: string) {
	try {
		const response = await axiosInstance.get(
			`${ANALYTICS_API}/sales-by-day?timeRange=${timeRange}`
		);

		return response.data.data as SalesByDay[];
	} catch (error) {
		console.error('Error fetching sales by day of week:', error);
		return null;
	}
}
