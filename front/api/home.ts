import axiosInstance from '@/lib/axios';
import {
	DashboardSummary,
	CategorySales,
	InventoryAlert,
	MonthlyRevenue,
	RecentOrder,
	HOME_API,
} from '@/types/home';

/**
 * Get dashboard summary statistics
 */
export async function fetchDashboardSummary() {
	try {
		const response = await axiosInstance.get(`${HOME_API}/summary`);

		return response.data.data as DashboardSummary;
	} catch (error) {
		console.error('Error fetching dashboard summary:', error);
		return null;
	}
}

/**
 * Get monthly revenue for the last 6 months
 */
export async function fetchMonthlyRevenue() {
	try {
		const response = await axiosInstance.get(`${HOME_API}/revenue`);

		return response.data.data as MonthlyRevenue[];
	} catch (error) {
		console.error('Error fetching monthly revenue:', error);
		return null;
	}
}

/**
 * Get recent orders (latest 10)
 */
export async function fetchRecentOrders() {
	try {
		const response = await axiosInstance.get(`${HOME_API}/recent-orders`);

		return response.data.data as RecentOrder[];
	} catch (error) {
		console.error('Error fetching recent orders:', error);

		return null;
	}
}

/**
 * Get products with low stock (inventory alert)
 */
export async function fetchInventoryAlerts() {
	try {
		const response = await axiosInstance.get(`${HOME_API}/inventory-alert`);

		return response.data.data as InventoryAlert[];
	} catch (error) {
		console.error('Error fetching inventory alerts:', error);
		return null;
	}
}

/**
 * Get sales performance by category
 */
export async function fetchCategorySalesPerformance() {
	try {
		const response = await axiosInstance.get(
			`${HOME_API}/category-performance`
		);

		return response.data.data as CategorySales[];
	} catch (error) {
		console.error('Error fetching category sales performance:', error);
		return null;
	}
}
