// API endpoint
export const ANALYTICS_API = '/api/analytics';

// TypeScript interfaces matching the Java DTOs
export interface RevenueTrend {
	date: string;
	revenue: number;
	orders: number;
}

export interface CategoryPerformance {
	category: string;
	sales: number;
}

export interface OrderStatus {
	status: string;
	count: number;
}

export interface TopProduct {
	name: string;
	sales: number;
}

export interface CustomerSegment {
	month: string;
	new: number;
	returning: number;
}

export interface InventoryStatus {
	name: string;
	stock: number;
	threshold: number;
}

export interface SalesByDay {
	day: string;
	sales: number;
	transactions: number;
}
