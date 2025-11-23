// API endpoint
export const HOME_API = '/api/home';

// TypeScript interfaces matching the Java DTOs
export interface DashboardSummary {
	totalClients: number;
	totalProducts: number;
	totalRevenue: number;
	totalSales: number;
}

export interface MonthlyRevenue {
	month: string; // Format: "YYYY-MM"
	revenue: number;
}

export interface RecentOrder {
	id: string;
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	total: number;
	createdAt: string;
	status: string;
}

export interface InventoryAlert {
	productId: string;
	productName: string;
	currentStock: number;
	lowStock: boolean;
	categoryName: string;
	archived: boolean;
	productPrice: number;
}

export interface CategorySales {
	categoryId: string;
	categoryName: string;
	totalOrders: number;
	totalRevenue: number;
}
