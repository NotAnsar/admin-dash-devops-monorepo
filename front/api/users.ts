import { User, USER_API } from '@/types/user';
import axiosInstance from '@/lib/axios';

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser() {
	try {
		const response = await axiosInstance.get(`/api/profile`);
		return response.data.data as User;
	} catch (error) {
		console.error('Error getting current user:', error);
		return null;
	}
}

/**
 * Fetch all users
 */
export async function fetchUsers() {
	try {
		const response = await axiosInstance.get(USER_API);
		return response.data.data as User[];
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new Error('Failed to fetch Users.');
	}
}

/**
 * Fetch a user by ID
 */
export async function fetchUserById(id: string) {
	try {
		const response = await axiosInstance.get(`${USER_API}/${id}`);
		return response.data.data as User;
	} catch (error) {
		console.error(`Error fetching user ${id}:`, error);
		throw new Error(`Failed to fetch User with ID ${id}.`);
	}
}
