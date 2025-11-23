// 'use client';

// import { buttonVariants } from '@/components/ui/button';
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from '@/components/ui/card';
// import { FormControl, FormField, FormItem } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { toast } from '@/components/ui/use-toast';
// import { cn } from '@/lib/utils';
// import { Trash2, Upload } from 'lucide-react';
// import Image from 'next/image';

// import { useMemo } from 'react';

// export default function ProductImages({ isLoading }: { isLoading: boolean }) {
// 	return (
// 		<Card className='overflow-hidden'>
// 			<CardHeader>
// 				<CardTitle>Product Images</CardTitle>
// 				<CardDescription>
// 					Upload and manage your product images here.
// 					<br />
// 					Minimum 1 image, maximum 4 images.
// 				</CardDescription>
// 			</CardHeader>
// 			<CardContent>
// 				<FormField
// 					control={form.control}
// 					name='images'
// 					render={({ field, fieldState }) => {
// 						return (
// 							<FormItem className='grid gap-1 '>
// 								<FormControl>
// 									<>
// 										<div className={cn('grid gap-2 mb-2 grid-cols-2')}>
// 											{field.value.map((image, i) => (
// 												<ProductImage
// 													src={image}
// 													key={i}
// 													remove={() => {
// 														const updatedImages = field.value.filter(
// 															(_, index) => index !== i
// 														);
// 														form.setValue('images', updatedImages);
// 													}}
// 												/>
// 											))}
// 										</div>

// 										<div className={cn('grid grid-cols-1 gap-2')}>
// 											<label
// 												className={cn(
// 													buttonVariants({ variant: 'ghost' }),
// 													'flex h-12 w-full items-center justify-center rounded-md border border-dashed hover:cursor-pointer relative'
// 												)}
// 												htmlFor='images'
// 											>
// 												<Upload className='h-auto w-4 aspect-square text-muted-foreground' />
// 												<span className='sr-only'>Upload</span>
// 												<Input
// 													type='file'
// 													accept='.jpg,.jpeg,.png'
// 													id='images'
// 													readOnly
// 													multiple
// 													max='4'
// 													min='1'
// 													required
// 													className='sr-only'
// 													disabled={isLoading}
// 													onChange={(e) => {
// 														if (e.target.files) {
// 															const newImages = Array.from(e.target.files);
// 															const totalImages =
// 																field.value.length + newImages.length;

// 															if (totalImages > 4) {
// 																toast({
// 																	title: 'Maximum number of images',
// 																	description:
// 																		'You can only upload a maximum of 4 images.',
// 																});
// 																return;
// 															}

// 															form.setValue('images', [
// 																...field.value,
// 																...newImages,
// 															]);
// 														}
// 													}}
// 												/>
// 											</label>
// 										</div>
// 									</>
// 								</FormControl>

// 								{fieldState.error && (
// 									<p className='text-sm text-destructive'>
// 										1-4 images required. Each must be PNG/JPEG/JPG, max 1 MB per
// 										Image.
// 									</p>
// 								)}
// 							</FormItem>
// 						);
// 					}}
// 				/>
// 			</CardContent>
// 		</Card>
// 	);
// }

// export function ProductImage({
// 	src,
// 	remove,
// }: {
// 	src: string | File;
// 	remove: () => void;
// }) {
// 	const imageUrl = useMemo(
// 		() => (typeof src === 'string' ? src : URL.createObjectURL(src)),
// 		[src]
// 	);

// 	return (
// 		<div className='grid gap-2'>
// 			<div className='relative group rounded-md border border-border overflow-hidden'>
// 				<Image
// 					src={imageUrl}
// 					alt=''
// 					width={700}
// 					height={700}
// 					className='w-full h-auto aspect-square object-cover'
// 				/>
// 				<span
// 					className='w-full h-full aspect-square place-items-center bg-secondary/90 hidden cursor-pointer group-hover:grid absolute inset-0'
// 					onClick={remove}
// 				>
// 					<Trash2 className='w-3/12 h-auto text-destructive' />
// 				</span>
// 			</div>
// 		</div>
// 	);
// }

'use client';

import { buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types/product';
import { ProductState } from '@/actions/product-action';
import ErrorMessage from '@/components/ErrorMessage';

export default function ProductImages({
	product,
	state,
}: {
	state: ProductState;
	product?: Product;
}) {
	const [image, setImage] = useState<string | File | null>(
		product?.images ? product.images[0].url : null
	);

	return (
		<Card className='overflow-hidden'>
			<CardHeader>
				<CardTitle>Product Image</CardTitle>
				<CardDescription>
					Upload your product image here.
					<br />
					The image must be in PNG/JPEG/JPG format.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-4'>
					{/* Image preview area */}
					{image && (
						<div className='max-w-[300px] mx-auto w-[300px]'>
							<ProductImage src={image} remove={() => setImage(null)} />
						</div>
					)}

					{/* Upload button */}
					<div className={cn('grid grid-cols-1')}>
						<label
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'flex h-12 w-full items-center justify-center rounded-md border border-dashed hover:cursor-pointer relative'
							)}
							htmlFor='image'
						>
							<Upload className='h-auto w-4 aspect-square text-muted-foreground mr-2' />
							{image ? 'Change Image' : 'Upload Image'}
							<Input
								type='file'
								accept='.jpg,.jpeg,.png'
								id='image'
								name='image'
								className='sr-only'
								onChange={(e) => {
									if (e.target.files && e.target.files[0]) {
										setImage(e.target.files[0]);
									}
								}}
							/>
						</label>
					</div>

					{/* Hidden input for existing image */}
					{typeof image === 'string' && (
						<input type='hidden' name='existingImageUrl' value={image} />
					)}

					{/* Error message */}
					{state.errors?.image && <ErrorMessage errors={state.errors?.image} />}
				</div>
			</CardContent>
		</Card>
	);
}

export function ProductImage({
	src,
	remove,
}: {
	src: string | File;
	remove: () => void;
}) {
	const imageUrl = typeof src === 'string' ? src : URL.createObjectURL(src);

	return (
		<div className='grid gap-2 '>
			<div className='relative group rounded-md border border-border overflow-hidden w-full'>
				<Image
					src={imageUrl}
					alt='Product image'
					width={700}
					height={700}
					className='w-full h-auto aspect-square object-cover'
				/>
				<span
					className='w-full h-full aspect-square place-items-center bg-secondary/90 hidden cursor-pointer group-hover:grid absolute inset-0'
					onClick={remove}
				>
					<Trash2 className='w-3/12 h-auto text-destructive' />
				</span>
			</div>
		</div>
	);
}
