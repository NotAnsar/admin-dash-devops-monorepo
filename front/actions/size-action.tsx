'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { DeleteState, State } from './utils';
import axiosInstance from '@/lib/axios';
import { SIZE_API } from '@/types/size';

const formSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Size Name is required' })
		.max(50, { message: 'Size Name must be at most 50 characters' }),
	fullname: z
		.string()
		.max(100, { message: 'Full Name must be at most 100 characters' })
		.optional(),
});

type SizeData = z.infer<typeof formSchema>;
export type SizeState = State<SizeData> | undefined;

export async function createSize(
	prevState: SizeState,
	formData: FormData
): Promise<SizeState> {
	const validatedFields = formSchema.safeParse({
		name: formData.get('name'),
		fullname: formData.get('fullname') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Create Size.',
		};
	}

	const { name, fullname } = validatedFields.data;
	try {
		// Create the size via API
		const response = await axiosInstance.post(SIZE_API, { name, fullname });

		if (!response.data || !response.data.success) {
			throw new Error('Failed to create size.');
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
					message: apiError.message || 'Failed to create size.',
				};
			}

			return { message: apiError.message || 'Failed to create size.' };
		}

		return { message: error.message || 'Error: Failed to create size.' };
	}

	revalidatePath('/sizes', 'layout');
}

export async function updateSize(
	id: string,
	prevState: SizeState,
	formData: FormData
): Promise<SizeState> {
	const validatedFields = formSchema.safeParse({
		name: formData.get('name'),
		fullname: formData.get('fullname') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Update Size.',
		};
	}

	const { name, fullname } = validatedFields.data;
	try {
		// Update the size via API
		const response = await axiosInstance.patch(`${SIZE_API}/${id}`, {
			name,
			fullname,
		});

		if (!response.data || !response.data.success) {
			throw new Error('Failed to update size.');
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
					message: apiError.message || 'Failed to update size.',
				};
			}

			return { message: apiError.message || 'Failed to update size.' };
		}

		return { message: error.message || 'Error: Failed to update size.' };
	}

	revalidatePath('/sizes', 'layout');
}

export async function deleteSize(id: string): Promise<DeleteState> {
	try {
		// Delete the size via API
		const response = await axiosInstance.delete(`${SIZE_API}/${id}`);

		if (response.data && !response.data.success) {
			return {
				message: response.data.message || 'Failed to delete size.',
				success: false,
			};
		}
	} catch (error: any) {
		if (error.response?.data) {
			return {
				message: error.response.data.message || 'Failed to delete size.',
				success: false,
			};
		}

		return {
			message: error.message || 'Failed to delete size.',
			success: false,
		};
	}

	revalidatePath('/sizes', 'layout');
	return {
		message: 'Size Was Deleted Successfully.',
		success: true,
	};
}
