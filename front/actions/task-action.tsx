'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import axiosInstance from '@/lib/axios';
import { Task, TASK_API } from '@/types/tasks';
import { DeleteState, State } from './utils';

// Task validation schemas
const taskSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Title must be at least 2 characters long.' })
		.max(100, { message: 'Title must be no longer than 100 characters.' }),
	description: z
		.string()
		.max(500, { message: 'Description must be no longer than 500 characters.' })
		.optional(),
	status: z.enum(['todo', 'in-progress', 'done'], {
		message: 'Status must be either "todo", "in-progress", or "done".',
	}),
	priority: z.enum(['low', 'medium', 'high'], {
		message: 'Priority must be either "low", "medium", or "high".',
	}),
});

const taskUpdateSchema = taskSchema.partial();

type TaskData = z.infer<typeof taskSchema>;
type TaskUpdateData = z.infer<typeof taskUpdateSchema>;

export type TaskState = State<TaskData> & { success?: boolean };
export type TaskUpdateState = State<TaskUpdateData> & { success?: boolean };

/**
 * Fetches all tasks
 */
export async function fetchTasks(): Promise<Task[]> {
	try {
		const response = await axiosInstance.get(TASK_API);
		return response.data.data;
	} catch (error: any) {
		console.error('Failed to fetch tasks:', error);
		throw new Error(error?.response?.data?.message || 'Failed to fetch tasks');
	}
}

/**
 * Creates a new task
 */
export async function createTask(
	prevState: TaskState,
	formData: FormData
): Promise<TaskState> {
	const validatedFields = taskSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description') || '',
		status: formData.get('status'),
		priority: formData.get('priority'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid task data. Please check the form.',
		};
	}

	try {
		const { title, description, status, priority } = validatedFields.data;

		// Create the task via API
		const response = await axiosInstance.post(TASK_API, {
			title,
			description,
			status,
			priority,
		});

		if (!response.data || !response.data.success) {
			throw new Error('Failed to create task');
		}

		revalidatePath('/kanban', 'layout');
		return { message: 'Task created successfully.', success: true };
	} catch (error: any) {
		console.error(error);

		// Handle API error format
		if (error.response?.data) {
			const apiError = error.response.data;

			if (!apiError.success && apiError.errors) {
				// Map API field errors to our error format
				const fieldErrors: Record<string, string[]> = {};

				for (const [field, message] of Object.entries(apiError.errors)) {
					fieldErrors[field] = [message as string];
				}

				return {
					errors: fieldErrors,
					message: apiError.message || 'Failed to create task.',
				};
			}

			return { message: apiError.message || 'Failed to create task.' };
		}

		return { message: error.message || 'Error: Failed to create task.' };
	}
}

/**
 * Updates an existing task
 */
export async function updateTask(
	id: string,
	prevState: TaskUpdateState,
	formData: FormData
): Promise<TaskUpdateState> {
	const validatedFields = taskUpdateSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
		status: formData.get('status'),
		priority: formData.get('priority'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid task data. Please check the form.',
		};
	}

	try {
		const { title, description, status, priority } = validatedFields.data;

		// Update the task via API
		const response = await axiosInstance.patch(`${TASK_API}/${id}`, {
			title,
			description,
			status,
			priority,
		});

		if (!response.data || !response.data.success) {
			throw new Error('Failed to update task');
		}

		revalidatePath('/kanban', 'layout');
		return { message: 'Task updated successfully.', success: true };
	} catch (error: any) {
		console.error(error);

		// Handle API error format
		if (error.response?.data) {
			const apiError = error.response.data;

			if (!apiError.success && apiError.errors) {
				// Map API field errors to our error format
				const fieldErrors: Record<string, string[]> = {};

				for (const [field, message] of Object.entries(apiError.errors)) {
					fieldErrors[field] = [message as string];
				}

				return {
					errors: fieldErrors,
					message: apiError.message || 'Failed to update task.',
				};
			}

			return { message: apiError.message || 'Failed to update task.' };
		}

		return { message: error.message || 'Error: Failed to update task.' };
	}
}

export async function updateTaskStatus(
	id: string,
	status: string
): Promise<TaskUpdateState> {
	try {
		const response = await axiosInstance.patch(`/api/tasks/${id}/status`, {
			status,
		});

		if (!response.data.success) {
			return {
				success: false,
				message: response.data.message || 'Failed to update task status',
			};
		}

		revalidatePath('/kanban');
		return {
			success: true,
			message: 'Status updated successfully',
		};
	} catch (error: any) {
		console.error('Error updating task status:', error);
		return {
			success: false,
			message: error.response?.data?.message || 'Failed to update task status',
		};
	}
}

/**
 * Deletes a task
 */
export async function deleteTask(id: string): Promise<DeleteState> {
	try {
		const response = await axiosInstance.delete(`${TASK_API}/${id}`);

		if (response.data && !response.data.success) {
			return {
				message: response.data.message || 'Failed to delete task.',
				success: false,
			};
		}

		revalidatePath('/kanban');
		return { message: 'Task deleted successfully.', success: true };
	} catch (error: any) {
		console.error(error);

		if (error.response?.data) {
			return {
				message: error.response.data.message || 'Failed to delete task.',
				success: false,
			};
		}

		return {
			message: error.message || 'Failed to delete task.',
			success: false,
		};
	}
}
