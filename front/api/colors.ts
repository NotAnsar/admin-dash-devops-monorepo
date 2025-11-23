import { Color, COLOR_API } from '@/types/color';
import axiosInstance from '@/lib/axios';

/**
 * Fetch all colors
 */
export async function fetchColors() {
	try {
		const response = await axiosInstance.get(COLOR_API);
		return response.data.data as Color[];
	} catch (error) {
		console.error('Error fetching colors:', error);
		throw new Error('Failed to fetch colors.');
	}
}

/**
 * Fetch a color by ID
 */
export async function fetchColorById(id: string) {
	try {
		const response = await axiosInstance.get(`${COLOR_API}/${id}`);
		return response.data.data as Color;
	} catch (error) {
		console.error(`Error fetching color ${id}:`, error);
		throw new Error(`Failed to fetch color with ID ${id}.`);
	}
}
