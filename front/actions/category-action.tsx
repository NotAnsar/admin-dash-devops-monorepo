'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { DeleteState, State } from './utils';
import axiosInstance from '@/lib/axios';
import { CATEGORY_API } from '@/types/category';

const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Category Name must be at least 3 characters long.' })
		.max(50, {
			message: 'Category Name must be no longer than 50 characters.',
		}),
});

type CategoryData = z.infer<typeof formSchema>;
export type CategoryState = State<CategoryData> | undefined;

export async function createCategory(
	prevState: CategoryState,
	formData: FormData
): Promise<CategoryState> {
	const validatedFields = formSchema.safeParse({ name: formData.get('name') });

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Create Product Category.',
		};
	}

	const { name } = validatedFields.data;
	try {
		// Create the category via API
		const response = await axiosInstance.post(CATEGORY_API, { name });

		if (!response.data || !response.data.success) {
			throw new Error('Failed to create category.');
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
					message: apiError.message || 'Failed to create category.',
				};
			}

			return { message: apiError.message || 'Failed to create category.' };
		}

		return { message: error.message || 'Error: Failed to create category.' };
	}

	revalidatePath('/categories', 'layout');
}

export async function updateCategory(
	id: string,
	prevState: CategoryState,
	formData: FormData
): Promise<CategoryState> {
	const validatedFields = formSchema.safeParse({ name: formData.get('name') });

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Update Product Category.',
		};
	}

	const { name } = validatedFields.data;
	try {
		// Update the category via API
		const response = await axiosInstance.patch(`${CATEGORY_API}/${id}`, {
			name,
		});

		if (!response.data || !response.data.success) {
			throw new Error('Failed to update category.');
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
					message: apiError.message || 'Failed to update category.',
				};
			}

			return { message: apiError.message || 'Failed to update category.' };
		}

		return { message: error.message || 'Error: Failed to update category.' };
	}

	revalidatePath('/categories', 'layout');
}

export async function deleteCategory(id: string): Promise<DeleteState> {
	try {
		// Delete the category via API
		const response = await axiosInstance.delete(`${CATEGORY_API}/${id}`);

		if (response.data && !response.data.success) {
			return {
				message: response.data.message || 'Failed to delete category.',
				success: false,
			};
		}
	} catch (error: any) {
		if (error.response?.data) {
			return {
				message: error.response.data.message || 'Failed to delete category.',
				success: false,
			};
		}

		return {
			message: error.message || 'Failed to delete category.',
			success: false,
		};
	}

	revalidatePath('/categories', 'layout');
	return {
		message: 'Product Category Was Deleted Successfully.',
		success: true,
	};
}
