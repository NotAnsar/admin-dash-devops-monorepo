'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCurrentUser } from '@/api/users';

import { DeleteState, State } from './utils';
import axiosInstance from '@/lib/axios';
import { USER_API } from '@/types/user';

const userSchema = z.object({
	firstName: z
		.string()
		.min(3, { message: 'First Name must be at least 3 characters long.' })
		.max(30, { message: 'First Name must be no longer than 30 characters.' }),
	lastName: z
		.string()
		.min(3, { message: 'Last Name must be at least 3 characters long.' })
		.max(30, { message: 'Last Name must be no longer than 30 characters.' }),
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long.' })
		.max(30, { message: 'Password must be no longer than 30 characters.' }),
	role: z.enum(['USER', 'ADMIN'], {
		message: 'Role must be either "user" or "admin".',
	}),
});

const userUpdateSchema = userSchema.omit({ password: true });

type UserData = z.infer<typeof userSchema>;
type UserUpdateData = z.infer<typeof userUpdateSchema>;

export type UserState = State<UserData>;
export type UserUpdateState = State<UserUpdateData>;

export async function createUser(
	prevState: UserState,
	formData: FormData
): Promise<UserState> {
	const validatedFields = userSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
		role: formData.get('role'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Create User.',
		};
	}

	try {
		const { email, firstName, lastName, role, password } = validatedFields.data;

		// Create the user via API
		const response = await axiosInstance.post(USER_API, {
			email,
			firstName,
			lastName,
			password,
			role,
		});

		if (!response.data || !response.data.success) {
			throw new Error('Failed to create user');
		}
	} catch (error: any) {
		console.error(error);

		// Handle the API error format
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
					message: apiError.message || 'Failed to create user.',
				};
			}

			return { message: apiError.message || 'Failed to create user.' };
		}

		return { message: error.message || 'Error: Failed to create user.' };
	}

	revalidatePath('/users', 'layout');
	redirect('/users');
}

export async function updateUser(
	id: string,
	prevState: UserUpdateState,
	formData: FormData
): Promise<UserUpdateState> {
	const validatedFields = userUpdateSchema.safeParse({
		email: formData.get('email'),
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
		role: formData.get('role'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Update User.',
		};
	}

	try {
		const { email, firstName, lastName, role } = validatedFields.data;

		// Update the user via API
		const response = await axiosInstance.patch(`${USER_API}/${id}`, {
			email,
			firstName,
			lastName,
			role,
		});

		if (!response.data || !response.data.success) {
			throw new Error('Failed to update user');
		}
	} catch (error: any) {
		console.error(error);

		// Handle the API error format
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
					message: apiError.message || 'Failed to update user.',
				};
			}

			return { message: apiError.message || 'Failed to update user.' };
		}

		return { message: error.message || 'Error: Failed to update user.' };
	}

	revalidatePath('/users', 'layout');
	redirect('/users');
}

export async function deleteUser(id: string): Promise<DeleteState> {
	try {
		// Get current user
		const currentUser = await getCurrentUser();

		// Don't allow deleting yourself
		if (currentUser && currentUser.id === id) {
			return { message: 'You cannot delete your own account.', success: false };
		}

		// Delete the user via API
		const response = await axiosInstance.delete(`${USER_API}/${id}`);

		if (response.data && !response.data.success) {
			return {
				message: response.data.message || 'Failed to delete user.',
				success: false,
			};
		}
	} catch (error: any) {
		console.error(error);

		if (error.response?.data) {
			return {
				message: error.response.data.message || 'Failed to delete user.',
				success: false,
			};
		}

		return {
			message: error.message || 'Failed to delete user.',
			success: false,
		};
	}

	revalidatePath('/users');
	return { message: 'User Was Deleted Successfully.', success: true };
}
