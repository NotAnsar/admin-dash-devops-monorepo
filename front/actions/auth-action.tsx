'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSession, deleteSession } from '@/lib/session';
import { State } from './utils';
import axiosInstance from '@/lib/axios';
import axios from 'axios';

const signInSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long.' })
		.max(30, { message: 'Password must be no longer than 30 characters.' }),
});

type SignInData = z.infer<typeof signInSchema>;

export type SignInState = State<SignInData>;

export async function signinAction(
	prevState: SignInState,
	formData: FormData
): Promise<SignInState> {
	const validatedFields = signInSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Sign in.',
		};
	}

	try {
		const res = await axiosInstance.post(
			`/api/auth/login`,
			validatedFields.data
		);

		if (res.data.success) {
			if (res.data.user.role === 'USER') {
				return {
					message: 'You are not authorized to access this application.',
				};
			}

			await createSession(res.data.user.id + '', res.data.token, res.data.user);
		} else {
			return { message: res.data.message || 'Login failed. Please try again.' };
		}
	} catch (error) {
		// Provide more specific error messages based on response status
		if (axios.isAxiosError(error)) {
			if (error.response?.data) {
				return {
					message:
						error.response.data.message || 'Login failed. Please try again.',
				};
			}

			if (error.response?.status === 401) {
				return { message: 'Invalid email or password.' };
			} else if (error.response?.status === 429) {
				return { message: 'Too many login attempts. Please try again later.' };
			} else if (error.response?.data?.message) {
				return { message: error.response.data.message };
			}
		}

		return {
			message: 'Authentication service unavailable. Please try again later.',
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}
export async function signinGuest(
	prevState: SignInState
): Promise<SignInState> {
	try {
		const res = await axiosInstance.post(`/api/auth/guest-login`);

		if (res.data.success) {
			await createSession(res.data.user.id + '', res.data.token, res.data.user);
		} else {
			return { message: res.data.message || 'Login failed. Please try again.' };
		}
	} catch (error) {
		// Provide more specific error messages based on response status
		if (axios.isAxiosError(error)) {
			if (error.response?.data) {
				return {
					message:
						error.response.data.message || 'Login failed. Please try again.',
				};
			}

			if (error.response?.data?.message) {
				return { message: error.response.data.message };
			}
		}

		return {
			message: 'Authentication service unavailable. Please try again later.',
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function logout() {
	await deleteSession();
	redirect('/login');
}
