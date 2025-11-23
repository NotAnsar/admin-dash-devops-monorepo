import { z } from 'zod';

export type State<T> = {
	errors?: { [K in keyof T]?: string[] };
	message?: string | null;
};

export type DeleteState = { message?: string | null; success?: boolean | null };
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function checkFile(image: FormDataEntryValue | null) {
	const imageFile = image as File | null;
	if (imageFile && imageFile?.size > 0) {
		return imageFile;
	}
	return undefined;
}

const checkFileType = (file: File) => {
	const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
	return allowedTypes.includes(file?.type);
};

export const imageSchema = z.object({
	file: z
		.any()
		.refine((file: File) => file?.size !== 0, 'File is required')
		.refine(
			(file: File) => file?.size < MAX_FILE_SIZE,
			`Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
		)
		.refine(
			(file: File) => checkFileType(file),
			'Only .png, .jpg, .jpeg formats are supported.'
		),
});
