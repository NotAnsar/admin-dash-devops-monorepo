import { Category, CATEGORY_API } from '@/types/category';
import axiosInstance from '@/lib/axios';

/**
 * Fetch all categories
 */
export async function fetchCategories() {
	try {
		const response = await axiosInstance.get(CATEGORY_API);
		return response.data.data as Category[];
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw new Error('Failed to fetch categories.');
	}
}

/**
 * Fetch a category by ID
 */
export async function fetchCategoryById(id: string) {
	try {
		const response = await axiosInstance.get(`${CATEGORY_API}/${id}`);
		return response.data.data as Category;
	} catch (error) {
		console.error(`Error fetching category ${id}:`, error);
		throw new Error(`Failed to fetch category with ID ${id}.`);
	}
}
