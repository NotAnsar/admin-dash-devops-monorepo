'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import axiosInstance from '@/lib/axios';
import { statusEnumValues } from '@/types/order';
import { State } from './utils';

// Define the API endpoint for orders
const ORDER_API = '/api/orders';

// Schema for validating status updates
const orderStatusSchema = z.object({
	status: z.enum(
		statusEnumValues.map((s) => s.value) as [string, ...string[]],
		{
			message: `Status must be one of the following: ${statusEnumValues
				.map((s) => s.label)
				.join(', ')}.`,
		}
	),
});

type StatusData = z.infer<typeof orderStatusSchema>;
export type StatusState = State<StatusData> & { success?: boolean | null };

export async function updateOrderStatus(
	id: string,
	prevState: StatusState,
	formData: FormData
): Promise<StatusState> {
	const validatedFields = orderStatusSchema.safeParse({
		status: formData.get('status'),
	});

	if (!validatedFields.success) {
		return {
			message: 'Invalid order status.',
			success: false,
		};
	}

	try {
		const { status } = validatedFields.data;

		// Update the order status via API
		const response = await axiosInstance.patch(`${ORDER_API}/${id}/status`, {
			status,
		});

		if (!response.data || !response.data.success) {
			return {
				message: response.data?.message || 'Failed to update order status.',
				success: false,
			};
		}

		// Revalidate the orders page to reflect changes
		revalidatePath('/orders', 'layout');

		return {
			message: 'Order status updated successfully.',
			success: true,
		};
	} catch (error: any) {
		console.error('Error updating order status:', error);

		// Handle API error format
		if (error.response?.data) {
			return {
				message:
					error.response.data.message || 'Failed to update order status.',
				success: false,
			};
		}

		return {
			message: error.message || 'Error: Failed to update order status.',
			success: false,
		};
	}
}
