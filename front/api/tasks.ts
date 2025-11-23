import axiosInstance from '@/lib/axios';
import { Task, ApiResponse, TASK_API } from '@/types/tasks';

export const fetchTasks = async (): Promise<Task[]> => {
	try {
		const response = await axiosInstance.get<ApiResponse<Task[]>>(TASK_API);
		return response.data.data;
	} catch (error) {
		console.error('Error fetching tasks:', error);
		throw error;
	}
};

export const createTask = async (
	task: Omit<Task, 'id' | 'createdAt'>
): Promise<Task> => {
	try {
		const response = await axiosInstance.post<ApiResponse<Task>>(
			TASK_API,
			task
		);
		return response.data.data;
	} catch (error) {
		console.error('Error creating task:', error);
		throw error;
	}
};

export const updateTask = async (
	id: string,
	task: Partial<Task>
): Promise<Task> => {
	try {
		const response = await axiosInstance.patch<ApiResponse<Task>>(
			`${TASK_API}/${id}`,
			task
		);
		return response.data.data;
	} catch (error) {
		console.error('Error updating task:', error);
		throw error;
	}
};

export const deleteTask = async (id: string): Promise<void> => {
	try {
		await axiosInstance.delete(`${TASK_API}/${id}`);
	} catch (error) {
		console.error('Error deleting task:', error);
		throw error;
	}
};
