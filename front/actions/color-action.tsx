'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { DeleteState, State } from './utils';
import axiosInstance from '@/lib/axios';
import { COLOR_API } from '@/types/color';

const formSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Color Name is required' })
		.max(50, { message: 'Color Name must be at most 50 characters' }),
	value: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Color Value must be a valid hexadecimal color code (e.g., #ffffff or #fff)'
		),
});

type ColorData = z.infer<typeof formSchema>;
export type ColorState = State<ColorData> | undefined;

export async function createColor(
	prevState: ColorState,
	formData: FormData
): Promise<ColorState> {
	const validatedFields = formSchema.safeParse({
		name: formData.get('name'),
		value: formData.get('value'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Create Product Color.',
		};
	}

	const { name, value } = validatedFields.data;
	try {
		// Create the color via API
		const response = await axiosInstance.post(COLOR_API, { name, value });

		if (!response.data || !response.data.success) {
			throw new Error('Failed to create color.');
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
					message: apiError.message || 'Failed to create color.',
				};
			}

			return { message: apiError.message || 'Failed to create color.' };
		}

		return { message: error.message || 'Error: Failed to create color.' };
	}

	revalidatePath('/colors', 'layout');
}

export async function updateColor(
	id: string,
	prevState: ColorState,
	formData: FormData
): Promise<ColorState> {
	const validatedFields = formSchema.safeParse({
		name: formData.get('name'),
		value: formData.get('value'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Update Product Color.',
		};
	}

	const { name, value } = validatedFields.data;
	try {
		// Update the color via API
		const response = await axiosInstance.patch(`${COLOR_API}/${id}`, {
			name,
			value,
		});

		if (!response.data || !response.data.success) {
			throw new Error('Failed to update color.');
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
					message: apiError.message || 'Failed to update color.',
				};
			}

			return { message: apiError.message || 'Failed to update color.' };
		}

		return { message: error.message || 'Error: Failed to update color.' };
	}

	revalidatePath('/colors', 'layout');
}

export async function deleteColor(id: string): Promise<DeleteState> {
	try {
		// Delete the color via API
		const response = await axiosInstance.delete(`${COLOR_API}/${id}`);

		if (response.data && !response.data.success) {
			return {
				message: response.data.message || 'Failed to delete color.',
				success: false,
			};
		}
	} catch (error: any) {
		if (error.response?.data) {
			return {
				message: error.response.data.message || 'Failed to delete color.',
				success: false,
			};
		}

		return {
			message: error.message || 'Failed to delete color.',
			success: false,
		};
	}

	revalidatePath('/colors', 'layout');
	return {
		message: 'Product Color Was Deleted Successfully.',
		success: true,
	};
}
