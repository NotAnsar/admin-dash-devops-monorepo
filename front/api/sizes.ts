import { Size, SIZE_API } from '@/types/size';
import axiosInstance from '@/lib/axios';

/**
 * Fetch all sizes
 */
export async function fetchSizes() {
	try {
		const response = await axiosInstance.get(SIZE_API);
		return response.data.data as Size[];
	} catch (error) {
		console.error('Error fetching sizes:', error);
		throw new Error('Failed to fetch sizes.');
	}
}

/**
 * Fetch a size by ID
 */
export async function fetchSizeById(id: string) {
	try {
		const response = await axiosInstance.get(`${SIZE_API}/${id}`);
		return response.data.data as Size;
	} catch (error) {
		console.error(`Error fetching size ${id}:`, error);
		throw new Error(`Failed to fetch size with ID ${id}.`);
	}
}
