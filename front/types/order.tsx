// API endpoint
export const ORDER_API = '/api/orders';

export type Order = {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	total: number;
	createdAt: string;
	status: OrderStatus;
	items: OrderItem[];
};

export type OrderItem = {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	subtotal: number;
};

export type OrderStatus = 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELED';

export const statusEnumValues: {
	value: OrderStatus;
	label: string;
}[] = [
	{ value: 'NEW', label: 'New' },
	{ value: 'PROCESSING', label: 'Processing' },
	{ value: 'CANCELED', label: 'Canceled' },
	{ value: 'COMPLETED', label: 'Completed' },
];
