'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { State } from './utils';
import axiosInstance from '@/lib/axios';
import { revalidatePath } from 'next/cache';

const resetPasswordSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ResetData = z.infer<typeof resetPasswordSchema>;
export type ResetState = (State<ResetData> & { success?: boolean }) | undefined;

export async function recoverPassword(
	prevState: ResetState,
	formData: FormData
): Promise<ResetState> {
	const validatedFields = resetPasswordSchema.safeParse({
		email: formData.get('email'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Send Reset Link.',
		};
	}

	const { email } = validatedFields.data;

	try {
		const res = await axiosInstance.post(`/api/auth/forgot-password`, {
			email,
		});
		if (res.data.success) {
			revalidatePath('/', 'layout');
			return {
				message: res.data.message || 'Reset link sent successfully.',
				success: true,
			};
		} else {
			return { message: res.data.message || 'Failed to send reset link.' };
		}
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
					message: apiError.message || 'Failed to send reset link.',
				};
			}

			return { message: apiError.message || 'Failed to send reset link.' };
		}

		return { message: error.message || 'Error: Failed to send reset link.' };
	}
}

const updatePasswordSchema = z
	.object({
		password: z.string().min(8, 'Password must be at least 8 characters long.'),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters long.'),
	})
	.refine(
		(values) => {
			return values.password === values.confirmPassword;
		},
		{
			message: 'Passwords must match!',
			path: ['confirmPassword'],
		}
	);

type UpdatePassData = z.infer<typeof updatePasswordSchema>;
export type UpdatePassState =
	| (State<UpdatePassData> & { success?: boolean })
	| undefined;

export async function updatePassword(
	token: string,
	prevState: UpdatePassState,
	formData: FormData
): Promise<UpdatePassState> {
	if (!token) redirect('/auth/password-recovery');

	const validatedFields = updatePasswordSchema.safeParse({
		password: formData.get('password'),
		confirmPassword: formData.get('confirmPassword'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Update Password.',
		};
	}

	const { password } = validatedFields.data;

	try {
		const res = await axiosInstance.post(`/api/auth/reset-password`, {
			password,
			token,
		});
		if (res.data.success) {
			revalidatePath('/auth/update-password');
			return {
				message: res.data.message || 'Password updated successfully.',
				success: true,
			};
		} else {
			return { message: res.data.message || 'Failed to update password.' };
		}
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
					message: apiError.message || 'Failed to update password.',
				};
			}

			return { message: apiError.message || 'Failed to update password.' };
		}

		return { message: error.message || 'Error: Failed to update password.' };
	}
}
