import { Product, PRODUCT_API } from '@/types/product';
import axiosInstance from '@/lib/axios';

/**
 * Fetch all products
 */
export async function fetchProducts() {
	try {
		const response = await axiosInstance.get(PRODUCT_API);
		return response.data.data as Product[];
	} catch (error) {
		console.error('Error fetching products:', error);
		throw new Error('Failed to fetch products.');
	}
}

/**
 * Fetch a product by ID
 */
export async function fetchProductById(id: string) {
	try {
		const response = await axiosInstance.get(`${PRODUCT_API}/${id}`);
		return response.data.data as Product;
	} catch (error) {
		console.error(`Error fetching product ${id}:`, error);
		throw new Error(`Failed to fetch product with ID ${id}.`);
	}
}
