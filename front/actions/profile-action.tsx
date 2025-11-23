'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import axiosInstance from '@/lib/axios';
import {
	deleteSession,
	getUserSession,
	updateSessionUser,
} from '@/lib/session';
import { State } from './utils';
import axios from 'axios';

const formSchema = z.object({
	fname: z
		.string()
		.min(3, { message: 'First Name must be at least 3 characters long.' })
		.max(30, { message: 'First Name must be no longer than 30 characters.' }),
	lname: z
		.string()
		.min(3, { message: 'Last Name must be at least 3 characters long.' })
		.max(30, { message: 'Last Name must be no longer than 30 characters.' }),
});

type ProfileData = z.infer<typeof formSchema>;
export type ProfileState = State<ProfileData>;

export async function updateUser(
	prevState: ProfileState,
	formData: FormData
): Promise<ProfileState> {
	const validatedFields = formSchema.safeParse({
		fname: formData.get('fname'),
		lname: formData.get('lname'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to update profile.',
		};
	}

	const { fname: firstName, lname: lastName } = validatedFields.data;

	try {
		const res = await axiosInstance.patch(`/api/profile`, {
			firstName,
			lastName,
		});

		if (res.data.success) {
			await updateSessionUser(res.data.data);
		} else {
			return {
				message: res.data.message || 'Update failed. Please try again.',
			};
		}
	} catch (error) {
		console.log(error, 'Profile update Error');

		if (axios.isAxiosError(error)) {
			if (error.response?.data) {
				const errorData = error.response.data;

				// Handle structured error response
				if (errorData.status === 401) {
					return {
						message:
							errorData.message ||
							'Authentication required. Please sign in again.',
					};
				}

				return {
					message:
						errorData.message ||
						`${errorData.error || 'Error'}: Update failed. Please try again.`,
				};
			}

			// Handle network errors or other HTTP errors
			return {
				message: `Error (${
					error.response?.status || 'network'
				}): Unable to connect to server.`,
			};
		}

		return {
			message: 'Authentication service unavailable. Please try again later.',
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function deleteAccount() {
	try {
		const res = await axiosInstance.delete(`/api/profile`);

		if (res.data.success) {
			await deleteSession();
		} else {
			return {
				title: 'Error',
				message: res.data.message || 'Delete failed. Please try again.',
			};
		}
	} catch (error) {
		console.log(error, 'Account deletion Error');

		if (axios.isAxiosError(error)) {
			if (error.response?.data) {
				const errorData = error.response.data;

				// Handle structured error response
				if (errorData.status === 401) {
					return {
						title: 'Authentication Error',
						message:
							errorData.message ||
							'Authentication required. Please sign in again.',
					};
				}

				return {
					title: errorData.error || 'Server Error',
					message: errorData.message || 'Delete failed. Please try again.',
				};
			}

			// Handle network errors or other HTTP errors
			return {
				title: 'Connection Error',
				message: `Unable to connect to server (${
					error.response?.status || 'network error'
				}).`,
			};
		}

		return {
			title: 'Unexpected Error',
			message: 'Account deletion service unavailable. Please try again later.',
		};
	}

	redirect('/auth/signin');
}
