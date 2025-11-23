export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	createdAt: string;
};

// API endpoints
export const USER_API = '/api/users';

export const USER_ROLES = [
	{ label: 'Admin', value: 'ADMIN' },
	{ label: 'User', value: 'USER' },
];
