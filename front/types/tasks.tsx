export type Task = {
	id: string;
	title: string;
	description: string;
	status: 'todo' | 'in-progress' | 'done';
	priority: 'low' | 'medium' | 'high';
	createdAt: string;
};

export type ApiResponse<T> = {
	message: string;
	success: boolean;
	data: T;
};

// API endpoints
export const TASK_API = '/api/tasks';
