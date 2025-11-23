'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Product, PRODUCT_API } from '@/types/product';
import { checkFile, DeleteState, imageSchema, State } from './utils';

const productSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Product Name must be at least 3 characters long.' }),
	description: z.string().min(3, {
		message: 'Product Description must be at least 3 characters long.',
	}),
	price: z.coerce
		.number()
		.positive({ message: 'Price must be a positive number' }),
	stock: z.coerce
		.number()
		.int()
		.min(0, { message: 'Stock must be a non-negative integer' }),
	colorId: z.string({ message: 'Please provide a valid color identifier.' }),
	sizeId: z.string({ message: 'Please provide a valid size identifier.' }),
	featured: z.boolean(),
	categoryId: z.string({
		message: 'Please provide a valid category identifier.',
	}),
	archived: z.boolean(),
	image: imageSchema.shape.file.optional(),
});

// You can also export the inferred type if needed
type ProductSchemaType = z.infer<typeof productSchema>;

export type ProductState = State<ProductSchemaType>;

/**
 * Create a new product
 */
export async function createProduct(
	prevState: ProductState,
	formData: FormData
): Promise<ProductState> {
	const validatedFields = productSchema.safeParse({
		name: formData.get('name') || undefined,
		description: formData.get('description') || undefined,
		price: parseFloat(formData.get('price') as string),
		stock: parseInt(formData.get('stock') as string, 10),
		colorId: formData.get('colorId') || undefined,
		sizeId: formData.get('sizeId') || undefined,
		categoryId: formData.get('categoryId') || undefined,
		featured: formData.get('featured') === 'true',
		archived: formData.get('archived') === 'true',
		image: await checkFile(formData.get('image')),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid product data. Please check the form fields.',
		};
	}

	try {
		const {
			name,
			description,
			price,
			stock,
			featured,
			archived,
			colorId,
			sizeId,
			categoryId,
			image,
		} = validatedFields.data;

		// Format data according to the Java backend expectations
		const productData = {
			name,
			description,
			price,
			stock,
			featured,
			archived,
			colorId,
			sizeId,
			categoryId,
		};

		// 1. Create the product via API
		const productResponse = await axiosInstance.post(PRODUCT_API, productData);

		if (!productResponse.data || !productResponse.data.success) {
			throw new Error('Failed to create product');
		}

		// 2. If image is provided, upload it to the newly created product
		if (image) {
			const productId = productResponse.data.data.id;
			const imageFormData = new FormData();
			imageFormData.append('files', image);

			const imageResponse = await axiosInstance.post(
				`${PRODUCT_API}/${productId}/images`,
				imageFormData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (!imageResponse.data || !imageResponse.data.success) {
				console.error('Image upload failed, but product was created');
			}
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
					message: apiError.message || 'Failed to create product.',
				};
			}

			return { message: apiError.message || 'Failed to create product.' };
		}

		return { message: error.message || 'Error: Failed to create product.' };
	}

	revalidatePath('/products');
	redirect('/products');
}

/**
 * Update an existing product
 */
export async function updateProduct(
	id: string,
	prevState: ProductState,
	formData: FormData
): Promise<ProductState> {
	// Get image file first to handle it separately
	const image = await checkFile(formData.get('image'));
	const existingImageUrl = formData.get('existingImageUrl');

	if (!image && !existingImageUrl) {
		return {
			errors: { image: ['Please provide an image file.'] },
			message: 'Image is required.',
		};
	}

	const validatedFields = productSchema.omit({ image: true }).safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		price: parseFloat(formData.get('price') as string),
		stock: parseInt(formData.get('stock') as string, 10),
		colorId: formData.get('colorId') || undefined,
		sizeId: formData.get('sizeId') || undefined,
		categoryId: formData.get('categoryId') || undefined,
		featured: formData.get('featured') === 'true',
		archived: formData.get('archived') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid product data. Please check the form fields.',
		};
	}

	try {
		const {
			name,
			description,
			price,
			stock,
			featured,
			archived,
			colorId,
			sizeId,
			categoryId,
		} = validatedFields.data;

		// Format data according to the Java backend expectations
		const productData = {
			name,
			description,
			price,
			stock,
			featured,
			archived,
			colorId,
			sizeId,
			categoryId,
		};

		// 1. Update the product via API
		const productResponse = await axiosInstance.patch(
			`${PRODUCT_API}/${id}`,
			productData
		);

		if (!productResponse.data || !productResponse.data.success) {
			throw new Error('Failed to update product');
		}

		const product = productResponse.data.data as Product;

		if (image) {
			if (
				product.images &&
				Array.isArray(product.images) &&
				product.images.length > 0
			) {
				try {
					const imagesIds = product.images.map((img) => img.id);

					await Promise.all(
						imagesIds.map((id) =>
							axiosInstance.delete(`${PRODUCT_API}/images/${id}`)
						)
					);
				} catch (error) {
					console.error('Failed to delete existing images', error);
				}
			}

			const imageFormData = new FormData();
			imageFormData.append('files', image);

			const imageResponse = await axiosInstance.post(
				`${PRODUCT_API}/${id}/images`,
				imageFormData,
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			);

			if (!imageResponse.data || !imageResponse.data.success) {
				console.error('Image upload failed, but product was updated');
			}
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
					message: apiError.message || 'Failed to update product.',
				};
			}

			return { message: apiError.message || 'Failed to update product.' };
		}

		return { message: error.message || 'Error: Failed to update product.' };
	}

	revalidatePath('/products');
	redirect('/products');
}

export async function deleteProduct(id: string): Promise<DeleteState> {
	try {
		// Delete the product via API
		const response = await axiosInstance.delete(`${PRODUCT_API}/${id}`);

		if (response.data && !response.data.success) {
			return {
				message: response.data.message || 'Failed to delete product.',
				success: false,
			};
		}
	} catch (error: any) {
		if (error.response?.data) {
			return {
				message: error.response.data.message || 'Failed to delete product.',
				success: false,
			};
		}

		return {
			message: error.message || 'Failed to delete product.',
			success: false,
		};
	}

	revalidatePath('/products', 'layout');
	return {
		message: 'Product Was Deleted Successfully.',
		success: true,
	};
}

export async function toggleArchiveProduct(id: string): Promise<DeleteState> {
	try {
		// Toggle the archive status of the product via API
		const response = await axiosInstance.patch(
			`${PRODUCT_API}/${id}/toggle-archive`
		);

		if (response.data && !response.data.success) {
			return {
				message:
					response.data.message || 'Failed to toggle product archive status.',
				success: false,
			};
		}
	} catch (error: any) {
		if (error.response?.data) {
			return {
				message:
					error.response.data.message ||
					'Failed to toggle product archive status.',
				success: false,
			};
		}

		return {
			message: error.message || 'Failed to toggle product archive status.',
			success: false,
		};
	}

	revalidatePath('/products', 'layout');
	return {
		message: 'Product archive status was toggled successfully.',
		success: true,
	};
}
